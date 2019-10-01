const dataKeyedCache = require("./dataKeyedCache");

class tracker extends dataKeyedCache {

    /**
     * The track method calls the dataKeyedCache get method, if it receives a result it sends it onto a match function 
     * @param {Object} cachekey
    */
    track(key) {

        let result = this.get(key);

        if (!result) {

            return true;

        } else {

            return this.match(key, result);

        }

    }

    /**
     * If object is found in cache, the match function is called
     * @param {Object} result
    */
    match(result) {

        return true;

    }

}

module.exports = tracker;