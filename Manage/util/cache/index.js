'use strict'
/**
 * Local Cache本地缓存
 * @Author: dickzheng
 * @Date: 2017/01/16
 */

const LRU = require('./LRU');

let lastSize = null;
// 存储已生成的Cache队列，实现单例模式
let localCache;

/**
 * 初始化缓存链表
 * @param  {Number} size Cache大小
 * @return {Queue}       Cache队列
 */
let initQueue = function(size) {
    return LRU.createQueue(size);
};

/**
 * Cache缓存Set方法
 * @param {String} key    键
 * @param {String} value  值(序列化的JSON值或String)
 * @param {Number} maxAge 有效时间
 */
let set = function(key, value, maxAge) {
    let result = false;
    let _cache = this.cache;
    let _queue = this.queue;

    // 默认缓存时间为20min, -1为永不失效
    maxAge = maxAge || 20 * 60 * 1000;

    // 如果存在，则重新赋值
    if(_cache[key]) {
        _cache[key].value = value;
        if(maxAge == -1) {
            _cache[key].expire = -1;
        } else {
            _cache[key].expire = +new Date() + maxAge;
        }

        _queue.update(_cache[key].node);
        result = true;
    // 如果不存在，则为新插入数据
    } else {
        let newNode = _queue.insert(key);
        let expire;
        if(maxAge == -1) {
            expire = -1;
        } else {
            expire = +new Date() + maxAge;
        }

        _cache[key] = {
            value: value,
            expire: expire,
            node: newNode.node
        };

        newNode.delArr.forEach(function(key) {
            _cache[key] = null;
        });
        result = true;
    }
    return result;
};

/**
 * Cache缓存GET方法
 * @param  {String} key 键
 * @return {String}     值
 */
let get = function(key) {
    let _cache = this.cache;
    let _queue = this.queue;

    if(_cache[key]) {
        let expire = _cache[key].expire;
        let node = _cache[key].node;
        let curTime = +new Date();

        // 如果不存在过期时间 || 存在过期时间但尚未过期
        if(!expire || expire == -1 || expire && curTime < expire) {
            _queue.update(node);
            return _cache[key].value;
        // 存在过期时间且已过期，则删除该缓存记录
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
    // 默认大小为10000
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

    // 1s定时器扫描Cache记录的有效性
    setInterval(function() {
        let cache = obj.cache;
        let queue = obj.queue;
        for(let key in cache) {
            if(!cache[key])
                continue;
            let expire = cache[key].expire;
            let curTime = +new Date();
            let node = cache[key]['node'];

            if(expire && expire != -1 && curTime > expire) {
                queue.del(node);
                cache[key] = null;
            }
        }
    }, 1000);

    return obj;
};

/**
 * 外部方法：根据缓存大小创建Cache队列
 * @param  {Number} size Cache大小
 * @return {Queue}       Cache队列
 */
module.exports = function(size) {
    // 单例模式
    if(!localCache) {
        localCache = createCache(size);
    }
    return localCache;
};
