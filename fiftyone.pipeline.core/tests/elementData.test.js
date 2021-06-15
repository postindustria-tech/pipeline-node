/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2019 51 Degrees Mobile Experts Limited, 5 Charlotte Close,
 * Caversham, Reading, Berkshire, United Kingdom RG4 7BY.
 *
 * This Original Work is licensed under the European Union Public Licence (EUPL)
 * v.1.2 and is subject to its terms as set out below.
 *
 * If a copy of the EUPL was not distributed with this file, You can obtain
 * one at https://opensource.org/licenses/EUPL-1.2.
 *
 * The 'Compatible Licences' set out in the Appendix to the EUPL (as may be
 * amended by the European Commission) shall be deemed incompatible for
 * the purposes of the Work and the provisions of the compatibility
 * clause in Article 5 of the EUPL shall not apply.
 *
 * If using the Work as, or as part of, a network application, by
 * including the attribution notice(s) required under Article 5 of the EUPL
 * in the end user terms of the application under an appropriate heading,
 * such notice(s) shall fulfill the requirements of that article.
 * ********************************************************************* */

const util = require('util');
const errorMessages = require(__dirname +
  '/../errorMessages');
const Engine = require(__dirname + '/../../fiftyone.pipeline.engines/engine');
const PipelineBuilder = require(
  __dirname + '/../pipelineBuilder'
);
const ElementDataDictionary = require(
  __dirname + '/../elementDataDictionary'
);
const BasicListEvidenceKeyFilter = require(
  __dirname + '/../basicListEvidenceKeyFilter'
);

const testEngine = new Engine(
  {
    dataKey: 'testEngine',
    restrictedProperties: ['one'],
    evidenceKeyFilter: new BasicListEvidenceKeyFilter(['header.user-agent']),
    properties: {
      one: {
        meta: {
          type: 'int'
        }
      },
    },
    processInternal: function (flowData) {
      const contents = { one: 1 };

      // Check if flowData has been processed before (for cache test)

      const data = new ElementDataDictionary(
        { flowElement: this, contents: contents }
      );

      flowData.setElementData(data);

      hasRun = true;
    }
  }
);

const flowData = new PipelineBuilder().add(testEngine).build().createFlowData();

// Check that when accessing an invalid key, an error is thrown and a correct
// error message is returned.
test('missing property', done => {
  flowData.process().then(function () {
    try {
      flowData.get('testEngine').get('three');
    } catch (e) {
      expect(e.indexOf(
        util.format(errorMessages.genericMissingProperties, 'three') +
        ' in data for element "testEngine".' +
        util.format(errorMessages.noReasonUnknown)) !== -1).toBe(true);
    }

    done();
  });
});
