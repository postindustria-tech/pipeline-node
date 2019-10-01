const evidenceKeyFilter = require("./evidenceKeyFilter");

class basicListEvidenceKeyFilter extends evidenceKeyFilter {

    /**
     * constructor for basicListEvidenceKeyFilter
     * @param {Array} list items to keep when filtering
    */
    constructor(list) {

        super();

        this.list = list;

    }

    /**
     * filterEvidence removes anything not in the list 
     * the filter was constructed with
    */
    filterEvidenceKey(key) {

        return this.list.includes(key);

    }

}

module.exports = basicListEvidenceKeyFilter;
