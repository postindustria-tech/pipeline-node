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
        return require(__dirname + "/../" + requestedPackage);
    } catch (e) {
        return require(requestedPackage);
    }
};

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

            let flowElement = require51(element.elementName);

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
