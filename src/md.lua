-- https://github.com/rokf/lua-md2html

local ok, re = pcall(require, "re")
if not ok then
	re = require("lulpeg").re
end

local M = {}

-- https://stackoverflow.com/questions/41942289/display-contents-of-tables-in-lua
function M.tprint(tbl, indent)
	if not indent then
		indent = 0
	end
	local toprint = string.rep(" ", indent) .. "{\r\n"
	indent = indent + 2
	for k, v in pairs(tbl) do
		toprint = toprint .. string.rep(" ", indent)
		if type(k) == "number" then
			toprint = toprint .. "[" .. k .. "] = "
		elseif type(k) == "string" then
			toprint = toprint .. k .. "= "
		end
		if type(v) == "number" then
			toprint = toprint .. v .. ",\r\n"
		elseif type(v) == "string" then
			toprint = toprint .. '"' .. v .. '",\r\n'
		elseif type(v) == "table" then
			toprint = toprint .. M.tprint(v, indent + 2) .. ",\r\n"
		else
			toprint = toprint .. '"' .. tostring(v) .. '",\r\n'
		end
	end
	toprint = toprint .. string.rep(" ", indent - 2) .. "}"
	return toprint
end

local function _encode_uri_char(char)
	return string.format("%%%0X", string.byte(char))
end

local function trim(s)
	return s:match("^%s*(.-)%s*$")
end

-- https://stackoverflow.com/questions/78225022/is-there-a-lua-equivalent-of-the-javascript-encodeuri-function
function M.encode_uri(uri)
	return (string.gsub(trim(uri), "[^%a%d%-_%.!~%*'%(%);/%?:@&=%+%$,#]", _encode_uri_char))
end

local function class_str(cls)
	if cls then
		return string.format(' class="%s"', cls)
	end
	return ""
end

local function construct_id(s)
	s = trim(s)
	s = s:gsub("[^%w%s]+", "")
	s = s:gsub("%s", "-")
	return s
end

local function construct_a(t, classes)
	local lt = ""
	if t.title then
		lt = ' title="' .. t.title .. '"'
	end
	return string.format('<a href="%s"%s%s>%s</a>', M.encode_uri(t.url), class_str(classes.a), lt, t.txt)
end

-- https://gammon.com.au/lpeg#using-the-re-module-for-describing-a-grammar
-- https://www.inf.puc-rio.br/~roberto/lpeg/re.html
function M.convert(md, classes)
	local pattern = re.compile(
		[[
  default <- {| (title / section / %nl)* |} -> join
  section <- {| h2 %nl+ (heading / list / ml_code / hr / quote / (!h2 para) / %nl)* |} -> concat_section
  list <- ulist / olist
  ulist <- {| ([-+] %s+ {| (formatter / { [^%nl] } )+ |} -> concat_line %nl)+ |} -> to_ulist
  olist <- {| ([0-9]+ '.' %s+ {| (formatter / { [^%nl] } )+ |} -> concat_line %nl)+ |} -> to_olist
  para <- {| paraline+ |} -> concat
  formatter <- link / b / i / ub / ui / s / sl_code / timestamp
  paraline <- {| (img / link / b / i / ub / ui / s / sl_code / timestamp / text)+ %nl |} -> concat_line
  heading <- {| {:depth: '#'^+3 :} %s+ {:title: [^%nl]+ :} %nl |} -> to_title
  h2 <- {| {:depth: '##' :} %s+ {:title: ([^#%nl]+) :} %nl |} -> to_title
  title <- {| {:depth: '#' :} %s+ {:title: [^#%nl]+ :} %nl |} -> to_title
  timestamp <- {|'@' {:txt: [^@|]* :} %s* '|' %s* {:datetime: [^@|]* :} '@'|} -> to_time
  b <- {| '**' {:b: {| (ui / {[^*]})+ |} :} '**' |} -> to_b
  ub <- {| '__' {:b: {| {[^_]+} |}  :} '__' |} -> to_b
  i <- {| '*' {:i: [^*]+ :} '*' |} -> to_i
  ui <- {| '_' {:i: [^_]+ :} '_' |} -> to_i
  s <- {| '~~' {:s: [^~]+ :} '~~' |} -> to_s
  img <- '!' (linkpat -> to_img)
  link <- linkpat -> to_a
  linkpat <- {| '[' {:txt: [^]%nl]+ :} ']' %s* '(' {:url: [^%s)]+ :} %s* link_title^-1 ')' |}
  link_title <- '"' {:title:  { [^"]+ }  :} '"'
  text <- { [^*~_%nl[`]+ }
  hr <- { '---' / '***' / '___' } -> '<hr>'
  quote <- {| ('>' %s+ paraline)+ |} -> to_quote
  sl_code <- ('`' { [^`%nl]* } '`') -> to_code
  ml_code <- {|'```' {:lang: [a-zA-Z][a-zA-Z0-9_]* :} %nl+ {:code: [^`]* :} '```'|} -> to_blockcode
  ]],
		{
			to_ulist = function(t)
				local li_list = {}
				for _, v in ipairs(t) do
					table.insert(li_list, string.format("<li%s>%s</li>", class_str(classes.li), v))
				end
				return string.format("<ul%s>%s</ul>", class_str(classes.ul), table.concat(li_list))
			end,
			to_olist = function(t)
				local li_list = {}
				for _, v in ipairs(t) do
					table.insert(li_list, string.format("<li%s>%s</li>", class_str(classes.li), v))
				end
				return string.format("<ol%s>%s</ol>", class_str(classes.ol), table.concat(li_list))
			end,
			to_time = function(t)
				return string.format('<time%s datetime="%s">%s</time>', class_str(classes.code), t.datetime, t.txt)
			end,
			to_code = function(txt)
				return string.format("<code%s>%s</code>", class_str(classes.code), txt)
			end,
			to_blockcode = function(t)
				return string.format(
					'<pre><code style="margin-bottom:1em;display:block;opacity:0.5">[%s]</code><code%s>%s</code></pre>',
					t.lang,
					class_str(t.lang),
					t.code
				)
			end,
			to_quote = function(t)
				return string.format(
					"<blockquote%s>%s</blockquote>",
					class_str(classes.blockquote),
					table.concat(t, " ")
				)
			end,
			to_title = function(t)
				local depth = #t.depth
				return string.format(
					'<h%d%s id="#%s">%s%s</h%d>',
					depth,
					class_str(classes["h" .. tostring(depth)]),
					construct_id(t.title),
					t.title,
					construct_a({ txt = "#", url = "#" .. construct_id(t.title) }, classes),
					depth
				)
			end,
			to_a = function(t)
				return construct_a(t, classes)
			end,
			to_img = function(t)
				local lt = ""
				if t.title then
					lt = ' title="' .. t.title .. '"'
				end
				return string.format(
					'<figure><img src="%s"%salt="%s"%s><figcaption>%s</figcaption></figure>',
					t.url,
					class_str(classes.img),
					t.txt,
					lt,
					t.txt
				)
			end,
			to_i = function(t)
				return string.format("<i%s>%s</i>", class_str(classes.i), t.i)
			end,
			to_b = function(t)
				return string.format("<b%s>%s</b>", class_str(classes.b), table.concat(t.b))
			end,
			to_s = function(t)
				return string.format("<s%s>%s</s>", class_str(classes.s), t.s)
			end,
			concat = function(t)
				return string.format("<p%s>%s</p>", class_str(classes.p), table.concat(t, " "))
			end,
			concat_line = function(t)
				return table.concat(t)
			end,
			concat_section = function(t)
				return string.format("<section%s>%s</section>", class_str(classes.section), table.concat(t))
			end,
			join = function(t)
				return table.concat(t, "\n")
			end,
		}
	)
	return pattern:match(md)
end

return M
