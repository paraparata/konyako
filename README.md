# konyako

(trying to be) simple micro blogging in (not so) timeline order

## How to use?

> Needs lua or luajit

1. Copy `assets` and `src` folder to your site
2. You can rename `src` folder to anything.
3. Personalize the feed seo in `konyako.lua`'s setup code (line 280 - 284)
4. Create a feed in `src/feeds/[feed-url].md`. The content has a rules:
   - Use `#` tag as title
   - Use `>` as feed group
   - (Currently need to) add 2 newline at the end of file
   - Check this repo's `src/feeds/` markdown as an example
5. Inside `src` folder, run `luajit konyako.lua`
