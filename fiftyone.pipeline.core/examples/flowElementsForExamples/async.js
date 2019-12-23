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


// This async pipeline returns its results after a delay of 500 milliseconds

let pipelineCore = require("../../");
let flowElement = pipelineCore.flowElement;
let elementDataDictionary = pipelineCore.elementDataDictionary;

module.exports = new flowElement({
    dataKey: "async",
    processInternal: function (flowData) {

        let flowElement = this;

        return new Promise(function (resolve, reject) {

            setTimeout(function () {

                let contents = { string: "hello" };

                let data = new elementDataDictionary({ flowElement: flowElement, contents: contents });

                flowData.setElementData(data);

                resolve();

            }, 500);

        });

    },
    properties: {
        string: {
            type: "string"
        }
    }
});