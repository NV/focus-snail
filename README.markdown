[Flying Focus](//github.com/NV/flying-focus/)
 · **Focus Snail**
 · [Focus Zoom](//github.com/NV/focus-zoom/)
 · [Focus Hug](//github.com/NV/focus-hug/)

![Focus Snail icon](http://nv.github.io/focus-snail/chrome/icon_128.png)

## [focus-snail.js](http://nv.github.io/focus-snail/standalone/focus-snail.js)

To use, just include `<script src="focus-snail.js"></script>` inside either `<head>` or `<body>`.
It includes all necessary CSS and has no external dependencies.

To build from source use `rake standalone`.

### Browser support

Tested in Chrome 28-32, Safari 6.1–7, Firefox 24.
Focus Snail uses SVG which is not supported in IE version 8 and below.

### API

Focus Snail exposes `focusSnail` global variable.

`focusSnail.trigger(prevElement, element)` manually runs the effect for `prevElement` to `element`.

`focusSnail.enabled = true` trigger the effect on focus event.


## [Chrome extension](https://chrome.google.com/webstore/detail/focus-snail/bplpobmpcnpddpabcpfnddhimhjicgpc)

No build step required; just load it as an unpacked extension from `chrome/`.
