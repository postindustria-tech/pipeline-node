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
