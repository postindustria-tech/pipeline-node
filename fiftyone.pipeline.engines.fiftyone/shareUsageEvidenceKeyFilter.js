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
