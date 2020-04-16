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

const Evidence = require('./evidence');

(function () {
  const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
  const isEnumerable = Function.bind.call(
    Function.call,
    Object.prototype.propertyIsEnumerable
  );
  const concat = Function.bind.call(Function.call, Array.prototype.concat);
  const keys = Reflect.ownKeys;

  if (!Object.values) {
    Object.values = function values (O) {
      return reduce(
        keys(O),
        (v, k) =>
          concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []),
        []
      );
    };
  }

  if (!Object.entries) {
    Object.entries = function entries (O) {
      return reduce(
        keys(O),
        (e, k) =>
          concat(
            e,
            typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []
          ),
        []
      );
    };
  }
})();

class FlowData {
  /**
   * constructor for flowData created by a pipeline.
   * Called by a pipeline's createFlowData() method
   * @param {Pipeline} pipeline
   */
  constructor (pipeline) {
    this.pipeline = pipeline;

    // All evidence added to a flowData is stored in a special collection class for easy retrieval and searching
    this.evidence = new Evidence(this);

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
  getEvidenceDataKey () {
    // Get all evidence in flowData
    const evidence = this.evidence.getAll();

    // Keep list of evidence that is requested by flowElements
    let keep = {};

    Object.values(this.pipeline.flowElements).forEach(function (flowElement) {
      // merge in the filtered evidence for the flowElement
      keep = Object.assign(
        keep,
        flowElement.evidenceKeyfilter.filterEvidence(evidence)
      );
    });

    return keep;
  }

  /**
   * Stop a flowData from processing any further flowElements
   */
  stop () {
    this.pipeline.log('info', 'FlowData stopped');

    this.stopped = true;
  }

  /**
   * Set an error on the flowData (usually triggered by something going wrong in a flowElement's process function)
   */
  setError (error, flowElement) {
    let errorKey;

    if (flowElement && flowElement.dataKey) {
      errorKey = flowElement.dataKey;
    } else {
      // catch error when flowElement datakey isn't available
      errorKey = 'other';
    }

    if (!this.errors[errorKey]) {
      this.errors[errorKey] = [];
    }

    this.pipeline.log('error', { message: error, source: errorKey });

    this.errors[errorKey].push(error);
  }

  /**
   * Processes the flowData (running the process methods on all connected)
   * @returns {Promise}
   */
  process () {
    this.pipeline.log('info', 'Pipeline processing started');

    return this.pipeline.processMethod(this);
  }

  /**
   * Add to the flowData object with a class derived from elementData
   * @param {elementData}
   * @returns {FlowData}
   */
  setElementData (data) {
    this.data[data.flowElement.dataKey] = data;

    return this;
  }

  /**
   * Get elementData by flowElementDataKey
   * @param {string} flowElementDataKey
   */
  get (flowElementDataKey) {
    this.pipeline.log('debug', 'Getting flowElement ' + flowElementDataKey);

    return this.data[flowElementDataKey];
  }

  /**
   * get elementData by a flowElement object
   * @param {FlowElement}
   */
  getFromElement (flowElement) {
    const key = flowElement.dataKey;

    return this.get(key);
  }

  /**
   * get an object ({key:value} store) of elementData based on a metadata key and value, alternatively pass in a filtering function to manually filter available propeties
   * @param {String} metaKey
   * @param {String|Function} metaValueorFuncton value or a filter function which receives the value of the metaKey and returns a boolean
   */
  getWhere (metaKey, metaValueorFuncton) {
    const flowData = this;

    const propertyList = this.pipeline.propertyDatabase;

    let filteredProperties = {};

    if (propertyList[metaKey]) {
      if (typeof metaValueorFuncton !== 'function') {
        metaValueorFuncton = metaValueorFuncton.toLowerCase();

        if (propertyList[metaKey][metaValueorFuncton]) {
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

    const output = {};

    Object.entries(filteredProperties).forEach(function ([
      propertyName,
      property
    ]) {
      const flowElementKey = property.flowElementKey;

      try {
        output[propertyName] = flowData.get(flowElementKey).get(propertyName);
      } catch (e) {
        // Ignore errors when fetching a property as getWhere would often crash to an exception if properties are not available, they should just be excluded
      }
    });

    return output;
  }
}

module.exports = FlowData;
