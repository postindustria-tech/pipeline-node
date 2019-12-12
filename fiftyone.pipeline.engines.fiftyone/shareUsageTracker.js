/* ********************************************************************
 * Copyright (C) 2019  51Degrees Mobile Experts Limited.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ******************************************************************** */

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
