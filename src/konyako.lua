-- =====
-- utils
-- =====
local file_exists = function(file)
	local f = io.open(file, "rb")
	if f then
		f:close()
	end
	return f ~= nil
end

local lines_from = function(file)
	if not file_exists(file) then
		return {}
	end
	local lines = {}
	for line in io.lines(file) do
		lines[#lines + 1] = line
	end
	return lines
end

local table_len = function(tbl)
	local len = 0
	for _ in ipairs(tbl) do
		len = len + 1
	end
	return len
end

local is_empty = function(text)
	return text == "" or text == nil
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

local get_utc = function()
	local utc = os.date("!%Y-%m-%dT%H:%M:%SZ", os.time())
	return string.format("%s", utc)
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

-- =====
-- parser
-- =====
local TAG_PAIR = { ["#"] = "h1", [">"] = "p" }

local get_tag = function(text)
	local md_tag = string.sub(text, 0, 1)
	local tag = TAG_PAIR[md_tag]
	return tag
end

local trim = function(text)
	return string.gsub(text, "^%s*(.-)%s*$", "%1")
end

local remove_tag = function(text)
	return string.sub(text, 2)
end

local is_br = function(tag, text)
	local br = text
	if tag == TAG_PAIR[">"] and is_empty(text) then
		br = "<br/><br/>"
	end
	return br
end

local clean_markdown = function(text)
	local tag = get_tag(text)
	local content = trim(remove_tag(text))
	return is_br(tag, content)
end

local parse_to_html = function(cleaned_feed)
	local tag = get_tag(cleaned_feed)
	local content = trim(remove_tag(cleaned_feed))
	return string.format("<%s>%s</%s>", tag, content, tag)
end

local parser = function(lines, file)
	local data = { title = nil, feeds = {} }
	local last_index = nil

	for k, v in ipairs(lines) do
		if not is_empty(v) and get_tag(v) then
			if get_tag(v) == "h1" and data.title == nil then
				data.title = trim(remove_tag(v))
			else
				if last_index then
					data.feeds[last_index] = data.feeds[last_index] .. " " .. clean_markdown(v)
				else
					table.insert(data.feeds, v)
					last_index = table_len(data.feeds)
				end
			end
		else
			last_index = nil
		end
	end

	for k, v in ipairs(data.feeds) do
		data.feeds[k] = parse_to_html(v)
	end

	local date_file = io.open(file, "r")
	local date_lines = {}
	if date_file then
		for line in date_file:lines() do
			table.insert(date_lines, line)
		end
		io.close(date_file)
	end

	date_file = io.open(file, "w")
	if date_file then
		for k, v in ipairs(date_lines) do
			if
				not is_empty(v)
				and get_tag(v)
				and get_tag(v) ~= "h1"
				and not string.match(v, "<time*.*</time>")
				and date_lines[k + 1] == ""
			then
				local _date = string.format('\n> <time datetime="%s"></time>', get_utc())
				date_file:write("> " .. trim(remove_tag(v)) .. _date .. "\n")
			else
				date_file:write(v .. "\n")
			end
		end
		io.close(date_file)
	end

	return data
end

-- =====
-- html constructor
-- =====
local feed_htm = function(base_url, id, order, title, content, is_timeline)
	local date = ""
	local footer = ""
	if string.match(content, "<time*.*</time>") then
		date = string.match(content, "<time*.*</time>")
	else
		date = string.format('\n> <time datetime="%s"></time>', get_utc())
	end

	if is_timeline then
		footer = ""
	else
		footer = string.format(
			[[
      <section class="feed_meta">
        %s
      </section>
    ]],
			date
		)
	end

	local _content = string.gsub(content, "<time*.*</time>", "")
	local title_htm = string.format(
		[[
    <a href="%s/%s" role="prefetch">
      <h1>
        <b>[%s]</b>
      </h1>
    </a>
  ]],
		base_url,
		id,
		title
	)
	local template = string.format(
		[[
    <article class="feed" data-order="%s">
      <section class="feed_data">
        %s %s
      </section>
      %s
    </article>
  ]],
		order,
		is_empty(title) and "" or title_htm,
		_content,
		footer
	)

	return template
end

local feeds_htm = function(base_url, id, title, feeds)
	local empty_htm = [[
    <p style="margin-top: 3rem; color: coral; text-align: center">
      x_x
      <br />
      <br />
      No data..
    </p>
  ]]
	if table_len(feeds) == 0 then
		return empty_htm
	end

	local template = ""
	local _title = title and title or string.sub(feeds[0], 1, 10) .. ".."
	for k, feed in ipairs(feeds) do
		if k == 1 then
			template = template .. feed_htm(base_url, id, "", _title, feed)
		else
			template = template .. feed_htm(base_url, id, "", "", feed)
		end
	end
	return template
end

local header_htm = function(base_url)
	local template = string.format(
		[[
    <header>
      <nav>
        <ul>
          <li>
            <button id="theme-toggler">🔆</button>
          </li>
          <li>
            <a href="%s/">Topics</a>
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
		base_url,
		base_url
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
          <p><em>%s</em> — Baked with konyako</p>
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

local construct = function(base_url, id, data_table, name, desc)
	local header = header_htm(base_url)
	local main = feeds_htm(base_url, id, data_table.title, data_table.feeds)
	local meta = meta_htm(name, desc, data_table.title)
	local layout = layout_htm(name, meta, data_table.title, header, main)
	return layout
end

-- =====
-- setup
-- =====
local FEEDS_DIR = "./feeds"
local HTML_DIR = "../feeds"
local BASE_URL = "/feeds"
local NAME = "konyako"
local DESC = "A blog for feeding feed"
local git_check_command = string.format("git ls-files -mo --exclude-from=../.gitignore %s", FEEDS_DIR)

print("\t:: konyako ::\n")
print("[?] Check new/modified feeds markdown")

for k, file in pairs(check_feeds_status(git_check_command)) do
	local lines = lines_from(file)
	local feeds_table = parser(lines, file)
	local feeds_id = string.gsub(string.match(file, "([^/]+)$"), ".md", ".html")
	local html = construct(BASE_URL, feeds_id, feeds_table, NAME, DESC)
	local html_file = io.open(string.format("%s/%s", HTML_DIR, feeds_id), "w")
	if html_file then
		html_file:write(html)
		html_file:close()
	end

	print(string.format("[%s][**Done**] %s", k, file))
end

local timeline_main = ""
local timeline_list = scandir(HTML_DIR)
for key, value in pairs(timeline_list) do
	if key ~= 1 and key ~= 2 and value ~= "index.html" then
		timeline_main = timeline_main
			.. feed_htm(
				BASE_URL,
				value,
				"",
				string.format(string.gsub(string.gsub(value, "-", " "), ".html", "")),
				"",
				true
			)
	end
end

local timeline_html =
	layout_htm(NAME, meta_htm(NAME, DESC, "Timeline"), "Timeline", header_htm(BASE_URL), timeline_main)
local timeline_file = io.open(string.format("%s/%s.html", HTML_DIR, "index"), "w")

if timeline_file then
	timeline_file:write(timeline_html)
	timeline_file:close()
	print("\n[#][**Done**] Feeds Timeline")
end
