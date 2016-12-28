'use strict'

const Cache = require('./cache')();
const test = require('./test1');

Cache.set('key1', 'value1');
console.log(Cache);
console.log(Cache.get('key1'));

test();
