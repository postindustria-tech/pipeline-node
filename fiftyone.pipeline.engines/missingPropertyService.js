class missingPropertyService {

    /**
     * Simple base class for a missing property service that returns an error if the property is not available for some reason
     * @param {String} elementData key
     * @param {flowElement} flowElement
    */
    check(key, flowElement) {

        throw "Property " + key + " not found in " + flowElement.dataKey;

    }

}

module.exports = missingPropertyService;
