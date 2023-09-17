package main

import "fmt"

func LayoutHtm(meta string, title string, header string, main string) string {
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

func MetaHtm(name, desc, title string) string {
	template := `
	<meta name="twitter:card" content="summary">
	<meta name="og:title" content="%[1]s">
	<meta name="og:site_name" content="%[2]s">
	<meta name="og:description" content="%[3]s">
	<meta name="description" content="%[3]s">
	`
	return fmt.Sprintf(template, title, name, desc)
}

func HeaderHtm(baseUrl string) string {
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

func FeedsHtm(baseUrl string, id string, title string, feeds []string) string {
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

func FeedTitleHtm(baseUrl, id, title string) string {
	titleTemplate := fmt.Sprintf(`
	<a href="%[1]s/%[2]s" role="prefetch">
		<h3>
			<b>[%[3]s]</b>
		</h3>
	</a>
	`, baseUrl, id, title)

	return titleTemplate
}

func FeedHtm(title, content, date string) string {
	template := fmt.Sprintf(`
	<article class="feed">
		<section class="feed_data">
			%[1]s %[2]s
		</section>
		<section class="feed_meta">
			%[3]s
		</section>
	</article>
	`, title, content, date)

	return template
}
