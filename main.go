package main

import (
	"fmt"
	"log"
	"strings"
)

func main() {
	fmt.Println("\t:: konyako ::")
	fmt.Printf("[?] Check new/modified feeds markdown\n\n")

	konyako := Konyako{
		FeedsDirSrc: "./feeds",
		HTMLDir:     "../feeds",
		BaseUrl:     "/feeds",
		Meta: SiteMeta{
			Name: "konyako",
			Desc: "A blog for feeding feed",
		},
	}

	paths, err := konyako.CheckModified()
	if err != nil {
		log.Fatal(err)
	}

	for _, path := range paths {
		contents, err := konyako.ReadLine(path)
		if err != nil {
			log.Fatal(err)
		}

		topic := Topic{}
		blocks := konyako.ToBlocks(contents)
		for _, block := range blocks {
			feed := Feed{}
			for _, fragment := range block {
				feed.content += " " + strings.TrimPrefix(fragment, "> ")
				if GrabTitle(block) != "" {
					topic.title = GrabTitle(block)
					feed.title = GrabTitle(block)
				}
			}
			topic.feeds = append(topic.feeds, feed)
		}

		fmt.Printf("Id: %s\nTitle: %s\nFeeds:\n", topic.id, topic.title)
		for i, feed := range topic.feeds {
			fmt.Printf("Feed %d: (title => %s)\n", i, feed.title)
			fmt.Printf("Content:\n%s\n\n", feed.content)
		}

		fmt.Printf("\n")

		id := GenerateId("Tentang Manusia yang Berubah Wujud Menjadi Salmon")
		fmt.Println(id)
		fmt.Println(GetDate("<time>22:18 21 Aug 2023</time>"))

	}
}
