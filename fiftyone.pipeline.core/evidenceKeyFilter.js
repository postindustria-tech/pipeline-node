class evidenceKeyFilter {

    /**
     * Filter an evidence object
     * @param {Object} evidenceKeyObject
    */
    filterEvidence(evidenceKeyObject) {

        let filter = this;

        let filtered = {};

        Object.keys(evidenceKeyObject).forEach(function (evidenceKey) {

            if (filter.filterEvidenceKey(evidenceKey)) {

                filtered[evidenceKey] = evidenceKeyObject[evidenceKey];

            }

        });

        return filtered;

    }

    /**
     * Internal filterEvidenceKey function overriden by specific filters to keep or filter out a piece of evidence
     * @param {String} evidenceKey
     * @returns {Boolean}
    */
    filterEvidenceKey(key) {

        return true;

    }

}

module.exports = evidenceKeyFilter;
