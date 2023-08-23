package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"os/exec"
)

type SiteMeta struct {
	Name string
	Desc string
}

type Konyako struct {
	FeedsDirSrc string
	HTMLDir     string
	BaseUrl     string
	Meta        SiteMeta
}

func (k *Konyako) ReadLine(path string) ([]string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	defer file.Close()

	var slice []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		slice = append(slice, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return slice, nil
}

// A method to check new/modified feed path
func (k *Konyako) CheckModified() ([]string, error) {
	gitCheckCommand := []string{
		"ls-files",
		"-mo",
		"--exclude-from=../.gitignore",
		k.FeedsDirSrc,
	}

	cmd := exec.Command("git", gitCheckCommand...)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return nil, err
	}
	scanner := bufio.NewScanner(stdout)
	err = cmd.Start()
	if err != nil {
		return nil, err
	}

	if scanner.Err() != nil {
		cmd.Process.Kill()
		cmd.Wait()
		return nil, scanner.Err()
	}

	var paths = []string{}
	for scanner.Scan() {
		paths = append(paths, scanner.Text())
	}
	cmd.Wait()
	return paths, nil
}

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

	for i, path := range paths {
		contents, err := konyako.ReadLine(path)
		if err != nil {
			log.Fatal(err)
		}

		for i, content := range contents {
			fmt.Printf("line %d: %s\n", i, content)
		}
		fmt.Printf("[%d][**Done**] %s\n", i, path)
	}

	fmt.Println("=====")
	meta := ""
	header := ""
	main := ""
	layout := Layout(meta, konyako.Meta.Name, header, main)
	fmt.Print(layout)
}
