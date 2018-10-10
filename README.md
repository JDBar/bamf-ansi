# bamf-ansi

## Notes
The code in this repo is experimental. It currently supports converting images as `File` objects into monochrome ANSI art. It is not currently suitable for use in a production environment, but might be eventually.

## Usage
```JavaScript
var art = new Ansi({
  file, // File. The image file to use.
  charWidth, // Number. The number of characters in width to make the ANSI art.
  charHeight, // Number. The number of characters in height to make the ANSI art.
  inverted // boolean. Determines whether art will be white-on-black or black-on-white.
});
```
