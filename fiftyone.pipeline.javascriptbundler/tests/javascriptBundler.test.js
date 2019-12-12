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
