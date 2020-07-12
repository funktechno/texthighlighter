# texthighlighter
* a no dependency typescript tool for highlighting user selected content, removing highlights, serializing existing highlights, and applying serialized highlights
* a nodependency typescript port of https://github.com/mir3z/texthighlighter because typescript is amazing. Some bugs were even fixed by just converting to typescript. Functions were converted to not need class instantiation. Followed article https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c on setting up a typescript package after testing my port on my own project. Pull requests are welcome!

## Usage
* `npm install @funktechno/texthighlighter`
* in code

```js
import { doHighlight, deserializeHighlights, serializeHighlights, removeHighlights } from "@/../node_modules/@funktechno/texthighlighter/lib/index";
const domEle = document.getElementById("sandbox");
const options: optionsImpl = {};
if (this.color) options.color = this.color;
if (domEle) doHighlight(domEle, true, options);
```

## deploy
* npm publish --access public 

## todo
* [x] convert library to typescript
  * works where it's being used (in a vue ts project)
* [ ] bring over demos and examples
* [ ] improve unit tests