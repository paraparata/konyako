package main

import (
	"fmt"
	"strings"
)

// 1. Split to blocks
// 2. Split to fragments
// 3. Split to inline

type Blocks []byte

type Konya struct {
	titleMark string
	feedMark  string
	title     string
	blocks    []string
}

func NewKonya() *Konya {
	konya := Konya{
		titleMark: "#",
		feedMark:  ">",
	}
	return &konya
}

func (k *Konya) ToBlocks(contents []string) {
        
	for _, content := range contents {
		if content == "" && len(k.blocks) != 0 {
			k.blocks = append(k.blocks, rawFragments)
		} else {
			if strings.HasPrefix(content, TitleMark) || strings.HasPrefix(content, FeedBlockMark) {
				rawFragments = append(rawFragments, content)
			}
		}
	}

	/* data := NormalizeNewlines([]byte(content))

		for len(data) > 0 {
			if data[0] == k.titleMark {
	                  k.title =
			}

		} */

}

func GrabTitle(fragment Fragments) string {
	if strings.HasPrefix(fragment[0], TitleMark) {
		return strings.TrimPrefix(fragment[0], fmt.Sprintf("%s ", TitleMark))
	}
	return ""
}

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
