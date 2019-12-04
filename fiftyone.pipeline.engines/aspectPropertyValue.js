class aspectPropertyValue {

    constructor(noValueMessage="No value has been set.") {
        this.noValueMessage = noValueMessage;
        this.value = undefined;
    }

    /**
     * Get the value of this instance.
     * @returns {Mixed} 
     * @throws Will throw error if 'hasValue' is false.
    */
    get value() {
        if(this.hasValue){
            return this._value;
        }else{
            throw this.noValueMessage;
        }
    }

    /**
     * Set the value of this instance.
     * @param {Mixed} value 
    */
    set value(value) {
        if(typeof value !== 'undefined' && value !== null){
            this._value = value;
            this.hasValue = true;
        } else {
            this._value = undefined;
            this.hasValue = false;
        }
    }
}

module.exports = aspectPropertyValue;