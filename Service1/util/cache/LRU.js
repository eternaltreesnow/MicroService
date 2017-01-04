'use strict'

// LRU算法 - 双向链表结构
// Author: dickzheng
const Link = require('./Link');

function Queue(size) {
    this.size = size || 10000;
    this.length = 0;
    this.queue = Link.createLink();
}

Queue.prototype.insert = function(key) {
    let node = Link.createNode(key);
    this.queue.unshift(node);

    let delArr = [];
    let delNode;
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

Queue.prototype.update = function(node) {
    this.queue.moveHead(node);
};

Queue.prototype.del = function(node) {
    this.queue.del(node);
};

Queue.prototype.print = function(node) {
    return this.queue.print();
};

exports.createQueue = function(size) {
    return new Queue(size);
};
