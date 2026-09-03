---
title: Системный мониторинг и OS-вызовы
description: Кроссплатформенный сбор метрик соединений TCP/UDP, загрузки CPU через /proc, Win32 API и sysctl, сигналы ОС
---

# Системный мониторинг и вызовы ОС (`util/sys/*`)

Пакет [`sys`](../../../util/sys/psutil.go) реализует платформо-зависимые механизмы сбора системных метрик хоста (активные TCP/UDP соединения, моментальная загрузка CPU) и полифиллы сигналов операционной системы без накладных расходов на cgo.

---

## 1. Платформенная матрица реализации

| Функция / Символ | Linux ([`sys_linux.go`](../../../util/sys/sys_linux.go)) | Windows ([`sys_windows.go`](../../../util/sys/sys_windows.go)) | macOS ([`sys_darwin.go`](../../../util/sys/sys_darwin.go)) |
| :--- | :--- | :--- | :--- |
| **`sys.SIGUSR1`** | `syscall.SIGUSR1` (реальный сигнал) | `syscall.Signal(0)` (полифилл-заглушка) | `syscall.SIGUSR1` |
| **`GetTCPCount()`** | Парсинг `/proc/net/tcp` и `tcp6` | `gopsutil/v4/net.Connections("tcp")` | `gopsutil/v4/net.Connections("tcp")` |
| **`GetUDPCount()`** | Парсинг `/proc/net/udp` и `udp6` | `gopsutil/v4/net.Connections("udp")` | `gopsutil/v4/net.Connections("udp")` |
| **`CPUPercentRaw()`** | Дельта тиков из `/proc/stat` | Win32 API `GetSystemTimes` | `unix.SysctlRaw("kern.cp_time")` |

---

## 2. Реализация под Linux (`sys_linux.go`)

### 2.1. Высокопроизводительный подсчет сетевых сокетов
В Linux сетевые сокеты ядра регистрируются в виртуальной файловой системе procfs (`/proc/net/tcp`, `/proc/net/tcp6`, `/proc/net/udp`, `/proc/net/udp6`). 

Для минимизации накладных расходов функция `getLinesNum` выполняет блочное чтение чанками по 8 КБ и подсчет байтов перевода строки `\n` через оптимизированный `bytes.IndexByte`, не аллоцируя строки в куче:

```go
func getLinesNum(filename string) (int, error)
```

Функция `safeGetLinesNum` проверяет существование файла через `os.Stat` и возвращает 0, если протокол IPv6 отключен на уровне ядра (отсутствует `/proc/net/tcp6`).

### 2.2. Расчет загрузки процессора (`CPUPercentRaw`)
Функция считывает первую строку `/proc/stat` вида:
```text
cpu  user nice system idle iowait irq softirq steal guest guest_nice
```
Вычисляются дельты времени между последовательными вызовами:
$$\text{idleAll} = \text{idle} + \text{iowait}$$
$$\text{nonIdle} = \text{user} + \text{nice} + \text{system} + \text{irq} + \text{softirq} + \text{steal}$$
$$\text{total} = \text{idleAll} + \text{nonIdle}$$
$$\text{CPU \%} = \frac{\Delta\text{total} - \Delta\text{idleAll}}{\Delta\text{total}} \times 100\%$$

Доступ к предыдущим значениям тиков защищен мьютексом `cpuMu sync.Mutex`. Первый вызов инициализирует базовую точку и возвращает 0.

---

## 3. Реализация под Windows (`sys_windows.go`)

### 3.1. Полифилл сигнала SIGUSR1
Поскольку в подсистеме Windows сигналы POSIX отсутствуют, константа объявляется как нулевой сигнал:
```go
var SIGUSR1 = syscall.Signal(0)
```
Это позволяет коду [`main.go`](../main.md) компилироваться под Windows без использования директив условной компиляции `//go:build`.

### 3.2. Нативный опрос CPU через Win32 API
Вместо медленного обращения к WMI или PowerShell используется прямой вызов функции `GetSystemTimes` из библиотеки `kernel32.dll`:

```go
var (
    modKernel32        = syscall.NewLazyDLL("kernel32.dll")
    procGetSystemTimes = modKernel32.NewProc("GetSystemTimes")
)
```

Функция заполняет структуры `filetime` (время ожидания `idleFT`, время ядра `kernelFT`, пользовательское время `userFT`), которые переводятся в 64-битные целые числа:
- В Windows время ядра (`kernelDelta`) уже включает в себя время бездействия (`idleDelta`).
- Полезная работа процессора рассчитывается как:
$$\text{total} = \Delta\text{kernel} + \Delta\text{user}$$
$$\text{busy} = \text{total} - \Delta\text{idle}$$
$$\text{CPU \%} = \frac{\text{busy}}{\text{total}} \times 100\%$$

---

## 4. Реализация под macOS (`sys_darwin.go`)

Для Darwin опрос тиков CPU производится через прямой системный вызов `unix.SysctlRaw("kern.cp_time")` без cgo:
- Возвращаются 5 машинных слов (в 64-битном или 32-битном представлении): `user`, `nice`, `sys`, `idle`, `intr`.
- Распаковка выполняется через `binary.LittleEndian`.
- Дельта вычисляется аналогично алгоритму Linux.
