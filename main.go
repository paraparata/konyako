package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	konya := Konyako{
		FeedSrcDir: "./srcf",
		OutputDir:  "./output",
		Meta: SiteMeta{
			Name: "Test",
			Desc: "Test desc",
		},
	}

	modifiedPaths, err := konya.CheckModified()
	if err != nil {
		log.Fatal(err)
	}

	for _, path := range modifiedPaths {
		data, err := os.ReadFile(path)
		if err != nil {
			log.Fatal(err)
		}
		topic := ParseTopic(data)
		html := konya.ComposeHtml(topic)
		fileName := strings.Replace(filepath.Base(path), ".md", ".html", 1)
		outputPath := filepath.Join(".", konya.OutputDir, fileName)

		if err := os.WriteFile(outputPath, []byte(html), 0666); err != nil {
			log.Fatal(err)
		}
		fmt.Println(outputPath)
	}
}
