let flowElement = require(__dirname + "/../../fiftyone.pipeline.core/flowElement");
let pipelineBuilder = require(__dirname + "/../../fiftyone.pipeline.core/pipelineBuilder");
let elementDataDictionary = require(__dirname + "/../../fiftyone.pipeline.core/elementDataDictionary");
let JavaScriptBundler = require(__dirname + "/../javascriptBundler");

let JavaScriptCreator = new flowElement({
    dataKey: "MyJSEngine",
    processInternal: function (flowData) {

        let contents = {};

        contents["first-value"] = `testResults["first"] = true;`;
        contents["second.value"] = `testResults["second"] = false;`;

        let data = new elementDataDictionary({ flowElement: this, contents: contents });

        flowData.setElementData(data);

    },
    properties: {
        "first-value": {
            type: "javascript"
        },
        "second.value": {
            type: "javascript"
        }
    }
});

let testResults = {};

let javascriptPipeline = new pipelineBuilder().add(JavaScriptCreator).add(new JavaScriptBundler()).build();

let flowData = javascriptPipeline.createFlowData();


test('JavaScript bundler', done => {

    flowData.process().then(function (output) {

        let JS = flowData.get("javascript").get("javascript");

        eval(JS);

        expect(testResults["first"] === true && testResults["second"] === false).toBe(true);

        done();

    })

});
