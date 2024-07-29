local md = require("md")
local ok, re = pcall(require, "re")
if not ok then
	re = require("lulpeg").re
end

-- =====
-- utils
-- =====

local split = function(inputstr, sep)
	if sep == nil then
		sep = "%s"
	end
	local t = {}
	for str in string.gmatch(inputstr, "([^" .. sep .. "]+)") do
		table.insert(t, str)
	end
	return t
end

local check_feeds_status = function(command_name)
	local process = io.popen(command_name)
	if process == nil then
		return {}
	end

	local lines = {}
	for line in process:lines() do
		lines[#lines + 1] = line
	end

	return lines
end

local scandir = function(directory)
	local i, t = 0, {}
	local pfile = io.popen('ls -a "' .. directory .. '"')
	if pfile then
		for filename in pfile:lines() do
			i = i + 1
			t[i] = filename
		end
		pfile:close()
	end
	return t
end

local get_utc = function()
	local utc = os.date("!%Y-%m-%dT%H:%M:%SZ", os.time())
	return string.format("%s", utc)
end

local read_md = function(file)
	local f = io.open(file, "rb")
	if not f then
		return ""
	end

	local content = f:read("*a")
	local html = md.convert(content, {})
	f:close()

	local toolbar = string.format(
		[[
<div id="toolbar">
  <span>Built at:<br/><time>%s</time></span>
  <select name="sort-sections" id="sort-sections">
    <option value="latest">Latest</option>
    <option value="oldest">Oldest</option>
  </select>
</div>
  ]],
		get_utc()
	)
	return toolbar .. html
end

-- ===========
-- template
-- ===========

local header_htm = function(base_url, timeline_name)
	local template = string.format(
		[[
<header>
  <nav>
    <ul>
      <li>
        <button id="theme-toggler">🔆</button>
      </li>
      <li>
        <a href="%s/">%s</a>
      </li>
      <li class="goto-homepage">
        <span>|</span>
        <a href="/">Homepage</a>
      </li>
    </ul>
  </nav>
</header>
  ]],
		base_url,
		timeline_name
	)
	return template
end

local meta_htm = function(name, desc, title)
	local meta = string.format(
		[[
<meta name="twitter:card" content="summary">
<meta name="og:title" content="%s">
<meta name="og:site_name" content="%s">
<meta name="og:description" content="%s">
<meta name="description" content="%s">
  ]],
		title,
		name,
		desc,
		desc
	)
	return meta
end

local layout_htm = function(name, meta, title, header, main)
	local template = string.format(
		[[
<html lang="en">
  <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="stylesheet" href="/assets/feeds.css" />
    <script src="/assets/feeds.js" defer></script>
    %s
    <title>%s</title>
  </head>
  <body data-theme="light">
    %s
    <main>%s</main>
    <footer>
      <p><em>%s</em> — Baked with <a href="https://github.com/paraparata/konyako">konyako</a></p>
      <p>
        ◕
        <script>
          document.write(new Date().getFullYear());
        </script>
        ◕
      </p>
    </footer>
  </body>
</html>
  ]],
		meta,
		title,
		header,
		main,
		name
	)
	return template
end

local timeline_htm = function(url, title)
	return string.format(
		[[
<article>
  <a href="%s" role="prefetch">
    <h2>
      %s
    </h2>
  </a>
</article>
  ]],
		url,
		title
	)
end

-- =====
-- setup
-- =====
local FEEDS_DIR = "./notes"
local HTML_DIR = "../_site/notes"
local BASE_URL = "/notes"
local NAME = "konyako"
local DESC = "Markdown-based static-microblogging-like generator"
local TIMELINE = "Notes"

print("\t:: konyako ::\n")
print("[?] Check new/modified feeds markdown")

for k, st in pairs(check_feeds_status("git status -s")) do
	local arr_filepath = split(st, "/")
	local last = arr_filepath[#arr_filepath]
	local is_md = last:match("%.md")
	if not is_md then
		goto continue
	end

	local filename = last:gsub("%.md", "")
	filename = filename:gsub('"', "")

	local status = re.match(st, "%s{[MD]} / {'??'} -> 'A'")
	if status == "D" then
		local deleted_html = string.format("%s/%s", HTML_DIR, filename .. ".html")
		local f = io.open(deleted_html, "rb")
		if f then
			os.remove(deleted_html)
		end
		goto continue
	end

	local md_path = string.format("%s/%s", FEEDS_DIR, filename .. ".md")
	local main = read_md(md_path)
	local meta = meta_htm(NAME, DESC, filename)
	local header = header_htm(BASE_URL, TIMELINE)
	local html = layout_htm(NAME, meta, filename, header, main)
	local html_file = io.open(string.format("%s/%s", HTML_DIR, filename .. ".html"), "w")
	if html_file then
		html_file:write(html)
		html_file:close()
	end

	print(string.format("[%s][**Done**] %s", k, filename))
	::continue::
end

local timeline_main = string.format(
	[[
<div id="toolbar" style="transform: none">
  <span>Built at:<br/><time>%s</time></span>
</div>
]],
	get_utc()
)
local timeline_list = scandir(HTML_DIR)
for key, value in pairs(timeline_list) do
	if key ~= 1 and key ~= 2 and value ~= "index.html" then
		timeline_main = timeline_main
			.. timeline_htm(md.encode_uri(BASE_URL .. "/" .. value), string.format(string.gsub(value, ".html", "")))
	end
end

local timeline_html =
	layout_htm(NAME, meta_htm(NAME, DESC, TIMELINE), TIMELINE, header_htm(BASE_URL, TIMELINE), timeline_main)
local timeline_file = io.open(string.format("%s/%s.html", HTML_DIR, "index"), "w")

if timeline_file then
	timeline_file:write(timeline_html)
	timeline_file:close()
	print("\n[#][**Done**] Feeds Timeline")
end
