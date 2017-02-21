'use strict'
/**
 * 简单链表
 * @Author: dickzheng
 * @Date: 2017/01/16
 */

// 链表节点
function Node(key) {
    this.key = key;
    this.next = null;
    this.prev = null;
}

// 链表
function Link() {
    this.length = 0;
    this.head = this.tail = null;

    // 往链首添加一个节点
    this.unshift = function(node) {
        // 链表为空
        if(!this.length) {
            this.head = this.tail = node;
        } else {
            this.head.prev = node;
            node.next = this.head;
            this.head = node;
        }
        this.length++;
        return node;
    };

    // 往链尾添加一个节点
    this.push = function(node) {
        // 链表为空
        if(!this.length) {
            this.head = this.tail = node;
        } else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
        this.length++;
        return node;
    };

    // 删除链表最后一个节点
    this.pop = function() {
        let curNode;
        // 链表为空
        if(!this.length) {
            return false;

        } else {
            let curNode = this.tail;
            // 链表长度为1
            if(this.length === 1) {
                this.head = this.tail = null;

            // 链表长度大于等于2
            } else {
                curNode.prev.next = null;
                this.tail = curNode.prev;
            }
            this.length--;
            return curNode;
        }
    };

    // 删除具体节点
    this.del = function(node) {
        let result = true;
        let prevNode = node.prev;
        let nextNode = node.next;

        // 节点在链尾
        if(prevNode && !nextNode) {
            this.tail = prevNode;
            prevNode.next = null;

        // 节点在链中
        } else if(prevNode && nextNode) {
            prevNode.next = nextNode;
            nextNode.prev = prevNode;

        // 节点在链首
        } else if(!prevNode && nextNode) {
            this.head = nextNode;
            nextNode.prev = null;

        // 只有一个节点
        } else if(!prevNode && !nextNode) {
            this.head = this.tail = null;
        } else {
            result = false;
        }
        this.length--;
        return result;
    };

    // 将节点移到链首
    this.moveHead = function(node) {
        let result = true;
        let prevNode = node.prev;
        let nextNode = node.next;

        // 节点在链尾
        if(prevNode && !nextNode) {
            // 将链尾节点设置为prevNode
            this.tail = prevNode;
            prevNode.next = null;

            // 修改node与链首节点关联关系
            node.next = this.head;
            this.head.prev = node;

            // 将链首节点替换为node
            node.prev = null;
            this.head = node;

        // 节点在链中
        } else if(prevNode && nextNode) {
            // 关联node的prev和next关系
            prevNode.next = nextNode;
            nextNode.prev = prevNode;

            // 修改node与链首节点关联关系
            node.next = this.head;
            this.head.prev = node;

            // 将链首节点替换为node
            node.prev = null;
            this.head = node;

        // 节点在链首 || 只有一个节点
        } else if(!prevNode && nextNode || !prevNode && !nextNode) {
        } else {
            result = false;
        }
        return result;
    };

    this.print = function() {
        let pointer = this.head;
        let arr = [];
        while(pointer) {
            arr.push(pointer.key);
            pointer = pointer.next;
        }
        console.log(arr.join(', '));
        return arr;
    };

    this.clear = function() {
        this.length = 0;
        this.head = this.tail = null;
    };
}

/**
 * 外部方法：创建链表
 * @return {Link} 简单链表结构
 */
exports.createLink = function() {
    return new Link();
};

/**
 * 外部方法：创建节点
 * @param  {String} key 键
 * @return {Node}       数据节点
 */
exports.createNode = function(key) {
    return new Node(key);
};
