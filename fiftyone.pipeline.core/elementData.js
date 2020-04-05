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
     * @param {String} key
     * @return {mixed} value
    */
    get(key) {

        return this.getInternal(key);

    }

    /**
     * Return string value of property
     * @param {String} key
     * @return {string} value
    */
    getAsString(key) {

        let result = this.get(key);

        if (typeof result !== "undefined") {

            return result.toString();

        }

    }

    /**
     * Return float value of property
     * @param {String} key
     * @return {float} value
    */
    getAsFloat(key) {

        let result = this.get(key);

        if (typeof result !== "undefined") {

            return parseFloat(result);

        }

    }

    /**
     * Return int value of property
     * @param {String} key
     * @return {int} value
    */
    getAsInteger(key) {

        let result = this.get(key);

        if (typeof result !== "undefined") {

            return parseInt(result);

        }

    }

}

module.exports = elementData;
