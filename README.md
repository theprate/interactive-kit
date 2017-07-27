# interactive-kit

cli for developing and deploying lowdown interactives.


## Setup

Add to a `interactives-*` project.
```
npm i --save-dev interactive-kit
```

Add helper command to `package.json#scripts`.
```
json

{
  "scripts": {
    "ik": "`npm bin`/interactive-kit"
  }
}
```


## Commands

`interactive-kit init` - initializes interactive to lowdown

`interactive-kit dev` - bundles your interactive from src/entry.js. Viewable from http://localhost:2334 via interactive-frame.

`interactive-kit publish` - publishes new version to lowdown
