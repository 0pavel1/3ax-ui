package service

import (
	"testing"
)

func TestIsStrictCyrillic(t *testing.T) {
	tests := []struct {
		input string
		want  bool
	}{
		{"Данил", true},
		{"Иванов", true},
		{"Артём", true},
		{"Щукин", true},
		{"Danil", false},
		{"Данил123", false},
		{"Данил Иванов", false},
		{"Данил-Иванов", false},
		{"", false},
		{"   ", false},
		{"Данил!", false},
	}

	for _, tt := range tests {
		got := IsStrictCyrillic(tt.input)
		if got != tt.want {
			t.Errorf("IsStrictCyrillic(%q) = %v, want %v", tt.input, got, tt.want)
		}
	}
}

func TestToUserSlug(t *testing.T) {
	tests := []struct {
		first string
		last  string
		want  string
	}{
		{"Данил", "Иванов", "danil_ivanov"},
		{"Артём", "Щукин", "artyom_shchukin"},
		{"Павел", "Сидоров", "pavel_sidorov"},
		{"Юлия", "Яковлева", "yuliya_yakovleva"},
		{"Жанна", "Цветкова", "zhanna_tsvetkova"},
		{"", "Иванов", "ivanov"},
		{"Данил", "", "danil"},
	}

	for _, tt := range tests {
		got := ToUserSlug(tt.first, tt.last)
		if got != tt.want {
			t.Errorf("ToUserSlug(%q, %q) = %q, want %q", tt.first, tt.last, got, tt.want)
		}
	}
}
