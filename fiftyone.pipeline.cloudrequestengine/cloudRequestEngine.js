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

(function () {
  const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
  const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
  const concat = Function.bind.call(Function.call, Array.prototype.concat);
  const keys = Reflect.ownKeys;

  if (!Object.values) {
    Object.values = function values (O) {
      return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
    };
  }

  if (!Object.entries) {
    Object.entries = function entries (O) {
      return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
    };
  }
}());

const Engine = require51('fiftyone.pipeline.engines').Engine;
const querystring = require('querystring');
const cloudHelpers = require('./cloudHelpers');
const AspectDataDictionary = require51('fiftyone.pipeline.engines').AspectDataDictionary;
const BasicListEvidenceKeyFilter = require51('fiftyone.pipeline.core').BasicListEvidenceKeyFilter;

class CloudRequestEngine extends Engine {
  /**
     * Constructor for engine that makes a call to the 51Degrees cloud service
     * Returns raw JSON as a "cloud" property in "cloud"
     * @param {Object} options
     * @param {String} options.resourceKey
     * @param {String} options.licenseKey
    */
  constructor ({ resourceKey, licenseKey, baseURL = 'https://cloud.51degrees.com/api/v4/' }) {
    super(...arguments);

    this.dataKey = 'cloud';

    if (!resourceKey) {
      throw 'Cloud engine needs a resourceKey';
    }

    this.resourceKey = resourceKey;
    this.licenseKey = licenseKey;
    this.baseURL = baseURL;
    this.evidenceKeys = [];

    // Trigger get and store of evidence keys on init
    this.getEvidenceKeys();
  }

  /**
    * Interanal process for cloud engine
    * Returns raw JSON as a "cloud" property in "cloud"
    * @param {FlowData} flowData
   */
  processInternal (flowData) {
    const engine = this;

    // Check if properties list exists, if not fetch it

    if (!Object.keys(this.properties).length) {
      return this.fetchProperties().then(function (properties) {
        engine.properties = properties;

        return engine.getData(flowData);
      });
    } else {
      return engine.getData(flowData);
    }
  }

  fetchProperties () {
    const engine = this;

    return new Promise(function (resolve, reject) {
      let url = engine.baseURL + 'accessibleproperties?resource=' + engine.resourceKey;

      // licenseKey is optional
      if (engine.licenseKey) {
        url += '&license=' + engine.licenseKey;
      }

      cloudHelpers.makeHTTPRequest(url).then(function (properties) {
        const propertiesOutput = {};

        properties = JSON.parse(properties);

        const products = properties.Products;

        for (const product in products) {
          propertiesOutput[product] = {};

          products[product].Properties.forEach(function (productProperty) {
            propertiesOutput[product][productProperty.Name.toLowerCase()] = productProperty;
          });
        }

        resolve(propertiesOutput);
      }).catch(reject);
    });
  }

  getData (flowData) {
    const engine = this;

    const evidence = flowData.evidence.getAll();

    const evidenceRequest = {};

    Object.entries(evidence).forEach(function ([key, value]) {
      const keyWithoutPrefix = key.split('.')[1];

      evidenceRequest[keyWithoutPrefix] = value;
    });

    let url = this.baseURL + this.resourceKey + '.json?' + querystring.stringify(evidenceRequest);

    // licensekey is optional
    if (this.licenseKey) {
      url += '&license=' + this.licenseKey;
    }

    return new Promise(function (resolve, reject) {
      cloudHelpers.makeHTTPRequest(url).then(function (body) {
        const data = new AspectDataDictionary({ flowElement: engine, contents: { cloud: body, properties: engine.properties } });

        flowData.setElementData(data);

        resolve();
      }).catch(reject);
    });
  }

  getEvidenceKeys () {
    const engine = this;
    const url = this.baseURL + 'evidencekeys';
    cloudHelpers.makeHTTPRequest(url).then(function (body) {
      engine.evidenceKeyFilter = new BasicListEvidenceKeyFilter(JSON.parse(body));
    });
  }
}

module.exports = CloudRequestEngine;
