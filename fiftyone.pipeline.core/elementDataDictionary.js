const elementData = require("./elementData");

class elementDataDictionary extends elementData {

    /**
     * a basic extension of elementData with dictionary object storage / lookup
     * @param {Object} options
     * @param {flowElement} options.flowElement 
     * @param {contents} options.contents // key value dictionary 
    */
    constructor({ flowElement, contents }) {

        super(...arguments);

        this.contents = contents;

    }

    // Retrieve the value from the dictionary
    getInternal(key) {

        return this.contents[key];

    }

}

module.exports = elementDataDictionary;
