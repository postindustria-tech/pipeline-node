// This example demonstrates the creation of a custom flowElement.

let flowElement = require("../flowElement");
let elementDataDictionary = require("../elementDataDictionary");
let basicListEvidenceKeyFilter = require("../basicListEvidenceKeyFilter");

let asyncFlowElement = new flowElement({
    // FlowElements have a unique datakey that is used to store and access data created by them
    dataKey: "async",
    // An evidenceKeyFilter is used to tell a Pipeline which evidence is required by a flowElement and which can be ignored. This example uses a basicListEvidenceKeyFilter which simply takes an array of requested evidence keys.
    evidenceKeyFilter: new basicListEvidenceKeyFilter(["header.user_agent"]),
    // FlowElements can process synchronously or asynchronously (either returning a Promise or not). They can optionally inspect and add data (and / or errors) to the FlowData passed through a pipeline.
    processInternal: function (flowData) {

        let flowElement = this;

        return new Promise(function (resolve, reject) {

            setTimeout(function () {

                let contents = { string: "hello" };

                // flowElements should pass an extension of the elementData class into a flowData's setElementData function if they wish to store data in the flowData object. In this case we are using a basic extension of the class that takes a dictionary of items.
                let data = new elementDataDictionary({ flowElement: flowElement, contents: contents });

                flowData.setElementData(data);

                resolve();

            }, 500);

        });

    },
    // A property list, the meta properties details are used for fetching all data of a specific value for example flowData.getWhere("type", "string")
    properties: {
        string: {
            meta: {
                type: "string"
            }
        }
    }
});

module.exports = asyncFlowElement;