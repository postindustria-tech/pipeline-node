export = JSONBundlerElement;
/**
 * The JSONBundler aggregates all properties from FlowElements
 * into a JSON object
 * It is used for retrieving via an endpoint from the client
 * side via the JavaScriptBuilder and also used inside the
 * JavaScriptBuilder itself to pass properties to the client side.
 * Both this and the JavaScriptBuilder element are automatically
 * added to a pipeline unless specifically ommited in the PipelineBuilder
 */
declare class JSONBundlerElement extends FlowElement {
    constructor(...args: any[]);
    propertyCache: {};
}
import FlowElement = require("./flowElement.js");
