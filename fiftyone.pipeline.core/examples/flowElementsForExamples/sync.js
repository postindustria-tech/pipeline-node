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

// This flowElement runs syncronously and checks the value of the async flowElement in order to demonstrate sync vs async pipelines

let pipelineCore = require("../../");
let flowElement = pipelineCore.flowElement;
let elementDataDictionary = pipelineCore.elementDataDictionary;
let basicListEvidenceKeyFilter = pipelineCore.basicListEvidenceKeyFilter;

module.exports = new flowElement({
    dataKey: "sync",
    evidenceKeyFilter: new basicListEvidenceKeyFilter(["header.user_agent"]),
    processInternal: function (flowData) {

        let contents = { integer: 5 };

        try {

            contents["boolean"] = flowData.get("async").get("string") === "hello";

        } catch (e) {

            contents["boolean"] = false;

        }

        let data = new elementDataDictionary({ flowElement: this, contents: contents });

        flowData.setElementData(data);

    },
    properties: {
        integer: {
            type: "int"
        },
        boolean: {
            type: "bool"
        }
    }
});