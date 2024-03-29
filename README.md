# texthighlighter
* a **no dependency** typescript supported tool for highlighting user selected content, removing highlights, serializing existing highlights, and applying serialized highlights. Works on mobile device.
* a no dependency typescript port of https://github.com/mir3z/texthighlighter because typescript is amazing. Some bugs were even fixed by just converting to typescript. Functions were converted to not need class instantiation. Followed article https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c on setting up a typescript package after testing my port on my own project. Pull requests are welcome!

## Usage
* `npm install @funktechno/texthighlighter`
* in code

```js
import { doHighlight, deserializeHighlights, serializeHighlights, removeHighlights, optionsImpl } from "@/../node_modules/@funktechno/texthighlighter/lib/index";
const domEle = document.getElementById("sandbox");
const options: optionsImpl = {};
if (this.color) options.color = this.color;
if (domEle) doHighlight(domEle, true, options);
```

In project need to set up own mouseup and touchend events. touchend is for mobile

vue example
```html
<div
    id="sandbox"
    @mouseup="runHighlight($event)"
    @touchend="runMobileHighlight($event)"
    v-html="content"
></div>
```

vue script
```js
var methods = {
  runMobileHighlight(:any){
    const selection = document.getSelection();
      if (selection) {
        const domEle = document.getElementById("sandbox");
        const options: optionsImpl = {};
        if (domEle) {
            const highlightMade = doHighlight(domEle, true, options);
        }
    }

  },
  runHighlight(:any){
    // run mobile a bit different
    if (this.isMobile()) return;
    const domEle = document.getElementById("sandbox");
    const options: optionsImpl = {};
    if (domEle) {
        const highlightMade = doHighlight(domEle, true, options);
    }
  }
}

```

## Demos

* [Simple demo](http://funktechno.github.io/texthighlighter/demos/simple.html)
* [Callbacks](http://funktechno.github.io/texthighlighter/demos/callbacks.html)
* [Serialization](http://funktechno.github.io/texthighlighter/demos/serialization.html)
* [Iframe](http://funktechno.github.io/texthighlighter/demos/iframe.html)

## development
* `npm install` or `yarn import`
* `npm run build`
* `npm run build:client`
* `npm run lint:fix`
* `yarn run live-server` 

## deploy
* npm publish --access public 

## todo
* [x] convert library to typescript
  * works where it's being used (in a vue ts project)
* [x] bring over demos and examples
* [ ] improve unit tests
  * [x] pipeline
  * [ ] bring over previous unit tests
* [ ] extend highlights for more options
  * [ ] whole element selection for comment support, or keeprange disabled
