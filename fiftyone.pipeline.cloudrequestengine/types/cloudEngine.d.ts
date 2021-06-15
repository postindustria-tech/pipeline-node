export = CloudEngine;
declare const CloudEngine_base: typeof import("fiftyone.pipeline.engines/types/engine");
/**
 * This is a template for all 51Degrees cloud engines.
 * It requires the 51Degrees cloudRequestEngine to be placed in a
 *  pipeline before it. It takes that raw JSON response and
 * parses it to extract the device part.
 * It also uses this data to generate a list of properties and an evidence key filter
 **/
declare class CloudEngine extends CloudEngine_base {
    constructor(...args: any[]);
}
