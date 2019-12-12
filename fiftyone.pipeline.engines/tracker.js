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

 const dataKeyedCache = require("./dataKeyedCache");

class tracker extends dataKeyedCache {

    /**
     * The track method calls the dataKeyedCache get method, if it receives a result it sends it onto a match function 
     * @param {Object} cachekey
    */
    track(key) {

        let result = this.get(key);

        if (!result) {

            return true;

        } else {

            return this.match(key, result);

        }

    }

    /**
     * If object is found in cache, the match function is called
     * @param {Object} result
    */
    match(result) {

        return true;

    }

}

module.exports = tracker;