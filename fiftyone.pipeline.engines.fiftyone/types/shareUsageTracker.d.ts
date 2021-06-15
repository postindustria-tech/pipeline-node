export = ShareUsageTracker;
declare const ShareUsageTracker_base: typeof import("fiftyone.pipeline.engines/types/tracker");
/**
 * The ShareUsageTracker is used by the ShareUsageElement to determine
 * whether to put evidence into a bundle to be sent to the 51Degrees
 * Share Usage service.
 **/
declare class ShareUsageTracker extends ShareUsageTracker_base {
    /**
     * Constructor for ShareUsageTracker
     *
     * @param {object} options options for share usage tracker
     * @param {number} options.size size of the share usage lru cache
     * @param {number} options.interval how often to put evidence into the cache
     **/
    constructor({ size, interval }?: {
        size: number;
        interval: number;
    }, ...args: any[]);
    cache: import("fiftyone.pipeline.engines/types/lru");
    interval: number;
}
