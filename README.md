# SYNCHRONIZER
[![Build Status](http://img.shields.io/travis/mohayonao/synchronizer.svg?style=flat-square)](https://travis-ci.org/mohayonao/synchronizer)
[![NPM Version](http://img.shields.io/npm/v/synchronizer.svg?style=flat-square)](https://www.npmjs.org/package/synchronizer)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> utility for exclusive access control

## Installation

```
npm install synchronizer
```

## API

- `synchronizer.create(object: any): function`
  - return a synchronized decorator function

## Examples
For example, the below function needs exclusive access control.

```js
function asyncFuncNeedsExclusiveAccessControl(message) {
  if (asyncFuncNeedsExclusiveAccessControl.LOCKED) {
    console.error("FATAL ERROR: THIS FUNCTION IS LOCKED!!");
    return process.exit(1);
  }
  asyncFuncNeedsExclusiveAccessControl.LOCKED = true;

  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log(message);

      asyncFuncNeedsExclusiveAccessControl.LOCKED = false;

      resolve(message);
    }, 500);
  });
}
```

The above function locks a single resource. So you cannot execute the below code.

```js
var object = { name: "alice" };

asyncFuncNeedsExclusiveAccessControl(object.name + "!!").then(function(res) {
  console.log("-->", res);
});

asyncFuncNeedsExclusiveAccessControl(object.name + "??").then(function(res) {
  console.log("-->", res);
});
```

In using `synchronizer`, you can execute that code using synchronized decorator.

```js
var object = { name: "alice" };
var synchronized = synchronizer.create(object);

synchronized(function(object) {
  return asyncFuncNeedsExclusiveAccessControl(object.name + "!!");
}).then(function(res) {
  console.log("-->", res);
});

synchronized(function(object) {
  return asyncFuncNeedsExclusiveAccessControl(object.name + "??");
}).then(function(res) {
  console.log("-->", res);
});
```

## LICENSE
MIT
