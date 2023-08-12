-- =====
-- utils
-- =====
local file_exists = function(file)
  local f = io.open(file, "rb")
  if f then f:close() end
  return f ~= nil
end

local lines_from = function(file)
  if not file_exists(file) then return {} end
  local lines = {}
  for line in io.lines(file) do
    lines[#lines + 1] = line
  end
  return lines
end

local table_len = function(tbl)
  local len = 0
  for _ in ipairs(tbl) do len = len + 1 end
  return len
end

local is_empty = function(text)
  return text == "" or text == nil
end


local check_feeds_status = function(command_name)
  local process = io.popen(command_name)
  if process == nil then return {} end

  local lines = {}
  for line in process:lines() do
    lines[#lines + 1] = line
  end

  return lines
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
  if tag == TAG_PAIR['>'] and is_empty(text) then
    br = "<br/>"
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

local parser = function(lines)
  local data = { title = nil, feeds = {} }
  local last_index = nil

  for _, v in pairs(lines) do
    if not is_empty(v) and get_tag(v) then
      if get_tag(v) == 'h1' and data.title == nil then
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

  return data
end

-- =====
-- html constructor
-- =====
local feed_htm = function(base_url, id, order, title, content)
  local title_htm = string.format([[
    <a href="%s/feeds/%s" role="prefetch">
      <h3>
        <b>[%s]</b>
      </h3>
    </a>
  ]], base_url, id, title)
  local template = string.format([[
    <article id="%s" class="feed" data-order="%s">
      <section class="feed_data">
        %s %s
      </section>
      <section class="feed_meta">
        <time dateTime={data.created_at}>{formatDate(data.created_at)}</time>
      </section>
    </article>
  ]], id, order, is_empty(title) and "" or title_htm, content)

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
  if table_len(feeds) == 0 then return empty_htm end

  local template = ''
  local _title = title and title or string.sub(feeds[0], 1, 10) .. ".."
  for k, feed in ipairs(feeds) do
    if k == 1 then
      template = template .. feed_htm(base_url, id, '', _title, feed)
    else
      template = template .. feed_htm(base_url, id, '', '', feed)
    end
  end
  return template
end

local header_htm = function(base_url)
  local template = string.format([[
    <header>
      <nav>
        <ul>
          <li>
            <button id="theme-toggler">🔆</button>
          </li>
          <li>
            <a href="%s/feeds/">Feeds</a>
          </li>
          <li>
            <a href="%s/feeds/topics/">Topics</a>
          </li>
          <li class="goto-homepage">
            <span>|</span>
            <a href="/">Homepage</a>
          </li>
        </ul>
      </nav>
    </header>
  ]], base_url, base_url, base_url)
  return template
end

local layout_htm = function(meta, title, header, main)
  local template = string.format([[
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width' />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel="stylesheet" href="/assets/style.css" />
        %s
        <title>%s</title>
      </head>
      <body data-theme='light'>
        %s
        <main>%s</main>
      </body>
    </html>
  ]], meta, title, header, main)
  return template
end

local construct = function(base_url, id, data_table)
  local header = header_htm(base_url)
  local main = feeds_htm(base_url, id, data_table.title, data_table.feeds)
  local layout = layout_htm('', data_table.title, header, main)
  return layout
end

-- =====
-- setup
-- =====
local FEEDS_DIR = './feeds'
local SITE_DIR = '../feeds'
local git_check_command = string.format('git ls-files -mo --exclude-from=../.gitignore %s', FEEDS_DIR)

for k, file in pairs(check_feeds_status(git_check_command)) do
  local lines = lines_from(file)
  local feeds_table = parser(lines)
  local feeds_id = string.gsub(string.match(file, "([^/]+)$"), ".md", "")
  local html = construct(SITE_DIR, feeds_id, feeds_table)
  local html_file = io.open(string.format("%s/%s.html", SITE_DIR, feeds_id), 'w')
  html_file:write(html)
  html_file:close()
  print(string.format("[%s][**Done**] %s", k, file))
end