export = Pipeline;
/**
 * @typedef {import('./flowElement')} FlowElement
 */
/**
 * Pipeline holding a list of flowElements for processing, can create
 * flowData that will be passed through these, collecting elementData
 * Should be constructed through the PipelineBuilder class
 */
declare class Pipeline {
    /**
     * Constructor for Pipeline
     *
     * @param {FlowElement[]} flowElements list of FlowElements to
     * add to the Pipeline
     */
    constructor(flowElements?: FlowElement[]);
    flowElementsChain: import("./flowElement")[];
    eventEmitter: EventEmitter;
    flowElements: {};
    propertyDatabase: {};
    processMethod: (flowData: any) => any;
    /**
     * get a FlowElement by its dataKey
     *
     * @param {string} key the datakey of the FlowElement
     * @returns {FlowElement} the FlowElement for the datakey
     */
    getElement(key: string): FlowElement;
    /**
     * Method to attach listeners to the logger
     * Shorthand access to the enclosed event emitter
     *
     * @param {string} listener type of message to listen to
     * @param {Function} callback a callback to react to the log
     */
    on(listener: string, callback: Function): void;
    /**
     * Shorthand to trigger a message on the pipeline's eventEmitter
     *
     * @param {string} type type of message
     * @param {mixed} message message to store in the log
     */
    log(type: string, message: any): void;
    /**
     * Create a FlowData element from the pipeline
     *
     * @returns {FlowData} a FlowData object for the Pipeline
     * containing methods for adding evidence and processing via
     * the FlowElements in the Pipleine.
     */
    createFlowData(): FlowData;
    /**
     *
     * @param {FlowElement} flowElement
     * @returns {void}
     */
    updatePropertyDataBaseForElement(flowElement: FlowElement): void;
}
declare namespace Pipeline {
    export { FlowElement };
}
import EventEmitter = require("events");
type FlowElement = import('./flowElement');
import FlowData = require("./flowData");
