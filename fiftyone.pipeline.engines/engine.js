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

let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const flowElement = require51("fiftyone.pipeline.core").flowElement;

const dataFileUpdateService = require("./dataFileUpdateService");

class engine extends flowElement {

    /**
     * Constructor for engine class, extends flowElement with extra options
     *
     * @param {Object} options
     * @param {Cache} options.cache instance of a dataKeyedCache
     * @param {Array} options.restrictedProperties specific list of properties to fetch elementData for
    */
    constructor(
        {
            cache, restrictedProperties
        } = {}
    ) {

        super(...arguments);

        if (cache) {

            this.cache = cache;

        }

        if (restrictedProperties) {

            this.restrictedProperties = restrictedProperties;

        }

    }

    /**
     * Checks cache and returns cached result if found.
     * @param {flowData} flowData
    */
    inCache(flowData) {

        let keys = this.evidenceKeyFilter.filterEvidence(flowData.evidence.getAll());

        keys = JSON.stringify(keys);

        let cached = this.cache.get(keys);

        if (cached) {

            flowData.setElementData(cached);

            return true;

        } else {

            return false;

        }

    }

    /**
     * An engine's process function checks cache for an item (calling inCache)
     * If found it returns the cached object
     * If not found it runs the standard processInternal function and adds it to the cache (if a cache is present)
     * @param {flowData} flowData
    */
    process(flowData) {

        let engine = this;

        if (this.cache) {

            if (this.inCache(flowData)) {

                return Promise.resolve(true);

            }

        }

        return Promise.resolve(this.processInternal(flowData)).then(function () {

            if (engine.cache) {

                let keys = engine.evidenceKeyFilter.filterEvidence(flowData.evidence.getAll());

                keys = JSON.stringify(keys);

                engine.cache.put(keys, flowData.get(engine.dataKey));

            }

        });

    }

    refresh() {

        return true;

    }

    registerDataFile(dataFile) {

        this.registrationCallbacks.push(function (pipeline) {

            // Create datafile update service if not already created

            if (!pipeline.dataFileUpdateService) {

                pipeline.dataFileUpdateService = new dataFileUpdateService(pipeline);

            }

            pipeline.dataFileUpdateService.registerDataFile(dataFile);

        })

    }

}

module.exports = engine;
