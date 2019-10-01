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
