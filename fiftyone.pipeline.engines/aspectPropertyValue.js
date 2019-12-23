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

class aspectPropertyValue {

    constructor(noValueMessage="No value has been set.") {
        this.noValueMessage = noValueMessage;
        this.value = undefined;
    }

    /**
     * Get the value of this instance.
     * @returns {Mixed} 
     * @throws Will throw error if 'hasValue' is false.
    */
    get value() {
        if(this.hasValue){
            return this._value;
        }else{
            throw this.noValueMessage;
        }
    }

    /**
     * Set the value of this instance.
     * @param {Mixed} value 
    */
    set value(value) {
        if(typeof value !== 'undefined' && value !== null){
            this._value = value;
            this.hasValue = true;
        } else {
            this._value = undefined;
            this.hasValue = false;
        }
    }
}

module.exports = aspectPropertyValue;