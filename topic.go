package main

import (
	"bytes"
	"log"
	"strings"
)

func NormalizeNewlines(d []byte) []byte {
	wi := 0
	n := len(d)
	for i := 0; i < n; i++ {
		c := d[i]
		// 13 is CR
		if c != 13 {
			d[wi] = c
			wi++
			continue
		}
		// replace CR (mac / win) with LF (unix)
		d[wi] = 10
		wi++
		if i < n-1 && d[i+1] == 10 {
			// this was CRLF, so skip the LF
			i++
		}

	}
	return d[:wi]
}

func isLastIndex[V any](i int, l []V) bool {
	return i == len(l)-1
}

func isDoubleNewline(i int, d []byte) bool {
	return i+1 != len(d) && d[i] == '\n' && d[i+1] == '\n'
}

func isValidToken(i int, d []byte) bool {
	logic := d[i] == '#' || d[i] == '>'

	if logic && (i == 0 || d[i-1] == '\n' || isLastIndex(i, d)) {
		return true
	}
	return false
}

func ToBlocks(d []byte) [][]byte {
	var blockEnd int
	blockStart := 0
	blocks := [][]byte{}
	for i := 0; i < len(d); i++ {
		if isDoubleNewline(i, d) || isLastIndex(i, d) {
			blockEnd = i
			blocks = append(blocks, d[blockStart:blockEnd+1])
			blockStart = i + 2
		}
	}
	return blocks
}

func FilterBlock(d []byte) []byte {
	inlineStart := -1
	inline := [][]byte{}
	for i := 0; i < len(d); i++ {
		isValid := d[i] == '#' || d[i] == '>'
		if isValid && inlineStart == -1 {
			inlineStart = i
		}
		if d[i] == '\n' && inlineStart != -1 {
			inline = append(inline, d[inlineStart:i+1])
			inlineStart = -1
		}
	}
	block := bytes.Join(inline, []byte(""))
	return block
}

func GetTitle(d []byte) string {
	if d[0] == '#' {
		return strings.TrimSpace(string(d[1:]))
	}
	return ""
}

func GetCleanFeed(d []byte) []byte {
	cleanFeed := []byte{}
	for i := 0; i < len(d); i++ {
		if !(d[i] == '>' && (i == 0 || d[i-1] == '\n')) {
			cleanFeed = append(cleanFeed, d[i])
		}
	}
	return cleanFeed
}

type Topic struct {
	title string
	feeds [][]byte
}

func ParseTopic(content []byte) Topic {
	data := NormalizeNewlines(content)
	if len(data) == 0 {
		log.Fatal("no data")
	}

	blocks := ToBlocks(data)
	var filteredBlocks [][]byte
	for _, block := range blocks {
		filtered := FilterBlock(block)
		if len(filtered) > 0 {
			filteredBlocks = append(filteredBlocks, filtered)
		}
	}

	topic := Topic{}
	for _, block := range filteredBlocks {
		title := GetTitle(block)
		if title != "" && topic.title == "" {
			topic.title = title
		} else {
			cleanFeed := GetCleanFeed(block)
			topic.feeds = append(topic.feeds, cleanFeed)
		}
	}

	return topic
}
