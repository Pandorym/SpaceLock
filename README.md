# Lock.js

[![Travis Build Status](https://travis-ci.com/Pandorym/Lock.js.svg?branch=master)](https://travis-ci.com/Pandorym/Lock.js)

Lock asynchronous resources, uses native Promises. 🔒

## Install
```shell script
npm i -s Pandorym/SpaceLock
```

## Usage
```javascript
import { Ymir } from 'space-lock';

let ymir = new Ymir();

ymir.checkIn('KEY')
    .then(() => {
        // console.log('1');
    })
    .then(() => {
        // console.log('  wait 500ms');
        setTimeout(() => {
            ymir.checkOut('KEY');
            // console.log('  checkOut');
        }, 500);
    });

ymir.doOnce('KEY', async () => {
    // console.log('2');
    // console.log('  wait 1000ms')
    
    return new Promise((resolve => {
        setTimeout(resolve, 1000)
    }))
});

ymir.checkIn('KEY')
    .then(() => {
        // console.log('3');
    });

// output
//   1
//     wait 500ms
//     checkout
//   2
//     wait 1000ms
//   3
```
