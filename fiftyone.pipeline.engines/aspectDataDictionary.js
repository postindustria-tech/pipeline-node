const aspectData = require("./aspectData");

class aspectDataDictionary extends aspectData {

    /**
     * Extension of elementDataDictionary which stores a {key,value} dictionary of elements like elementDataDictionary but with the additional aspectData extensions
     * @param {Object} options
     * @param {flowElement} options.flowElement
     * @param {missingPropertyService} options.missingPropertyService
     * @param {Object} options.contents
    */
    constructor({ flowElement, contents, missingPropertyService }) {

        super(...arguments);

        this.contents = contents;

    }

    getInternal(key) {

        return this.contents[key];

    }

}

module.exports = aspectDataDictionary;
