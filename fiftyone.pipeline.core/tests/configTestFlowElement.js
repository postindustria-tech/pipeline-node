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

let flowElement = require("../flowElement");
let elementDataDictionary = require("../elementDataDictionary");

class configTestFlowElement extends flowElement {

    constructor({ prefix }) {

        super(...arguments);

        this.prefix = prefix;
        this.dataKey = "configTest"

    }

    processInternal(flowData) {

        let data = new elementDataDictionary({ flowElement: this, contents: { "built": this.prefix + "_world" } });

        flowData.setElementData(data);

    }

}

module.exports = configTestFlowElement;
