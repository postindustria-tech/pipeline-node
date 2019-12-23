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

class elementData {

    /**
     * constructor for elementData, stores information created by a flowElement based on flowData. Stored (keyed by flowElement and searchable via meta data properties) in flowData
     * @param {Object} options
     * @param {flowElement} options.flowElement
    */
    constructor({ flowElement }) {

        if (!flowElement.dataKey) {

            throw "flowElement dataKey not found";

        }

        this.flowElement = flowElement;

        return new Proxy(this, {
            get: (data, key) => {
                
                try {

                    return data[key] || data.get(key);

                } catch(e){

                    // Skip missing property errors etc

                }
                
            }
        });

    }

    /**
     * Internal get method for elementData to retrieve an element from it
     * called via the elementData's get method
     * @param {String} key
    */
    getInternal(key) {

        return;

    }

    /**
     * A wrapper that performs actions before passing on processing (or skipping) the getInternal method
    */
    get(key) {

        return this.getInternal(key);

    }

    /**
     * Return string version of elementData
    */
    getAsString(key) {

        let result = this.get(key);

        if (typeof result !== "undefined") {

            return result.toString();

        }

    }

    /**
     * Return float version of elementData
    */
    getAsFloat(key) {

        let result = this.get(key);

        if (typeof result !== "undefined") {

            return parseFloat(result);

        }

    }

    /**
     * Return integer version of elementData
    */
    getAsInteger(key) {

        let result = this.get(key);

        if (typeof result !== "undefined") {

            return parseInt(result);

        }

    }

}

module.exports = elementData;
