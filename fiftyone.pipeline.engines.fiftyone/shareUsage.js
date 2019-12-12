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

const engines = require51("fiftyone.pipeline.engines");

const engine = engines.engine;
const shareUsageEvidenceKeyFilter = require("./shareUsageEvidenceKeyFilter");
const shareUsageTracker = require("./shareUsageTracker");
const zlib = require('zlib');
const https = require('https');

const os = require("os");

class shareUsage extends engine {

    /**
     * Constructor for shareUsage element which sends usage data to 51Degrees in zipped batches
     * @param {Object} options
     * @param {Number} options.interval
     * @param {Number} options.requestedPackageSize
     * @param {String} options.cookie // session tracking cookie
     * @param {Array} options.queryWhitelist // list of query string whitelist evidence to keep
     * @param {Array} options.headerBlacklist // list of header evidence to exclude
     * @param {Number} options.sharePercentage // percentage of requests to share
    */
    constructor({ interval = 100, requestedPackageSize = 10, cookie, queryWhitelist, headerBlacklist, sharePercentage = 100 } = {}) {

        super(...arguments);

        this.trackingCookie = cookie;

        this.evidenceKeyFilter = new shareUsageEvidenceKeyFilter({ cookie: cookie, queryWhitelist: queryWhitelist, headerBlacklist: headerBlacklist });

        this.dataKey = "shareUsage";

        this.tracker = new shareUsageTracker({ interval: interval });

        this.requestedPackageSize = requestedPackageSize;

        this.sharePercentage = sharePercentage;

        this.sharePercentageCounter = 0;

        this.shareData = [];

    }

    processInternal(flowData) {

        this.sharePercentageCounter += 1;

        if (this.sharePercentageCounter === this.sharePercentage) {

            this.sharePercentageCounter = 0;

        }

        if (this.sharePercentageCounter !== 0) {

            return;

        }

        let cacheKey = this.evidenceKeyFilter.filterEvidence(flowData.evidence.getAll());

        let share = this.tracker.track(cacheKey);

        if (share) {

            this.tracker.put(cacheKey);

            this.addToShareUsage(cacheKey);

        }

    }

    addToShareUsage(key) {

        let xml = "";

        xml += "<device>";

        xml += "<Version>4</Version>";

        xml += "<Language>Node.JS</Language>";

        xml += "<LanguageVersion>" + process.version + "</LanguageVersion>";

        xml += "<Platform>" + process.platform + " " + os.release() + "</Platform>";

        for (let item in key) {

            let parts = item.split(".");

            let prefix = parts[0];
            let name = parts[1];
            let value = key[item];

            xml += `<${prefix} name="${name}">${value}</${prefix}>`;

        }

        let date = new Date().toISOString().substr(0, 19).replace('T', ' ').split(" ").join(":");

        xml += "<dateSent>" + date + "</dateSent>";

        xml += "</device>";

        this.shareData.push(xml);

        if (this.shareData.length === this.requestedPackageSize) {

            this.sendShareUsage();

        }

    }

    sendShareUsage() {

        let data = "<devices>" + this.shareData.join() + "</devices>";

        let options = {
            hostname: 'devices-v4.51degrees.com',
            path: '/new.ashx',
            method: 'POST',
            headers: { 'Content-Encoding': 'gzip', 'Content-Type': "text/xml" }
        };

        zlib.gzip(data, function (err, buffer) {
            var req = https.request(options, function (res) {

                // Reset sharedata collection

                this.shareData = [];

            });
            req.on('error', function (e) {

                this.pipeline.emit("warning", e);

            });

            req.write(buffer);
            req.end();
        });

    }

}

module.exports = shareUsage;
