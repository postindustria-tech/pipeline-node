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

let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const core = require51("fiftyone.pipeline.core");

(function () {

    const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
    const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
    const concat = Function.bind.call(Function.call, Array.prototype.concat);
    const keys = Reflect.ownKeys;

    if (!Object.values) {
        Object.values = function values(O) {
            return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
        };
    }

    if (!Object.entries) {
        Object.entries = function entries(O) {
            return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
        };
    }

}());

const flowElement = core.flowElement;
const elementDataDictionary = core.elementDataDictionary;

class JavaScriptBundlerElement extends flowElement {

    constructor() {

        super(...arguments);

        this.dataKey = "javascript";

    }

    /**
     * The JavaScriptBundler extracts all JavaScript Properties and puts them into a script string that can be inserted onto the page.
     * @param {flowData} flowData
    */
    processInternal(flowData) {

        let javascript = flowData.getWhere("type", "javascript");

        let output = "";

        let sanitizeName = (name) => name.split(".").join("_").split("-").join("_");

        if (javascript) {

            output += `class FOD_CO {`;

            Object.entries(javascript).forEach(function ([key, value]) {

                if (value.hasValue) {

                    value = value.value;

                }

                output += sanitizeName(key) + "(){" + value + "}";

            })

            output += "};";

            output += "let fod_co = new FOD_CO();"

            // Run function call for each property

            Object.keys(javascript).forEach(function (key) {

                output += "fod_co." + sanitizeName(key) + "();"

            });

        }

        let data = new elementDataDictionary(
            {
                flowElement: this,
                contents: { javascript: output }
            });

        flowData.setElementData(data);

    }

}

module.exports = JavaScriptBundlerElement;
