class Node {
    constructor(key, value, next = null, prev = null) {
        this.key = key;
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

class LRU {
    constructor(limit = 1000) {
        this.size = 0;
        this.limit = limit;
        this.head = null;
        this.tail = null;
        this.cache = {};
    }

    write(key, value) {
        this.ensureLimit();

        if (!this.head) {
            this.head = this.tail = new Node(key, value);
        } else {
            const node = new Node(key, value, this.head);
            this.head.prev = node;
            this.head = node;
        }

        this.cache[key] = this.head;
        this.size++;
    }

    read(key) {
        if (this.cache[key]) {
            const value = this.cache[key].value;

            this.remove(key)
            this.write(key, value);

            return value;
        } else {

            return null;

        }

    }

    ensureLimit() {
        if (this.size === this.limit) {
            this.remove(this.tail.key);
        }
    }

    remove(key) {
        const node = this.cache[key];

        if (node.prev !== null) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next !== null) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }

        delete this.cache[key];
        this.size--;
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.cache = {};
    }

    forEach(fn) {
        let node = this.head;
        let counter = 0;
        while (node) {
            fn(node, counter);
            node = node.next;
            counter++;
        }
    }

    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
            yield node;
            node = node.next;
        }
    }
}

module.exports = LRU;