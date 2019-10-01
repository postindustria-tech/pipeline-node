const pipeline = require("./pipeline");
const fs = require("fs");

class pipelineBuilder {

    constructor() {

        this.flowElements = [];

    }

    /**
     * Helper that loads a JSON configuration file from the filesystem and calls pipelineBuilder.buildFromConfiguration
     * @param {String} path path to a JSON configuration file
    */
    buildFromConfigurationFile(path) {

        let file = fs.readFileSync(path, "utf8");

        let parsedFile = JSON.parse(file);

        return this.buildFromConfiguration(parsedFile);

    }

    /**
     * Create a pipeline from a JSON configuration
     * @param {Object} config a JSON configuration object
    */
    buildFromConfiguration(config) {

        let flowElements = [];

        config.PipelineOptions.Elements.forEach(function (element) {

            let flowElement = require(element.elementName);

            if (!element.elementParameters) {

                element.elementParameters = {};

            }

            flowElements.push(new flowElement(element.elementParameters));

        })

        return new pipeline(flowElements);

    }

    /**
     * Add a single flowElement to be executed in series
     * @param {flowElement} flowElement
    */
    add(flowElement) {

        this.flowElements.push(flowElement);

        return this;

    }

    /**
     * Add an array of flowElements to be executed in parallel
     * @param {flowElement[]} flowElements
    */
    addParallel(flowElements) {

        this.flowElements.push(flowElements);

        return this;

    }

    /**
     * Build the pipeline from the flowElements that have been added
     * @returns {pipeline}
    */
    build() {

        return new pipeline(this.flowElements);

    }

}

module.exports = pipelineBuilder;
