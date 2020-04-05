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

/**
@example caching.js

This example demonstrates how to add a cache to an aspect engine. The fiftyone.pipeline.engines module comes with an implementation of an lru cache.

To use this cache instead of a custom one use the lruCache class and pass in a size parameter for the size of the cache:

```

const engine = require("fiftyone.pipeline.engines");

let lruCache = new engine.lruCache(100);

```

*/

const pipeline = require("fiftyone.pipeline.core");
// Note that this example is designed to be run from within the 
// source repository. If this code has been copied to run standalone 
// then you'll need to replace the require below with the commented 
// out version below it.
const engine = require(".."); 
//const engine = require("fiftyone.pipeline.engines");

const lruCache = new engine.lruCache(100);

// This is a very simple cache that uses an in memory JavaScript object
class myCustomCache extends engine.dataKeyedCache {

    constructor(size) {

        super();

        this.cache = {};

    }

    get(cachekey) {

        if (this.cache[cachekey]) {

            console.log("Fetched from cache")
            return this.cache[cachekey];

        }

    }

    put(cachekey, value) {

        this.cache[cachekey] = value;


    }

}

// A custom engine to test the caching, note the instance of the evidenceKeyFilter class which is used to determine which evidence is used by the flowElement and in turn the pipeline.

let cacheTest = new engine.engine({
    dataKey: "cacheTest",
    cache: new myCustomCache(),
    evidenceKeyFilter: new pipeline.basicListEvidenceKeyFilter(["cookie.my-user-id"]),
    processInternal: function (flowData) {

        let engine = this;

        return new Promise(function (resolve, reject) {

            let data = new pipeline.elementDataDictionary({ flowElement: engine, contents: { "hello": "world" } });

            flowData.setElementData(data);

            resolve();

        });

    },
    properties: {
        hello: {
            type: "string"
        }
    }
});

let cachePipeline = new pipeline.pipelineBuilder().add(cacheTest).build();

let flowData = cachePipeline.createFlowData();

let processFlowDataWithUserId = function (userID) {

    flowData.evidence.add("cookie.my-user-id", userID);

    return flowData.process();

}

processFlowDataWithUserId("112");

setTimeout(function () {

    processFlowDataWithUserId("112");

}, 100);
