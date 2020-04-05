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

const url = require("url");

(function () {

    const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
    const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
    const concat = Function.bind.call(Function.call, Array.prototype.concat);
    const keys = Reflect.ownKeys;

    if (!Object.values) {
        Object.values = function values(O) {
            return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
        };
    }

    if (!Object.entries) {
        Object.entries = function entries(O) {
            return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
        };
    }

}());

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

        let keep;

        for (let flowElement in this.flowData.pipeline.flowElements){

            flowElement = this.flowData.pipeline.flowElements[flowElement];

            if(flowElement.evidenceKeyFilter.filterEvidenceKey(key)){

                keep = true;

            }

        }

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

                evidence.add(requestHeaderKey, requestHeaderValue);

            } else {

                value.split(';').forEach((cookie) => {
                    let parts = cookie.split('=');

                    requestHeaderKey = "cookie" + "." + parts.shift().trim();

                    requestHeaderValue = decodeURI(parts.join('='));

                    evidence.add(requestHeaderKey, requestHeaderValue);

                });

            }

        });

        // Add protocol

        evidence.add("header.protocol", request.connection.encrypted ? 'https' : 'http');

        // Use referer header to set protocol if set

        if(request.headers.referer){

            evidence.add("header.protocol", url.parse(request.headers.referer).protocol.replace(":", ""));

        }

        // Add IP address

        evidence.add("server.client-ip", request.connection.remoteAddress.toString());

        evidence.add("server.host-ip", request.connection.localAddress.toString());

        // Get querystring data

        let params = url.parse(request.url, true);

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
