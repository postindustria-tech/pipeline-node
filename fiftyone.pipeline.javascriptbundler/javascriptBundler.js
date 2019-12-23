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
