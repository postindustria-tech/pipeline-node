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

const elementData = require51("fiftyone.pipeline.core").elementData;
const missingPropertyServiceBase = require("./missingPropertyService");

class aspectData extends elementData {

    /**
     * Extension of elementData which allows for a missing property service to be called when an accessed property isn't available. engines, an extension of flowElements also allow a restricted property list so certain properties can be excluded
     * @param {Object} options
     * @param {flowElement} options.flowElement
     * @param {missingPropertyService} options.missingPropertyService
    */
    constructor(
        {
            flowElement, missingPropertyService = new missingPropertyServiceBase()
        }) {

        super(...arguments);

        if (missingPropertyService) {

            this.missingPropertyService = missingPropertyService;

        }

    }

    /**
     * The aspectData getter runs a series of actions if a property has / has not been found. If it hasn't been found it runs the missing property service if the property is referenced by the flowElement/engine. If the property is found a further check to see if it is restricted by a list passed into the flowElement/engine.
     * @param {String} key
    */
    get(key) {

        let result;

        try {

            result = this.getInternal(key);

            if (typeof result === "undefined") {

                return this.missingPropertyService.check(key, this.flowElement);

            }

        } catch (e) {

            return this.missingPropertyService.check(key, this.flowElement);

        }

        if (this.flowElement.restrictedProperties) {

            if (!this.flowElement.restrictedProperties.includes(key)) {

                throw "Property " + key + " was excluded from " + this.flowElement.dataKey;

            }

        }

        return result;

    }

}

module.exports = aspectData;
