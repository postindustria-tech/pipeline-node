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

const flowElement = require("./flowElement.js");
const elementDataDictionary = require("./elementDataDictionary.js");
const basicListEvidenceKeyFilter = require("./basicListEvidenceKeyFilter.js");

class JSONBundlerElement extends flowElement {
  constructor() {
    super(...arguments);

    this.dataKey = "jsonbundler";
    this.evidenceKeyFilter = new basicListEvidenceKeyFilter([]);

  }

  /**
   * The JSON Builder extracts all properties and serializes them into JSON
   * @param {flowData} flowData
   */
  processInternal(flowData) {
    // Get every property on every flowElement
    // Storing JavaScript properties in an extra section
    // Also storing any null value exceptions that come out of aspect property values

    let output = {
      nullValueReasons: {},
      javascriptProperties: []
    };

    for (let flowElement in flowData.pipeline.flowElements) {

      if (flowElement === "jsonbundler" || flowElement === "javascriptbuilder" || flowElement === "sequence") {
        continue;
      }

      // Create empty area for flowElement properties to go
      output[flowElement] = {};

      let flowElementObject = flowData.pipeline.flowElements[flowElement];

      let properties = flowElementObject.getProperties();

      for (let property in properties) {
        // Get the value

        let value;

        try {
          let valueContainer = flowData.get(flowElement).get(property);

          // Check if value is of the aspect property value type

          if (valueContainer.hasOwnProperty("hasValue")) {
            // Check if it has a value

            if (valueContainer.hasValue) {
              value = valueContainer.value;
            } else {
              value = null;

              let nullValueReason = valueContainer.noValueMessage;

              output.nullValueReasons[
                flowElement + "." + property
              ] = nullValueReason;
            }
          } else {
            // Standard value

            value = valueContainer;
          }
        } catch (e) {
          // Catching missing property exceptions and other errors

          continue;
        }

        output[flowElement][property] = value;

        let propertyObject = properties[property];

        if(!flowData.evidence.get("query.sequence") || flowData.evidence.get("query.sequence") < 10){

          if (
            propertyObject.type &&
            propertyObject.type.toLowerCase() === "javascript"
          ) {
            output.javascriptProperties.push(flowElement + "." + property);
          }

        }

      }
    }

    let data = new elementDataDictionary({
      flowElement: this,
      contents: { json: output }
    });

    flowData.setElementData(data);
  }
}

module.exports = JSONBundlerElement;
