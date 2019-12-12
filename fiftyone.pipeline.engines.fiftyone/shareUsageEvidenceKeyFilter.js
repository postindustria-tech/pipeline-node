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
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const evidenceKeyFilter = require51("fiftyone.pipeline.core").evidenceKeyFilter;

class shareUsageEvidenceKeyFilter extends evidenceKeyFilter {

    constructor({ cookie, queryWhitelist = [], headerBlacklist = [] }) {

        super(...arguments);

        this.queryWhitelist = queryWhitelist;
        this.headerBlacklist = headerBlacklist;
        this.cookie = cookie;

    }

    filterEvidenceKey(key) {

        let prefix = key.toLowerCase().split(".")[0];
        let suffix = key.toLowerCase().split(".")[1];

        let allowed = ["header", "cookie", "query"];

        // First filter out anything that isn't in the allowed list

        if (!allowed.includes(prefix)) {

            return false;

        } else {

            // Filter out all cookies that aren't either 51D prefixed or the tracking cookie 

            if (prefix === "cookie" && (prefix.indexOf("51D") !== 0 || suffix === this.cookie)) {

                return false;

            }

            // Filter out any query evidence not in whitelist

            if (prefix === "query" && !this.queryWhitelist.includes(suffix)) {

                return false;

            }

            // Filter out any header evidence in blacklist

            if (prefix === "header" && this.headerBlacklist.includes(suffix)) {

                return false;

            }

            // Passed filtering tests, track

            return true;

        }

    }

}

module.exports = shareUsageEvidenceKeyFilter;
