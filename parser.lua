local tag_pair = { ["#"] = "h1", [">"] = "p" }

-- =====
-- utils
-- =====
-- http://lua-users.org/wiki/FileInputOutput
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

-- =====
-- parser
-- =====

local get_tag = function(text)
  local md_tag = string.sub(text, 0, 1)
  local tag = tag_pair[md_tag]
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
  if tag == tag_pair['>'] and is_empty(text) then
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

-- =====
-- setup
-- =====
local file = './feeds/hello-world.md'
local lines = lines_from(file)
local feeds_arr = {}
local last_index = nil

for _, v in pairs(lines) do
  if not is_empty(v) and get_tag(v) then
    if last_index then
      feeds_arr[last_index] = feeds_arr[last_index] .. " " .. clean_markdown(v)
    else
      table.insert(feeds_arr, v)
      last_index = table_len(feeds_arr)
    end
  else
    last_index = nil
  end
end

for k, v in ipairs(feeds_arr) do
  print(k, parse_to_html(v))
end
