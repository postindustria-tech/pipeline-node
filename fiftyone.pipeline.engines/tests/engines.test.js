let engine = require("../engine");
let pipelineBuilder = require("../../FiftyOne.Pipeline.Core/pipelineBuilder");
let aspectDataDictionary = require("../aspectDataDictionary");
let basicListEvidenceKeyFilter = require("../../FiftyOne.Pipeline.Core/basicListEvidenceKeyFilter");
let lruCache = require("../lruCache");

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
