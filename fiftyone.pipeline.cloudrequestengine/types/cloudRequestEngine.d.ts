export = CloudRequestEngine;
declare const CloudRequestEngine_base: typeof import("fiftyone.pipeline.engines/types/engine");
/**
 * @typedef {import('fiftyone.pipeline.core').FlowData} FlowData
 */
declare class CloudRequestEngine extends CloudRequestEngine_base {
    /**
     * Constructor for CloudRequestEngine
     *
     * @param {object} options options object
     * @param {string} options.resourceKey resourcekey for cloud service
     * @param {string} options.licenseKey licensekey for cloud service
     * @param {string} options.baseURL url the cloud service is located at
     * if overriding default
     */
    constructor({ resourceKey, licenseKey, baseURL }: {
        resourceKey: string;
        licenseKey: string;
        baseURL: string;
    }, ...args: any[]);
    resourceKey: string;
    licenseKey: string;
    baseURL: string;
    evidenceKeys: any[];
    flowElementProperties: {};
    /**
     * Internal process to fetch all the properties available under a resourcekey
     *
     * @returns {Promise} properties from the cloud server
     */
    fetchProperties(): Promise<any>;
    /**
     * Internal function to get data from cloud service
     *
     * @param {FlowData} flowData
     * FlowData used to extract evidence and send to cloud service
     * for processing
     * @returns {Promise} result of processing
     */
    getData(flowData: FlowData): Promise<any>;
    /**
     * Internal function to get evidenceKeys used by cloud resourcekey
     *
     * @returns {Array} evidence key list
     */
    getEvidenceKeys(): any[];
}
declare namespace CloudRequestEngine {
    export { FlowData };
}
type FlowData = import("fiftyone.pipeline.core/types/flowData");
