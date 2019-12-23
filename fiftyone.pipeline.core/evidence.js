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

const url = require("url");

class evidence {

    /**
     * Storage of evidence on a flowData object
     * @param {flowData} flowData 
    */
    constructor(flowData) {

        this.flowData = flowData;
        this.evidenceStore = {};

    }

    /**
     * Add a piece of evidence to flowData
     * @param {String} key 
     * @param {Mixed} value 
    */
    add(key, value) {

        // Filter out any evidence that isn't needed in the pipeline

        let keep = Object.values(this.flowData.pipeline.flowElements).reduce(function (curr, flowElement) {

            return flowElement.evidenceKeyFilter.filterEvidenceKey(key);

        }, true);

        if (keep) {

            this.flowData.pipeline.log("debug", key + " added to evidence");

            this.evidenceStore[key] = value;

        } else {

            this.flowData.pipeline.log("debug", key + " filtered out of evidence. Not added.");

        }

    }

    /**
     * Add a piece of evidence to flowData as an object
     * @param {Object} evidenceObject 
     * @param {String} evidenceObject.key 
     * @param {Mixed} evidenceObject.value 
    */
    addObject(evidenceObject) {

        let evidenceContainer = this;

        Object.entries(evidenceObject).forEach(function ([key, value]) {

            evidenceContainer.add(key, value);

        });

    }

    /**
     * Add a piece of evidence to flowData from an HTTP request
     * @param {Object} request 
    */
    addFromRequest(request) {

        // Process headers

        let evidence = this;

        Object.entries(request.headers).forEach(([key, value]) => {

            let requestHeaderKey;
            let requestHeaderValue;

            if (key !== "cookie") {

                requestHeaderKey = "header" + "." + key;

                requestHeaderValue = value;

            } else {

                value.split(';').forEach((cookie) => {
                    let parts = cookie.split('=');

                    requestHeaderKey = "cookie" + "." + parts.shift().trim();

                    requestHeaderValue = decodeURI(parts.join('='));

                });

            }

            evidence.add(requestHeaderKey, requestHeaderValue);

        });

        // Add IP address

        evidence.add("server.client-ip", request.connection.remoteAddress.toString());

        evidence.add("server.host-ip", request.connection.localAddress.toString());

        // Get querystring data

        let params = require('url').parse(request.url, true);

        let query = params.query;

        Object.entries(query).forEach(function ([key, value]) {

            evidence.add("query." + key, value);

        });

        return this;

    }

    /**
     * Get a piece of evidence
     * @param {String} key 
     * @returns {Mixed} 
    */
    get(key) {

        return this.evidenceStore[key];

    }

    /**
     * Get all evidence 
     * @returns {Object} all evidence
    */
    getAll() {

        return this.evidenceStore;

    }

}

module.exports = evidence;
