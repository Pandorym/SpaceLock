# Lock.js

[![Travis Build Status](https://travis-ci.com/Pandorym/Lock.js.svg?branch=master)](https://travis-ci.com/Pandorym/Lock.js)

Lock asynchronous resources, uses native Promises. 🔒

## Usage
```javascript
// console.log('lock');
locks.lock('STR_KEY1');

setTimeout(() => {
    // console.log('unlock');
    locks.unlock('STR_KEY1');
}, 5000);

locks
    .wait('STR_KEY1')
    .then(() => {
        // console.log('passed');
    });

// output:
//   lock
//   unlock
//   passed
```
