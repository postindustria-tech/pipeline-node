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
