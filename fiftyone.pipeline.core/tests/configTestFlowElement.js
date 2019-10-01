let flowElement = require("../flowElement");
let elementDataDictionary = require("../elementDataDictionary");

class configTestFlowElement extends flowElement {

    constructor({ prefix }) {

        super(...arguments);

        this.prefix = prefix;
        this.dataKey = "configTest"

    }

    processInternal(flowData) {

        let data = new elementDataDictionary({ flowElement: this, contents: { "built": this.prefix + "_world" } });

        flowData.setElementData(data);

    }

}

module.exports = configTestFlowElement;
