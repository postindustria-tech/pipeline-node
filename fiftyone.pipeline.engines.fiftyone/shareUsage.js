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

const require51 = (requestedPackage) => {
  try {
    return require(__dirname + '/../' + requestedPackage);
  } catch (e) {
    return require(requestedPackage);
  }
};

const engines = require51('fiftyone.pipeline.engines');

const Engine = engines.Engine;
const ShareUsageEvidenceKeyFilter = require('./shareUsageEvidenceKeyFilter');
const ShareUsageTracker = require('./shareUsageTracker');
const zlib = require('zlib');
const https = require('https');

const os = require('os');

/**
 * The ShareUsage element sends usage data to 51Degrees in zipped batches
 */
class ShareUsage extends Engine {
  /**
   * Constructor for ShareUsage engine
   *
   * @param {object} options settings object for shareusage
   * @param {number} options.interval how often to send
   * @param {number} options.requestedPackageSize how many items
   * in one zipped packaged
   * @param {string} options.cookie which cookie is used to track evidence
   * @param {Array} options.queryWhitelist list of query string
   * whitelist evidence to keep
   * @param {Array} options.headerBlacklist list of header evidence to exclude
   * @param {number} options.sharePercentage percentage of requests to share
   */
  constructor (
    {
      interval = 100,
      requestedPackageSize = 10,
      cookie,
      queryWhitelist,
      headerBlacklist,
      sharePercentage = 100
    } = {}) {
    super(...arguments);

    this.trackingCookie = cookie;

    this.evidenceKeyFilter = new ShareUsageEvidenceKeyFilter(
      {
        cookie: cookie,
        queryWhitelist: queryWhitelist,
        headerBlacklist: headerBlacklist
      });

    this.dataKey = 'shareUsage';

    this.tracker = new ShareUsageTracker({ interval: interval });

    this.requestedPackageSize = requestedPackageSize;

    this.sharePercentage = sharePercentage;

    this.sharePercentageCounter = 0;

    this.shareData = [];
  }

  /**
   * Internal process method which uses the ShareUsageTracker
   * to determine whether to add usage data to a batch and adds it if necessary.
   *
   * @param {FlowData} flowData flowData to process
   */
  processInternal (flowData) {
    this.sharePercentageCounter += 1;

    if (this.sharePercentageCounter === this.sharePercentage) {
      this.sharePercentageCounter = 0;
    }

    if (this.sharePercentageCounter !== 0) {
      return;
    }

    const cacheKey = this.evidenceKeyFilter
      .filterEvidence(flowData.evidence.getAll());

    const share = this.tracker.track(cacheKey);

    if (share) {
      this.tracker.put(cacheKey);

      this.addToShareUsage(cacheKey);
    }
  }

  /**
   * Internal method which adds to the share usage bundle (generating XML)
   *
   * @param {object} key key value store of current
   * evidence in FlowData (filtered by the ShareUsageEvidenceKeyFilter)
   */
  addToShareUsage (key) {
    let xml = '';

    xml += '<device>';

    xml += '<Version>4</Version>';

    xml += '<Language>Node.JS</Language>';

    xml += '<LanguageVersion>' + process.version + '</LanguageVersion>';

    xml += '<Platform>' + process.platform + ' ' + os.release() + '</Platform>';

    for (const item in key) {
      const parts = item.split('.');

      const prefix = parts[0];
      const name = parts[1];
      const value = key[item];

      xml += `<${prefix} name="${name}">${value}</${prefix}>`;
    }

    const date = new Date()
      .toISOString()
      .substr(0, 19)
      .replace('T', ' ')
      .split(' ')
      .join(':');

    xml += '<dateSent>' + date + '</dateSent>';

    xml += '</device>';

    this.shareData.push(xml);

    if (this.shareData.length === this.requestedPackageSize) {
      this.sendShareUsage();
    }
  }

  /**
   * Internal method to send the share usage bundle to the 51Degrees servers
   */
  sendShareUsage () {
    const data = '<devices>' + this.shareData.join() + '</devices>';

    const options = {
      hostname: 'devices-v4.51degrees.com',
      path: '/new.ashx',
      method: 'POST',
      headers: { 'Content-Encoding': 'gzip', 'Content-Type': 'text/xml' }
    };

    zlib.gzip(data, function (err, buffer) {
      if (err) {
        this.pipeline.emit('warning', err);
      }

      var req = https.request(options, function (res) {
        // Reset sharedata collection

        this.shareData = [];
      });
      req.on('error', function (e) {
        this.pipeline.emit('warning', e);
      });

      req.write(buffer);
      req.end();
    });
  }
}

module.exports = ShareUsage;
