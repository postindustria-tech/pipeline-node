let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const evidenceKeyFilter = require51("fiftyone.pipeline.core").evidenceKeyFilter;
const engines = require51("fiftyone.pipeline.engines");

const tracker = engines.tracker;
const LRU = engines.lru;

class shareUsageTracker extends tracker {

    constructor({ size = 100, interval = 1000 } = {}) {

        super(...arguments);

        this.cache = new LRU(size);

        this.interval = interval;

    }

    match(key, value) {

        let difference = Date.now() - value;

        if (difference > this.interval) {

            this.put(key, value);

            return true;

        } else {

            return false;

        }

    }

    get(cacheKey) {

        return this.cache.read(cacheKey);

    }

    put(cacheKey) {

        this.cache.write(cacheKey, Date.now());

    }

}

module.exports = shareUsageTracker;
