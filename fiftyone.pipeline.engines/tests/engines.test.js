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

let engine = require(__dirname + "/../engine");
let pipelineBuilder = require(__dirname + "/../../fiftyone.pipeline.core/pipelineBuilder");
let aspectDataDictionary = require(__dirname + "/../aspectDataDictionary");
let basicListEvidenceKeyFilter = require(__dirname + "/../../fiftyone.pipeline.core/basicListEvidenceKeyFilter");
let lruCache = require(__dirname + "/../lruCache");

let cache = new lruCache({ size: 1 });

// Flag to test cache

let hasRun = false;

let testEngine = new engine(
    {
        dataKey: "testEngine",
        cache: cache,
        restrictedProperties: ["one", "noCache"],
        evidenceKeyFilter: new basicListEvidenceKeyFilter(["header.user-agent"]),
        properties: {
            "one": {
                "meta": {
                    "type": "int"
                }
            },
            "two": {
                "meta": {
                    "type": "int"
                }
            }
        },
        processInternal: function (flowData) {

            let contents = { "one": 1, "two": 2 };

            // Check if flowData has been processed before (for cache test)

            contents.noCache = hasRun;

            let data = new aspectDataDictionary({ flowElement: this, contents: contents });

            flowData.setElementData(data);

            hasRun = true;

        }
    }
);

let flowData = new pipelineBuilder().add(testEngine).build().createFlowData();

test('engine process', done => {

    flowData.process().then(function () {

        expect(flowData.get("testEngine").get("one")).toBe(1);

        done();

    });

});

test('restricted properties', done => {

    flowData.process().then(function () {

        try {

            flowData.get("testEngine").get("two");

        } catch (e) {

            expect(e.indexOf("excluded") !== -1).toBe(true);

        }

        done();

    });

});

test('missing property service', done => {

    flowData.process().then(function () {

        try {

            flowData.get("testEngine").get("three");

        } catch (e) {

            expect(e.indexOf("not found") !== -1).toBe(true);

        }

        done();

    });

});

test('cache', done => {

    flowData.process().then(function () {

        expect(flowData.get("testEngine").get("noCache")).toBe(false);

        done();

    });

});
