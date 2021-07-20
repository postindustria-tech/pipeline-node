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

const require51 = (requestedPackage) => {
  try {
    return require(__dirname + '/../' + requestedPackage);
  } catch (e) {
    return require(requestedPackage);
  }
};

const Engine = require('fiftyone.pipeline.engines').Engine;
const querystring = require('querystring');
const cloudHelpers = require('./cloudHelpers');
const AspectDataDictionary = require('fiftyone.pipeline.engines')
  .AspectDataDictionary;
const BasicListEvidenceKeyFilter = require('fiftyone.pipeline.core')
  .BasicListEvidenceKeyFilter;
const sharedValues = require('./sharedValues');

/**
 * @typedef {import('fiftyone.pipeline.core').FlowData} FlowData
 */

// Engine that makes a call to the 51Degrees cloud service
// Returns raw JSON as a "cloud" property under "cloud" dataKey
class CloudRequestEngine extends Engine {
  /**
   * Constructor for CloudRequestEngine
   *
   * @param {object} options options object
   * @param {string} options.resourceKey resourcekey for cloud service
   * @param {string} options.licenseKey licensekey for cloud service
   * @param {string} options.baseURL url the cloud service is located at
   * if overriding default
   * @param {string} options.cloudRequestOrigin The value to set for the Origin 
   * header when making requests to the cloud service.
   * This is used by the cloud service to check that the request is being 
   * made from a origin matching those allowed by the resource key.
   * For more detail, see the 'Request Headers' section in the 
   * <a href="https://cloud.51degrees.com/api-docs/index.html">cloud documentation</a>.
   */
  constructor (
    {
      resourceKey,
      licenseKey,
      baseURL,
      cloudRequestOrigin
    }) {
    super(...arguments);

    this.dataKey = 'cloud';

    if (!resourceKey) {
      throw 'Cloud engine needs a resourceKey';
    }

    this.resourceKey = resourceKey;
    this.licenseKey = licenseKey;
    this.cloudRequestOrigin = cloudRequestOrigin

    // Check if baseURL is set. If not try to set it the environment variable
    // if presents, else set to default value
    if (!baseURL) {
      baseURL = process.env.FOD_CLOUD_API_URL;
      if (!baseURL) {
        baseURL = sharedValues.baseURLDefault;
      }
    }

    // Check if the set baseURL ends with '/'
    if (baseURL && baseURL.endsWith('/') === false) {
      baseURL = baseURL + '/';
    }
    this.baseURL = baseURL;
    this.evidenceKeys = [];

    // Properties of connected FlowElements
    this.flowElementProperties = {};

    const self = this;

    Promise.all([this.getEvidenceKeys(), this.fetchProperties()]).then(function () {
      self.initialised = true;
    }).catch(function (error) {
      self.initialised = false;
      
      self.errors = self.getErrorsFromResponse(error);

      if (self.pipelines) {
        // Log error on all pipelines engine is attached to

        self.pipelines.map(function (pipeline) {
          pipeline.log('error', {
            source: 'CloudRequestEngine',
            message: self.errors
          });
        });
      }
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
      } else if (self.initialised === false) {
        reject(self.errors);
      } else {
        const readyCheck = setInterval(function () {
          if (self.initialised === true) {
            clearInterval(readyCheck);
            resolve(self);
          } else if (self.initialised === false) {
            reject(self.errors);
            clearInterval(readyCheck);
          }
        });
      }
    });
  }

  /**
   * Internal process for cloud engine
   * Returns raw JSON as a "cloud" property in "cloud"
   *
   * @param {FlowData} flowData flowData to process
   * @returns {Promise} data from cloud service
   */
  processInternal (flowData) {
    const engine = this;
    return engine.getData(flowData);
  }

  /**
   * Typically, cloud will return errors as JSON.
   * However, transport level errors or other failures can result in
   * responses that are plain text. This function handles these cases.
   * 
   * @param {String} response the response data to process
   * @returns {Object} The error message data
   */
  getErrorsFromResponse(response){
    try {
      return JSON.parse(response).errors;  
    } catch (parseError) {
      return { errors: [ 'Error parsing response - ' + response ]};
    }
  }

  /**
   * Internal process to fetch all the properties available under a resourcekey
   *
   * @returns {Promise} properties from the cloud server
   */
  fetchProperties () {
    const engine = this;

    return new Promise(function (resolve, reject) {
      let url = engine
        .baseURL +
        'accessibleproperties?resource=' +
        engine.resourceKey;

      // licenseKey is optional
      if (engine.licenseKey) {
        url += '&license=' + engine.licenseKey;
      }

      cloudHelpers.makeHTTPRequest(url, engine.cloudRequestOrigin)
      .then(function (properties) {
        const propertiesOutput = {};

        properties = JSON.parse(properties);

        const products = properties.Products;

        for (const product in products) {
          propertiesOutput[product] = {};

          products[product]
            .Properties
            .forEach(function (productProperty) {
              propertiesOutput[product][productProperty
                .Name
                .toLowerCase()
              ] = {};
              for (const metaKey in productProperty) {
                propertiesOutput[product][productProperty
                  .Name
                  .toLowerCase()
                ][metaKey.toLowerCase()] = productProperty[metaKey];
              }
            });
        }
        engine.flowElementProperties = propertiesOutput;
        resolve(propertiesOutput);
      }).catch(reject);
    });
  }

  /**
   * Internal function to get data from cloud service
   *
   * @param {FlowData} flowData
   * FlowData used to extract evidence and send to cloud service
   * for processing
   * @returns {Promise} result of processing
   */
  getData (flowData) {
    const engine = this;

    const evidence = flowData.evidence.getAll();

    const evidenceRequest = {};

    Object.keys(evidence).forEach(function (key) {
      const value = evidence[key];
      const keyWithoutPrefix = key.split('.')[1];

      evidenceRequest[keyWithoutPrefix] = value;
    });

    let url = this.baseURL +
      this.resourceKey + '.json?' +
      querystring.stringify(evidenceRequest);

    // licensekey is optional
    if (this.licenseKey) {
      url += '&license=' + this.licenseKey;
    }

    const self = this;

    return new Promise(function (resolve, reject) {
      cloudHelpers
        .makeHTTPRequest(url, engine.cloudRequestOrigin)
        .then(function (body) {
          const data = new AspectDataDictionary({
            flowElement: engine,
            contents: {
              cloud: body,
              properties: engine.properties
            }
          });

          flowData.setElementData(data);

          resolve();
        }).catch(function (error) {
          self.errors = self.getErrorsFromResponse(error); 
          reject(self.errors);
        });
    });
  }

  /**
   * Internal function to get evidenceKeys used by cloud resourcekey
   *
   * @returns {Array} evidence key list
   */
  getEvidenceKeys () {
    const engine = this;
    const url = this.baseURL + 'evidencekeys';
    return cloudHelpers.makeHTTPRequest(url, engine.cloudRequestOrigin)
      .then(function (body) {
        engine.evidenceKeyFilter = new BasicListEvidenceKeyFilter(
          JSON.parse(body)
        );
      });
  }
}

module.exports = CloudRequestEngine;
