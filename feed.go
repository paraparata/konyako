package main

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"
)

// Feed block content, identified by sequence of `>` markdown file
type Feed struct {
	id      string
	content string
	date    string
}

type Topic struct {
	id    string
	title string
	feeds []Feed
	date  string
}

type LatestFeed []Feed

func GenerateId(s string) string {
	id := s
	if len([]rune(id)) > 50 {
		id = fmt.Sprint(string(id[49]))
	}

	for _, c := range id {
		if unicode.IsSpace(c) {
			id = strings.ToLower(strings.Replace(id, " ", "-", -1))
		}
	}

	return id
}

func GetDate(s string) string {
	date := ""
	re := regexp.MustCompile(`<time.*?>(.*)</time>`)
	submatch := re.FindAllStringSubmatch(s, -1)

	for _, el := range submatch {
		date = el[1]
		break
	}

	return date
}
