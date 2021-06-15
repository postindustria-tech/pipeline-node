export = Helpers;
declare class Helpers {
    /**
     * Set response headers in the response object (e.g. Accept-CH)
     * @param response: The response to set the headers in.
     * @param flowData: A processed FlowData instance to get the response header values
     * from.
     */
    static setResponseHeaders(response: any, flowData: any): void;
}
