# How to write a NPM module using TypeScript
> Targeting Node.js (v6) and TypeScript

*- see [related article on Medium](https://medium.com/french-make-beautiful/5-things-to-know-when-writing-a-typescript-npm-module-e9a334efd544)*


Provide : 

- packaging for TypeScript use
- packaging for Node.js (v6) use
- TypeScript testing with Jasmine
- Gulp automatisation


#### How to run

```
npm i
gulp
gulp test
```


##### Notes

- `index.ts` at root is mandatory for `tsc` in order to make the module discoverable
- `dist/index.js` is the entry point for node.js targeting
- `.npmignore` allow to expose `dist/` and `definitions` folders without versionning it. 
