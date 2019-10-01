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
