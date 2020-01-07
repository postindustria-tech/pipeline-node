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
