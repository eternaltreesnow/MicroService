'use strict'
// local cache
// Author: dickzheng
const LRU = require('./LRU');

let lastSize = null;
let localCache;

// 初始化缓存链表
let initQueue = function(size) {
    return LRU.createQueue(size);
};

// Set方法
let set = function(key, value, maxAge) {
    let result = false;
    let _cache = this.cache;
    let _queue = this.queue;

    // 默认缓存时间为20min
    maxAge = maxAge || 20 * 60 * 1000;

    // 如果存在，则重新赋值
    if(_cache[key]) {
        _cache[key].value = value;
        _cache[key].expire = +new Date() + maxAge;

        _queue.update(_cache[key].node);
        result = true;
    // 如果不存在，则为新插入数据
    } else {
        let newNode = _queue.insert(key);

        _cache[key] = {
            value: value,
            expire: +new Date() + maxAge,
            node: newNode.node
        };

        newNode.delArr.forEach(function(key) {
            _cache[key] = null;
        });
        result = true;
    }
    return result;
};

// Get方法
let get = function(key) {
    let _cache = this.cache;
    let _queue = this.queue;

    if(_cache[key]) {
        let expire = _cache[key].expire;
        let node = _cache[key].node;
        let curTime = +new Date();

        // 如果不存在过期时间 || 存在过期时间但尚未过期
        if(!expire || expire && curTime < expire) {
            _queue.update(node);
            return _cache[key].value;
        } else if(expire && curTime > expire) {
            _queue.del(node);
            return null;
        }
    } else {
        return null;
    }
};

// 清空localCache
let clear = function() {
    this.cache = {};
    this.queue = initQueue(lastSize);
};

// 打印localCache
let print = function() {
    return this.queue.print();
};

// 初始化localCache
let createCache = function(size) {
    if(!size) {
        lastSize = size = 10000;
    }

    let obj = {
        cache: {},
        queue: initQueue(size),
        set: set,
        get: get,
        clear: clear,
        print: print
    };

    setInterval(function() {
        let cache = obj.cache;
        let queue = obj.queue;
        for(let key in cache) {
            if(!cache[key])
                continue;
            let expire = cache[key].expire;
            let curTime = +new Date();
            let node = cache[key]['node'];

            if(expire && curTime > expire) {
                queue.del(node);
                cache[key] = null;
            }
        }
    }, 1000);

    return obj;
};

module.exports = function(size) {
    if(!localCache) {
        localCache = createCache(size);
    }
    return localCache;
};
