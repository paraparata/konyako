package main

import (
	"bufio"
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
