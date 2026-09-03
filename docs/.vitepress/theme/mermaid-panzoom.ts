import Panzoom from '@panzoom/panzoom'

/**
 * Initializes Miro-style Pan & Zoom on all Mermaid SVG diagrams in the page.
 */
export function initMermaidPanZoom() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const diagrams = document.querySelectorAll<HTMLElement>('.mermaid:not([data-panzoom-initialized])')

  diagrams.forEach((diagram) => {
    const svg = diagram.querySelector<SVGElement>('svg')
    if (!svg) return

    diagram.setAttribute('data-panzoom-initialized', 'true')

    // Create wrapper container
    const container = document.createElement('div')
    container.className = 'mermaid-miro-container'

    const viewport = document.createElement('div')
    viewport.className = 'mermaid-miro-viewport'

    // Create floating toolbar
    const toolbar = document.createElement('div')
    toolbar.className = 'mermaid-miro-toolbar'
    toolbar.innerHTML = `
      <button class="mermaid-miro-btn btn-zoom-in" title="Приблизить">+</button>
      <button class="mermaid-miro-btn btn-zoom-out" title="Отдалить">−</button>
      <button class="mermaid-miro-btn btn-reset" title="Сбросить масштаб">↺</button>
      <button class="mermaid-miro-btn btn-fullscreen" title="Открыть холст на весь экран (Miro Mode)">⛶</button>
    `

    // Create hint
    const hint = document.createElement('div')
    hint.className = 'mermaid-miro-hint'
    hint.textContent = '💡 Колесо мыши: масштаб | Перетаскивание: ЛКМ'

    // Insert elements
    diagram.parentNode?.insertBefore(container, diagram)
    viewport.appendChild(diagram)
    container.appendChild(viewport)
    container.appendChild(toolbar)
    container.appendChild(hint)

    // Setup panzoom on the svg
    const panzoom = Panzoom(svg, {
      maxScale: 6,
      minScale: 0.2,
      canvas: true,
      contain: 'outside'
    })

    viewport.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault()
      panzoom.zoomWithWheel(event)
    }, { passive: false })

    toolbar.querySelector('.btn-zoom-in')?.addEventListener('click', () => panzoom.zoomIn())
    toolbar.querySelector('.btn-zoom-out')?.addEventListener('click', () => panzoom.zoomOut())
    toolbar.querySelector('.btn-reset')?.addEventListener('click', () => panzoom.reset())

    // Fullscreen Miro Modal
    toolbar.querySelector('.btn-fullscreen')?.addEventListener('click', () => {
      openFullscreenMiroModal(svg)
    })
  })
}

function openFullscreenMiroModal(originalSvg: SVGElement) {
  const overlay = document.createElement('div')
  overlay.className = 'mermaid-modal-overlay'

  overlay.innerHTML = `
    <div class="mermaid-modal-header">
      <div class="title">Холст архитектурной схемы (Miro Canvas Mode)</div>
      <div class="controls">
        <button class="mermaid-miro-btn modal-zoom-in" title="Приблизить" style="color:#fff;">+</button>
        <button class="mermaid-miro-btn modal-zoom-out" title="Отдалить" style="color:#fff;">−</button>
        <button class="mermaid-miro-btn modal-reset" title="Сбросить" style="color:#fff;">↺</button>
        <button class="mermaid-miro-btn modal-close" title="Закрыть (Esc)" style="color:#fff; font-size:18px;">✕</button>
      </div>
    </div>
    <div class="mermaid-modal-viewport"></div>
  `

  const modalViewport = overlay.querySelector<HTMLElement>('.mermaid-modal-viewport')!
  const clonedSvg = originalSvg.cloneNode(true) as SVGElement
  clonedSvg.style.width = '100%'
  clonedSvg.style.height = '100%'
  modalViewport.appendChild(clonedSvg)

  document.body.appendChild(overlay)
  document.body.style.overflow = 'hidden'

  const modalPanzoom = Panzoom(clonedSvg, {
    maxScale: 15,
    minScale: 0.1,
    canvas: true
  })

  modalViewport.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault()
    modalPanzoom.zoomWithWheel(e)
  }, { passive: false })

  overlay.querySelector('.modal-zoom-in')?.addEventListener('click', () => modalPanzoom.zoomIn())
  overlay.querySelector('.modal-zoom-out')?.addEventListener('click', () => modalPanzoom.zoomOut())
  overlay.querySelector('.modal-reset')?.addEventListener('click', () => modalPanzoom.reset())

  const closeModal = () => {
    document.removeEventListener('keydown', onKeyDown)
    overlay.remove()
    document.body.style.overflow = ''
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
  }

  document.addEventListener('keydown', onKeyDown)
  overlay.querySelector('.modal-close')?.addEventListener('click', closeModal)
}
