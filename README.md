# konyako

konyako is a markdown-based static-microblogging-like (imagine twittru x tumblr x jekyll) generator powered by git and lua.

## How to use?

> Needs `lua` or `luajit`

1. Copy `assets` and `src` folders to your site
2. You can rename `src` folder to anything.
3. Personalize the feed meta in `konyako.lua`'s setup code
4. Create a feed in `src/feeds/[feed-url].md`
   - Check this repo's `src/feeds/` markdown as an example
5. Inside `src` folder, run `luajit konyako.lua`
