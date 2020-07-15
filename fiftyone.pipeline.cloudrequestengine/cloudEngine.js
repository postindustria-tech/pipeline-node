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

const engines = require('fiftyone.pipeline.engines');
const core = require('fiftyone.pipeline.core');
const Engine = engines.Engine;
const AspectDataDictionary = engines.AspectDataDictionary;
const AspectPropertyValue = core.AspectPropertyValue;
const BasicListEvidenceKeyFilter = core.BasicListEvidenceKeyFilter;

/**
 * This is a template for all 51Degrees cloud engines.
 * It requires the 51Degrees cloudRequestEngine to be placed in a
 *  pipeline before it. It takes that raw JSON response and
 * parses it to extract the device part.
 * It also uses this data to generate a list of properties and an evidence key filter
 **/
class CloudEngine extends Engine {
  constructor () {
    super(...arguments);

    this.dataKey = 'CloudEngineBase'; // This should be overriden

    const engine = this;

    this.registrationCallbacks.push(function (pipeline, flowElement) {
      const cloudRequestEngine = pipeline.flowElements.cloud;

      if (!cloudRequestEngine) {
        pipeline.log('error', 'No CloudRequestEngine in Pipeline');
      }

      cloudRequestEngine.ready().then(function () {
        flowElement.properties = cloudRequestEngine.flowElementProperties[flowElement.dataKey];
        engine.updateProperties();
        flowElement.evidenceKeyFilter = new BasicListEvidenceKeyFilter(cloudRequestEngine.evidenceKeys);
        engine.initialised = true;
      }).catch(function (error) {
        // throw error;

        engine.errors = error;

        engine.initialised = false;
      });
    });
  }

  /**
   * Function for testing if the cloud engine is ready
   * Checks to see if properties and evidence keys have been fetched
   *
   * @returns {Promise} whether ready
   */
  ready () {
    const self = this;
    return new Promise(function (resolve, reject) {
      if (self.initialised === true) {
        resolve(self);
      } else {
        const readyCheck = setInterval(function () {
          if (self.initialised === true) {
            clearInterval(readyCheck);
            resolve(self);
          } else if (self.initialised === false) {
            clearInterval(readyCheck);
            reject(self.errors);
          }
        });
      }
    });
  }

  /**
   * Internal process method for all cloud engines
   *
   * @param {FlowData} flowData FlowData to process
   * @returns {void}
   */
  processInternal (flowData) {
    const engine = this;

    return engine.ready().then(function () {
      let cloudData = flowData.get('cloud').get('cloud');

      cloudData = JSON.parse(cloudData);

      // Loop over cloudData.device properties to check if they have a value

      const result = {};

      Object.entries(cloudData[engine.dataKey]).forEach(function ([key, value]) {
        result[key] = new AspectPropertyValue();

        if (cloudData[engine.dataKey][key + 'nullreason']) {
          result[key].noValueMessage = cloudData[engine.dataKey][key + 'nullreason'];
        } else {
          result[key].value = value;
        }
      });

      const data = new AspectDataDictionary(
        {
          flowElement: engine,
          contents: result
        });

      flowData.setElementData(data);
    });
  }
}

module.exports = CloudEngine;
