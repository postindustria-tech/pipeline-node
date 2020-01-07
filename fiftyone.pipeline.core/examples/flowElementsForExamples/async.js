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


// This async pipeline returns its results after a delay of 500 milliseconds

let pipelineCore = require("../../");
let flowElement = pipelineCore.flowElement;
let elementDataDictionary = pipelineCore.elementDataDictionary;

class async extends flowElement {

    constructor() {

        super();

        this.dataKey = "async";

        this.properties = {
            string: {
                type: "string"
            }
        }

    }

    processInternal(flowData) {

        let flowElement = this;

        return new Promise(function (resolve, reject) {

            setTimeout(function () {

                let contents = { string: "hello" };

                let data = new elementDataDictionary({ flowElement: flowElement, contents: contents });

                flowData.setElementData(data);

                resolve();

            }, 500);

        });

    }

}

module.exports = async;