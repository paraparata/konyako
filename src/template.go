package main

import "fmt"

func Layout(meta string, title string, header string, main string) string {
	template := `
	<html lang="en">
		<head>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width" />
			<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			<link rel="stylesheet" href="/assets/feeds.css" />
			<script src="/assets/feeds.js" defer></script>
			%s
			<title>%s</title>
			<link rel="stylesheet" href="/assets/prism.css"/>
		</head>
		<body data-theme="light">
			%s
			<main>%s</main>
			<script src="/assets/prism.js"></script>
		</body>
	</html>
	`
	return fmt.Sprintf(template, meta, title, header, main)
}

func Meta(name, desc, title string) string {
	template := `
	<meta name="twitter:card" content="summary">
	<meta name="og:title" content="%[1]s">
	<meta name="og:site_name" content="%[2]s">
	<meta name="og:description" content="%[3]s">
	<meta name="description" content="%[3]s">
	`
	return fmt.Sprintf(template, title, name, desc)
}

func Header(baseUrl string) string {
	template := `
	<header>
		<nav>
			<ul>
				<li>
					<button id="theme-toggler">🔆</button>
				</li>
				<li>
					<a href="%s/">Feeds</a>
				</li>
				<li class="goto-homepage">
					<span>|</span>
					<a href="/">Homepage</a>
				</li>
			</ul>
		</nav>
	</header>
	`
	return fmt.Sprintf(template, baseUrl)
}

func Feeds(baseUrl string, id string, title string, feeds []string) string {
	emptyTemplate := `
	<p style="margin-top: 3rem; color: coral; text-align: center">
		x_x
		<br />
		<br />
		No data..
	</p>
	`
	if len(feeds) == 0 {
		return emptyTemplate
	}

	template := ""

	return template
}

func Feed(baseUrl string, id string, title string, content string, isTimeline bool) string {
	titleTemplate := `
	<a href="%s/%s" role="prefetch">
		<h3>
			<b>[%s]</b>
		</h3>
	</a>
	`

	template := `
	<article id="%s" class="feed" data-order="%s">
		<section class="feed_data">
			%s %s
		</section>
		<section class="feed_meta">
			%s
		</section>
	</article>
	`

	return template
}
