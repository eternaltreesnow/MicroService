'use strict'
/**
 * LRU算法 - 双向链表结构
 * @Author: dickzheng
 * @Date: 2017/01/16
 */

const Link = require('./Link');

function Queue(size) {
    this.size = size || 10000;
    this.length = 0;
    this.queue = Link.createLink();
}

/**
 * 队列插入方法
 * @param  {String} key 键
 * @return {Object}     新节点
 */
Queue.prototype.insert = function(key) {
    // 新插入的数据置于队首
    let node = Link.createNode(key);
    this.queue.unshift(node);

    let delArr = [];
    let delNode;

    // 若长度超过Cache大小，则删除队尾数据
    while(this.queue.length > this.size) {
        delNode = this.queue.pop();
        if(delNode) {
            delArr.push(delNode.key);
        } else {
            break;
        }
    }

    return {
        node: node,
        delArr: delArr
    };
};

/**
 * 队列更新方法
 * @param  {Object} node 更新的数据节点
 */
Queue.prototype.update = function(node) {
    this.queue.moveHead(node);
};

/**
 * 队列删除方法
 * @param  {Object} node 删除的数据节点
 */
Queue.prototype.del = function(node) {
    this.queue.del(node);
};

/**
 * 队列打印方法
 * @param  {Object} node 打印的数据节点
 */
Queue.prototype.print = function(node) {
    return this.queue.print();
};

/**
 * 外部方法：创建队列
 * @param  {Number} size 队列大小
 * @return {Queue}       Cache队列
 */
exports.createQueue = function(size) {
    return new Queue(size);
};
