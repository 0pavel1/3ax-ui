package service

import (
	"regexp"
	"strings"
	"unicode"
)

var cyrillicRegex = regexp.MustCompile(`^[а-яА-ЯёЁ]+$`)

// IsStrictCyrillic returns true if the string contains only Cyrillic letters (no spaces, numbers, or symbols).
func IsStrictCyrillic(s string) bool {
	s = strings.TrimSpace(s)
	if s == "" {
		return false
	}
	return cyrillicRegex.MatchString(s)
}

var cyrillicToLatinMap = map[rune]string{
	'а': "a", 'б': "b", 'в': "v", 'г': "g", 'д': "d",
	'е': "e", 'ё': "yo", 'ж': "zh", 'з': "z", 'и': "i",
	'й': "y", 'к': "k", 'л': "l", 'м': "m", 'н': "n",
	'о': "o", 'п': "p", 'р': "r", 'с': "s", 'т': "t",
	'у': "u", 'ф': "f", 'х': "kh", 'ц': "ts", 'ч': "ch",
	'ш': "sh", 'щ': "shch", 'ъ': "", 'ы': "y", 'ь': "",
	'э': "e", 'ю': "yu", 'я': "ya",
}

// Transliterate converts Russian text to lowercase Latin equivalent.
func Transliterate(s string) string {
	var sb strings.Builder
	for _, r := range strings.TrimSpace(s) {
		rLower := unicode.ToLower(r)
		if latin, ok := cyrillicToLatinMap[rLower]; ok {
			sb.WriteString(latin)
		} else if (rLower >= 'a' && rLower <= 'z') || (rLower >= '0' && rLower <= '9') {
			sb.WriteRune(rLower)
		}
	}
	return sb.String()
}

// ToUserSlug takes firstName and lastName (Russian), transliterates them and returns firstname_lastname.
func ToUserSlug(firstName, lastName string) string {
	fn := Transliterate(firstName)
	ln := Transliterate(lastName)
	if fn == "" && ln == "" {
		return "client"
	}
	if fn == "" {
		return ln
	}
	if ln == "" {
		return fn
	}
	return fn + "_" + ln
}
