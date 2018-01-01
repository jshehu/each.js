# each.js

### API

 - `each.parallel(iterator, cb)`
 - `each.series(iterator, cb)`
 - `each.concurrent(iterator, cb, concurrency)`

`iterator` - Iterator to loop through.

`cb` - `async (item, index, iterator) => {}` - handler for iterator items.

`concurrency` - Number of parallel executed cb's in series.

All 3 functions: **paralel**, **series** and **concurrent** return promise which resolve to an array with all cb returned values.

Error handling: If one of cb functions throws then each function throws too.


### Intallation
```sh
npm i -S each.js
```

### Examples
```js
const each = require('each.js');

// array
const array = [1, 2, 3, 4, 5];

// iterator (using generator function)
function* iterator() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}

// timeout promise
const timeoutPromise = timeout => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(timeout);
  }, timeout);
});

// examples
// work both with arrays and iterators
(async () => {
  // parallel
  console.log('parallel');
  const result1 = await each.parallel(iterator(), async (item, index) => {
    console.log(item);
    await timeoutPromise(1000);
    return item;
  });
  console.log(result1);

  // series
  console.log('series');
  const result2 = await each.series(array, async (item, index) => {
    console.log(item);
    await timeoutPromise(1000);
    return item;
  });
  console.log(result2);

  // concurrent
  console.log('concurrent');
  const result3 = await each.concurrent(iterator(), async (item, index) => {
    console.log(item);
    await timeoutPromise(1000);
    return item;
  }, 2);
  console.log(result3);
})();
```