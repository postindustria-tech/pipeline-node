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

const pipeline = require("./pipeline");

const fs = require("fs");
const path = require("path");

class pipelineBuilder {
  constructor(settings = {}) {
    this.flowElements = [];

    if (settings.addJavaScriptBuilder) {
      this.addJavaScriptBuilder = settings.addJavascriptBuilder;
    } else {
      this.addJavaScriptBuilder = true;
    }

    if (settings.javascriptBuilderSettings) {
      this.javascriptBuilderSettings = settings.javascriptBuilderSettings;
    }

  }

  /**
   * Helper that loads a JSON configuration file from the filesystem and calls pipelineBuilder.buildFromConfiguration
   * @param {String} path path to a JSON configuration file
   */
  buildFromConfigurationFile(configPath) {
    let file = fs.readFileSync(configPath, "utf8");

    let parsedFile = JSON.parse(file);

    return this.buildFromConfiguration(parsedFile);
  }

  /**
   * Create a pipeline from a JSON configuration
   * @param {Object} config a JSON configuration object
   */
  buildFromConfiguration(config) {
    let flowElements = [];

    config.PipelineOptions.Elements.forEach(function(element) {
      let flowElement;

      try {
        flowElement = require(element.elementName);
      } catch (e) {
        try {
          let localPath = path.resolve(process.cwd(), element.elementName);

          flowElement = require(localPath);
        } catch (e) {
          throw "Can't find " + element.elementName;
        }
      }

      if (!element.elementParameters) {
        element.elementParameters = {};
      }

      flowElements.push(new flowElement(element.elementParameters));
    });

    flowElements = flowElements.concat(this.getJavaScriptElements());

    return new pipeline(flowElements);
  }

  getJavaScriptElements() {
    let flowElements = [];

    if (this.addJavaScriptBuilder) {
      
      // Add JavaScript elements

      const javascriptBuilder = require("./javascriptbuilder");
      const jsonBundler = require("./jsonbundler");
      const sequenceElement = require("./sequenceElement");

      flowElements.push(new sequenceElement());
      flowElements.push(new jsonBundler());

      if (this.javascriptBuilderSettings) {

        flowElements.push(
          new javascriptBuilder(this.javascriptBuilderSettings)
        );
      } else {
        flowElements.push(new javascriptBuilder({}));
      }
    }

    return flowElements;
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
    this.flowElements = this.flowElements.concat(this.getJavaScriptElements());

    return new pipeline(this.flowElements);
  }
}

module.exports = pipelineBuilder;
