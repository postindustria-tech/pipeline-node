export = SequenceElement;
/**
 * The SequenceElement stores session data regarding requests
 * for client side JavaScript from the JavaScript created by a
 * Pipeline's JavaScriptBuilder
 * If a Pipeline is constructed with the JavaScript elements enabled
 * this is added automatically along with the JavaScriptBuilder and JSONBundler.
 **/
declare class SequenceElement extends FlowElement {
    constructor(...args: any[]);
}
import FlowElement = require("./flowElement.js");
