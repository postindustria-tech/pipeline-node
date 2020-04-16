/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2019 51 Degrees Mobile Experts Limited, 5 Charlotte Close,
 * Caversham, Reading, Berkshire, United Kingdom RG4 7BY.
 *
 * This Original Work is licensed under the European Union Public Licence (EUPL)
 * v.1.2 and is subject to its terms as set out below.
 *
 * If a copy of the EUPL was not distributed with this file, You can obtain
 * one at https://opensource.org/licenses/EUPL-1.2.
 *
 * The 'Compatible Licences' set out in the Appendix to the EUPL (as may be
 * amended by the European Commission) shall be deemed incompatible for
 * the purposes of the Work and the provisions of the compatibility
 * clause in Article 5 of the EUPL shall not apply.
 *
 * If using the Work as, or as part of, a network application, by
 * including the attribution notice(s) required under Article 5 of the EUPL
 * in the end user terms of the application under an appropriate heading,
 * such notice(s) shall fulfill the requirements of that article.
 * ********************************************************************* */

const require51 = (requestedPackage) => {
  try {
    return require(__dirname + '/../' + requestedPackage);
  } catch (e) {
    return require(requestedPackage);
  }
};

const engines = require51('fiftyone.pipeline.engines');

const Tracker = engines.Tracker;
const LRU = engines.Lru;

class ShareUsageTracker extends Tracker {
  constructor ({ size = 100, interval = 1000 } = {}) {
    super(...arguments);

    this.cache = new LRU(size);

    this.interval = interval;
  }

  match (key, value) {
    const difference = Date.now() - value;

    if (difference > this.interval) {
      this.put(key, value);

      return true;
    } else {
      return false;
    }
  }

  get (cacheKey) {
    return this.cache.read(cacheKey);
  }

  put (cacheKey) {
    this.cache.write(cacheKey, Date.now());
  }
}

module.exports = ShareUsageTracker;
