package main

import (
	"fmt"
	"strings"
)

// 1. Split to blocks
// 2. Split to fragments
// 3. Split to inline

const TitleMark = "#"
const FeedBlockMark = ">"

type Blocks []Fragments

type Fragments []string

type Inline []string

type Lexer interface {
	ToBlocks(contents []string) Blocks

	// ToFragments(blocks Blocks) Fragments

	// ToInline(fragments Fragments) Inline
}

func (k *Konyako) ToBlocks(contents []string) Blocks {
	var blocks Blocks
	var rawFragments Fragments
	for _, content := range contents {
		if content == "" && len(rawFragments) != 0 {
			blocks = append(blocks, rawFragments)
			rawFragments = []string{}
		} else {
			if strings.HasPrefix(content, TitleMark) || strings.HasPrefix(content, FeedBlockMark) {
				rawFragments = append(rawFragments, content)
			}
		}
	}

	return blocks
}

func GrabTitle(fragment Fragments) string {
	if strings.HasPrefix(fragment[0], TitleMark) {
		return strings.TrimPrefix(fragment[0], fmt.Sprintf("%s ", TitleMark))
	}
	return ""
}
