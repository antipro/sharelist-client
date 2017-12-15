# Sharelist

> A todo list application with share function accross email address.

## Related Project

* [sharelist-server](https://gitee.com/antipro/sharelist-server)
  > server-side program
* [sharelist-electron](https://gitee.com/antipro/sharelist-electron)
  > desktop wrapper
* [sharelist-cordova](https://gitee.com/antipro/sharelist-cordova)
  > mobile wrapper

## Preparation

create config/server.js, like this:
``` javascript
'use strict'
module.exports = {
  dev: '"127.0.0.1:3000"',
  prod: '"172.104.112.9:3000"'
}
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## Preview
![Desktop](http://onmdsye1w.bkt.clouddn.com/sharelist-electron.png)
![Android](http://onmdsye1w.bkt.clouddn.com/sharelist-cordova1.png)
![Android](http://onmdsye1w.bkt.clouddn.com/sharelist-cordova2.png)