let flowElement = require("../../FiftyOne.Pipeline.Core/flowElement");
let pipelineBuilder = require("../../FiftyOne.Pipeline.Core/pipelineBuilder");
let elementDataDictionary = require("../../FiftyOne.Pipeline.Core/elementDataDictionary");
let JavaScriptBundler = require("../javascriptBundler");

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
            meta: {
                type: "javascript"
            }
        },
        "second.value": {
            meta: {
                type: "javascript"
            }
        }
    }
});

let testResults = {};

let javascriptPipeline = new pipelineBuilder().add(JavaScriptCreator).add(new JavaScriptBundler()).build();

let flowData = javascriptPipeline.createFlowData();


test('JavaScript bundler', done => {

    flowData.process().then(function (output) {

        let JS = flowData.get("JavaScriptBundler").get("javascript");

        console.log(JS);
        
        eval(JS);
    
        expect(testResults["first"] === true && testResults["second"] === false).toBe(true);

        done();
    
    })

});
