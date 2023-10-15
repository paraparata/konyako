package main

import (
	"bufio"
	"os/exec"
)

type SiteMeta struct {
	Name string
	Desc string
}

type Konyako struct {
	FeedSrcDir string
	OutputDir  string
	BaseUrl    string
	Meta       SiteMeta
}

func (k *Konyako) ComposeHtml(topic Topic) string {
	meta := MetaHtm(k.Meta.Name, k.Meta.Desc, k.Meta.Name)
	header := HeaderHtm("")
	main := ListHtm(k.BaseUrl, topic.feeds)
	template := LayoutHtm(meta, topic.title, header, main)
	return template
}

// A method to check new/modified feed path
func (k *Konyako) CheckModified() ([]string, error) {
	gitCheckCommand := []string{
		"ls-files",
		"-mo",
		// "--exclude-from=../.gitignore",
		k.FeedSrcDir,
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
