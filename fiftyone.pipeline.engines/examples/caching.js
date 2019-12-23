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

/*
@example caching.js

This example demonstrates how to add a cache to an aspect engine. The fiftyone.pipeline.engines module comes with an implementation of an lru cache.

To use this cache instead of a custom one use the lruCache class and pass in a size parameter for the size of the cache:

```{js}

const engine = require("fiftyone.pipeline.engines");

let lruCache = new engine.lruCache(100);

```

*/

const pipeline = require("fiftyone.pipeline.core");
const engine = require("../");

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
