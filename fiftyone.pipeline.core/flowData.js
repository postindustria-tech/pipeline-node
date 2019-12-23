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

let evidence = require("./evidence");

class flowData {

    /**
     * constructor for flowData created by a pipeline.
     * Called by a pipeline's createFlowData() method
     * @param {pipeline} pipeline
    */
    constructor(pipeline) {

        this.pipeline = pipeline;

        // All evidence added to a flowData is stored in a special collection class for easy retrieval and searching
        this.evidence = new evidence(this);

        // Errors object, keyed by flowElement that caused the error
        this.errors = {};

        // Stop flag, if the flowData is stopped, no further flowElements are processed
        this.stopped = false;

        // Store of data by flowElement dataKey
        this.data = {};

    }


    /**
     * Get back an object that lists all evidence that will be used by any flowElements in the flowData's parent pipeline
    */
    getEvidenceDataKey() {

        // Get all evidence in flowData
        let evidence = this.evidence.getAll();

        // Keep list of evidence that is requested by flowElements
        let keep = {};

        Object.values(this.pipeline.flowElements).forEach(function (flowElement) {

            // merge in the filtered evidence for the flowElement
            keep = Object.assign(keep, flowElement.evidenceKeyfilter.filterEvidence(evidence));

        });

        return keep;

    }

    /**
     * Stop a flowData from processing any further flowElements
    */
    stop() {

        this.pipeline.log("info", "FlowData stopped");

        this.stopped = true;

    }

    /**
     * Set an error on the flowData (usually triggered by something going wrong in a flowElement's process function)
    */
    setError(error, flowElement) {

        let errorKey;

        if (flowElement && flowElement.dataKey) {

            errorKey = flowElement.dataKey;

        } else {

            // catch error when flowElement datakey isn't available
            errorKey = "other";

        }

        if (!this.errors[errorKey]) {

            this.errors[errorKey] = [];

        }

        this.pipeline.log("error", { message: error, source: errorKey });

        this.errors[errorKey].push(error);

    }

    /**
     * Processes the flowData (running the process methods on all connected)
     * @returns {Promise}
    */
    process() {

        this.pipeline.log("info", "Pipeline processing started");

        return this.pipeline.processMethod(this);

    }

    /**
     * Add to the flowData object with a class derived from elementData
     * @param {elementData}
     * @returns {flowData}
    */
    setElementData(data) {

        this.data[data.flowElement.dataKey] = data;

        return this;

    }

    /**
     * Get elementData by flowElementDataKey
     * @param {string} flowElementDataKey
    */
    get(flowElementDataKey) {

        this.pipeline.log("debug", "Getting flowElement " + flowElementDataKey);

        return this.data[flowElementDataKey];

    }

    /**
     * get elementData by a flowElement object
     * @param {flowElement}
    */
    getFromElement(flowElement) {

        let key = flowElement.dataKey;

        return this.get(key);
    }

    /**
     * get an object ({key:value} store) of elementData based on a metadata key and value, alternatively pass in a filtering function to manually filter available propeties
     * @param {String} metaKey
     * @param {String|Function} metaValueorFuncton value or a filter function which receives the value of the metaKey and returns a boolean
    */
    getWhere(metaKey, metaValueorFuncton) {

        let flowData = this;

        let propertyList = this.pipeline.propertyDatabase;

        let filteredProperties = {};

        if (propertyList[metaKey]) {

            if (typeof metaValueorFuncton !== "function") {

                metaValueorFuncton = metaValueorFuncton.toLowerCase();

                if(propertyList[metaKey][metaValueorFuncton]){

                    filteredProperties = propertyList[metaKey][metaValueorFuncton];

                }

            } else {

                Object.keys(propertyList[metaKey]).forEach(function (value) {

                    if (metaValueorFuncton(value)) {

                        Object.assign(filteredProperties, propertyList[metaKey][value]);

                    }

                });

            }

        }

        let output = {};

        Object.entries(filteredProperties).forEach(function ([propertyName, property]) {

            let flowElementKey = property.flowElementKey;

            try {

                output[propertyName] = flowData.get(flowElementKey).get(propertyName);

            } catch (e) {

                // Ignore errors when fetching a property as getWhere would often crash to an exception if properties are not available, they should just be excluded

            }

        });

        return output;

    }

}

module.exports = flowData;
