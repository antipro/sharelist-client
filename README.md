# Sharelist

> A todo list application with share function accross email address.

## Features

* group tasks by project or date
* multi-platfrom
  * Android
  * iOS(theoretically)
  * Linux
  * Windows(theoretically)
  * Mac(theoretically)
* use email address to share list with other people email
* schedule and receive notification both on mobile and desktop
* receive notification when other people change tasks and projects
* support language
 * en
 * zh_CN

## Related Project

* [sharelist-server](https://gitee.com/antipro/sharelist-server)
  > server-side program
* [sharelist-electron](https://gitee.com/antipro/sharelist-electron)
  > desktop wrapper
* [sharelist-cordova](https://gitee.com/antipro/sharelist-cordova)
  > mobile wrapper

## Preparation

start server according to guide of [sharelist-server](https://gitee.com/antipro/sharelist-server)

create ./config/server.js, like below:
``` javascript
'use strict'
module.exports = {
  dev: '"IP:PORT"',
  prod: '"IP:PORT"'
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
### Desktop(Deepin Linux)

![Desktop](http://onmdsye1w.bkt.clouddn.com/sharelist-electron2.png)

### Mobile(Android)

![Android](http://onmdsye1w.bkt.clouddn.com/sharelist-cordova3.png)
![Android](http://onmdsye1w.bkt.clouddn.com/sharelist-cordova4.png)