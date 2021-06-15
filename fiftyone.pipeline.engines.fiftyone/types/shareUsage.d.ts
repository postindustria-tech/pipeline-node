export = ShareUsage;
declare const ShareUsage_base: typeof import("fiftyone.pipeline.engines/types/engine");
/**
 * @typedef {import('fiftyone.pipeline.core').FlowData} FlowData
 */
/**
 * The ShareUsage element sends usage data to 51Degrees in zipped batches
 */
declare class ShareUsage extends ShareUsage_base {
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
    constructor({ interval, requestedPackageSize, cookie, queryWhitelist, headerBlacklist, sharePercentage }?: {
        interval: number;
        requestedPackageSize: number;
        cookie: string;
        queryWhitelist: any[];
        headerBlacklist: any[];
        sharePercentage: number;
    }, ...args: any[]);
    trackingCookie: string;
    tracker: ShareUsageTracker;
    requestedPackageSize: number;
    sharePercentage: number;
    sharePercentageCounter: number;
    shareData: any[];
    /**
     * Internal method which adds to the share usage bundle (generating XML)
     *
     * @param {object} key key value store of current
     * evidence in FlowData (filtered by the ShareUsageEvidenceKeyFilter)
     */
    addToShareUsage(key: object): void;
    /**
     * Internal method to send the share usage bundle to the 51Degrees servers
     */
    sendShareUsage(): void;
}
declare namespace ShareUsage {
    export { FlowData };
}
import ShareUsageTracker = require("./shareUsageTracker");
type FlowData = import("fiftyone.pipeline.core/types/flowData");
