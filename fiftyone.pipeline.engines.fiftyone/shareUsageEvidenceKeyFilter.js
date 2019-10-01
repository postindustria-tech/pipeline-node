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
