export = AspectPropertyValue;
/**
 * An AspectPropertyValue is a wrapper for a value
 * It lets you check this wrapper has a value inside it
 * If not value is set, a specific no value message is returned
 */
declare class AspectPropertyValue {
    /**
     * Constructor for AspectPropertyValue
     *
     * @param {string} noValueMessage The message to show when no value is set
     * @param {Mixed} value The value inside the wrapper
     */
    constructor(noValueMessage: string, value: any);
    noValueMessage: string;
    _value: any;
    hasValue: boolean;
    /**
     * Set the value of this instance.
     *
     * @param {Mixed} value the value to set
     */
    set value(arg: any);
    /**
     * Get the value of this instance.
     *
     * @returns {Mixed} The value of the property
     * @throws Will throw error if 'hasValue' is false.
     */
    get value(): any;
}
