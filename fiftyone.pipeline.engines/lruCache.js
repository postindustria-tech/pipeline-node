const dataKeyedCache = require("./dataKeyedCache");
const LRU = require("./lru");

class LRUcache extends dataKeyedCache {

    constructor({ size = 100 }) {

        super(...arguments);

        this.cache = new LRU(size);

    }

    get(cacheKey) {

        return this.cache.read(cacheKey);

    }

    put(cacheKey, value) {

        this.cache.write(cacheKey, value);

    }

}

module.exports = LRUcache;
