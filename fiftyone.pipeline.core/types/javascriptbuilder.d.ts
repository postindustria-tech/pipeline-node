export = JavaScriptBuilderElement;
/**
 * The JavaScriptBuilder aggregates JavaScript properties
 * from FlowElements in the pipeline. This JavaScript also
 * (when needed) generates a fetch request to retrieve additional properties
 * populated with data from the client side
 * It depends on the JSON Bundler element
 * (both are automatically added to a pipeline unless
 * specifically removed) for its list of properties.
 * The results of the JSON Bundler should also be used in a
 * user-specified endpoint which retrieves the JSON from the
 * client side. The JavaScriptBuilder is constructed with a
 * url for this endpoint.
 */
declare class JavaScriptBuilderElement extends FlowElement {
    /**
     * Constructor for JavaScriptBuilder.
     *
     * @param {object} options options object
     * @param {string} options.objName the name of the client
     * side object with the JavaScript properties in it
     * @param {string} options.protocol The protocol ("http" or "https")
     * used by the client side callback url.
     * This can be overriden with header.protocol evidence
     * @param {string} options.host The host of the client side
     * callback url. This can be overriden with header.host evidence.
     * @param {string} options.endPoint The endpoint of the client side
     * callback url
     * @param {boolean} options.enableCookies whether cookies should be enabled
     * @param {boolean} options.minify Whether to minify the JavaScript
     */
    constructor({ objName, protocol, host, endPoint, enableCookies, minify }?: {
        objName: string;
        protocol: string;
        host: string;
        endPoint: string;
        enableCookies: boolean;
        minify: boolean;
    }, ...args: any[]);
    settings: {
        objName: string;
        protocol: string;
        host: string;
        endPoint: string;
        enableCookies: boolean;
        minify: boolean;
    };
}
import FlowElement = require("./flowElement.js");
