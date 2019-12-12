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

 class evidenceKeyFilter {

    /**
     * Filter an evidence object
     * @param {Object} evidenceKeyObject
    */
    filterEvidence(evidenceKeyObject) {

        let filter = this;

        let filtered = {};

        Object.keys(evidenceKeyObject).forEach(function (evidenceKey) {

            if (filter.filterEvidenceKey(evidenceKey)) {

                filtered[evidenceKey] = evidenceKeyObject[evidenceKey];

            }

        });

        return filtered;

    }

    /**
     * Internal filterEvidenceKey function overriden by specific filters to keep or filter out a piece of evidence
     * @param {String} evidenceKey
     * @returns {Boolean}
    */
    filterEvidenceKey(key) {

        return true;

    }

}

module.exports = evidenceKeyFilter;
