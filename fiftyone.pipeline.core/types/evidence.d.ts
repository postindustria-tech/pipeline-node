export = Evidence;
/**
 * @typedef {import('./flowData')} FlowData
 */
/**
 * Storage of evidence on a flowData object
 */
declare class Evidence {
    /**
     * Constructor for evidence
     *
     * @param {FlowData} flowData FlowData to add the evidence to
     */
    constructor(flowData: FlowData);
    flowData: import("./flowData");
    evidenceStore: {};
    /**
     * Add a piece of evidence to flowData
     *
     * @param {string} key evidence key to add
     * @param {Mixed} value value of evidence key
     */
    add(key: string, value: any): void;
    /**
     * Add a piece of evidence to flowData as an object
     *
     * @param {object} evidenceObject key value map of evidence
     * @param {string} evidenceObject.key evidencekey
     * @param {Mixed} evidenceObject.value evidence value
     */
    addObject(evidenceObject: {
        key: string;
        value: any;
    }): void;
    /**
     * Add evidence to flowData from an HTTP request
     * This helper automatically adds evidence:
     * headers, cookies, protocol, IP and query params
     *
     * @param {object} request an HTTP request object
     * @returns {undefined}
     */
    addFromRequest(request: object): undefined;
    /**
     * Get a piece of evidence
     *
     * @param {string} key evidence key to retreive
     * @returns {mixed} the evidence value
     */
    get(key: string): any;
    /**
     * Get all evidence
     *
     * @returns {object} all evidence
     */
    getAll(): object;
}
declare namespace Evidence {
    export { FlowData };
}
type FlowData = import('./flowData');
