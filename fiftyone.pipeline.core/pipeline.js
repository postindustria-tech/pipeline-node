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

const FlowData = require('./flowData');
const EventEmitter = require('events');

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

class Pipeline {
  /**
   * Pipeline holding a list of flowElements for processing, can create flowData that will be passed through these, collecting elementData
   * Should be constructed through the pipelineBuilder class
   * @param {FlowElements[]}
   */
  constructor (flowElements = []) {
    const pipeline = this;

    // The chain of flowElements to run, including arrays of parallel elements
    this.flowElementsChain = flowElements;

    // A logger for emitting messages
    this.eventEmitter = new EventEmitter();

    // Flattened dictionary of flowElements the pipeline contains
    this.flowElements = {};

    // Run through flowElements and store them by dataKey in the pipeline.flowElements object. Recursive function so it can handle parallel elements which are passed in as arrays
    const storeInFlowElementList = function (flowElemmentList) {
      flowElemmentList.forEach(function (slot) {
        if (Array.isArray(slot)) {
          storeInFlowElementList(slot);
        } else {
          // Run registration function
          slot.onRegistration(pipeline, slot);

          pipeline.flowElements[slot.dataKey] = slot;

          // Register link between flowElement and a pipeline it's been added to
          slot.pipelines.push(pipeline);
        }
      });
    };

    storeInFlowElementList(flowElements);

    // Empty property database, later populated and possibly updated by flowElements' property lists
    this.propertyDatabase = {};

    // Update property list - Note that some of these could be async so the property list might not be updated straight away. When this happens, getWhere calls will simply return empty for those specific properties
    Object.values(this.flowElements).forEach(function (flowElement) {
      pipeline.updatePropertyDataBaseForElement(flowElement);
    });

    // Create the flowData process function here to save having to do it each time the flowData is processed. This requestedPackages up all the logic for generating promises, sync / async and others
    const processMethod = function () {
      const promiseChain = [];

      const makeProcessPromise = function (flowElement) {
        return function (flowData) {
          if (flowData.stopped) {
            return Promise.resolve(flowData);
          }

          pipeline.eventEmitter.emit(
            'info',
            'processing ' + flowElement.dataKey
          );

          return new Promise(function (resolve) {
            const setError = function (error) {
              flowData.setError(error, flowElement);

              return resolve(flowData);
            };

            const local = {};

            let process;

            try {
              process = Promise.resolve(flowElement.process(flowData, local));
            } catch (e) {
              return setError(e);
            }

            process
              .then(function () {
                resolve(flowData);
              })
              .catch(setError);
          });
        };
      };

      pipeline.flowElementsChain.forEach(function (item) {
        if (Array.isArray(item)) {
          promiseChain.push(function (flowData) {
            const promises = [];

            item.forEach(function (flowElement) {
              const promise = makeProcessPromise(flowElement)(flowData);

              promises.push(promise);
            });

            return Promise.all(promises.map((p) => p.catch((e) => e)))
              .then((results) => flowData)
              .catch((e) => console.log(e));
          });
        } else {
          promiseChain.push(makeProcessPromise(item));
        }
      });

      return function (flowData) {
        return promiseChain.reduce(function (cur, next) {
          return cur.then(next);
        }, Promise.resolve(flowData));
      };
    };

    this.processMethod = processMethod();
  }

  /**
   * get a flowElement by its dataKey
   * @param {String} dataKey
   */
  getElement (key) {
    return this.flowElements[key];
  }

  /**
   * Method to attach listeners to the logger
   * Shorthand access to the enclosed event emitter
   * @param {String} listener type of message to listen to
   * @param {Function} callback
   */
  on (listener, callback) {
    this.eventEmitter.on(listener, callback);
  }

  /**
   * Shorthand to trigger a message on the pipeline's eventEmitter
   * @param {String} type type of message to listen to
   * @param message
   */
  log (type, message) {
    this.eventEmitter.emit(type, message);
  }

  /**
   * create a flowData element from the pipeline
   * @returns {FlowData}
   */
  createFlowData () {
    const pipelineFlowData = new FlowData(this);

    // Create getters for flowElements by key so users can use flowData.elementDataKey instead of flowData.get(elementDataKey)

    Object.keys(this.flowElements).forEach(function (element) {
      Object.defineProperty(pipelineFlowData, element, {
        get: function () {
          return this.get(element);
        }
      });
    });

    return pipelineFlowData;
  }

  updatePropertyDataBaseForElement (flowElement) {
    const pipeline = this;

    return new Promise(function (resolve) {
      // First delete any instances of properties for this element

      Object.keys(pipeline.propertyDatabase).forEach(function (metaKey) {
        Object.entries(pipeline.propertyDatabase[metaKey]).forEach(function ([
          metaValue,
          list
        ]) {
          Object.entries(list).forEach(function ([key, value]) {
            if (value.flowElementKey === flowElement.dataKey) {
              delete pipeline.propertyDatabase[metaKey][metaValue][key];
            }
          });
        });
      });

      Promise.resolve(flowElement.getProperties()).then(function (properties) {
        const flowElementDataKey = flowElement.dataKey;

        Object.entries(properties).forEach(function ([
          propertyKey,
          propertyMeta
        ]) {
          const propertyName = propertyKey;

          Object.entries(propertyMeta).forEach(function ([metaKey, metaValue]) {
            metaKey = metaKey.toLowerCase();
            metaValue = metaValue.toString().toLowerCase();

            if (!pipeline.propertyDatabase[metaKey]) {
              pipeline.propertyDatabase[metaKey] = {};
            }

            if (!pipeline.propertyDatabase[metaKey][metaValue]) {
              pipeline.propertyDatabase[metaKey][metaValue] = {};
            }

            pipeline.propertyDatabase[metaKey][metaValue][propertyKey] = {
              propertyName: propertyName,
              flowElementKey: flowElementDataKey
            };
          });
        });

        resolve();
      });
    });
  }
}

module.exports = Pipeline;
