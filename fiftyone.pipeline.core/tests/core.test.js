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

const FlowElement = require('../flowElement');
const PipelineBuilder = require('../pipelineBuilder');
const ElementDataDictionary = require('../elementDataDictionary');
const BasicListEvidenceKeyFilter = require('../basicListEvidenceKeyFilter');

const sync = new FlowElement({
  dataKey: 'sync',
  evidenceKeyFilter: new BasicListEvidenceKeyFilter(['header.user_agent']),
  processInternal: function (flowData) {
    const contents = { integer: 5 };

    try {
      contents.boolean = flowData.get('async').get('string') === 'hello';
    } catch (e) {
      contents.boolean = false;
    }

    const data = new ElementDataDictionary({ flowElement: this, contents: contents });

    flowData.setElementData(data);
  },
  properties: {
    integer: {
      type: 'int'
    },
    boolean: {
      type: 'bool'
    }
  }
});

const async = new FlowElement({
  dataKey: 'async',
  processInternal: function (flowData) {
    const flowElement = this;

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        const contents = { string: 'hello' };

        const data = new ElementDataDictionary({ flowElement: flowElement, contents: contents });

        flowData.setElementData(data);

        resolve();
      }, 500);
    });
  },
  properties: {
    string: {
      type: 'string'
    }
  }
});

const error = new FlowElement({
  dataKey: 'error',
  processInternal: function (flowData) {
    throw 'Something went wrong';
  }
});

const stop = new FlowElement({
  dataKey: 'stopElement',
  processInternal: function (flowData) {
    flowData.stop();
  }
});

const neverRun = new FlowElement({
  dataKey: 'neverRun',
  processInternal: function (flowData) {
    const data = new ElementDataDictionary({ flowElement: this, contents: { no: false } });

    flowData.setElementData(data);
  }
});

const syncPipeline = new PipelineBuilder().add(async).add(sync).add(error).add(stop).add(neverRun).build();

const syncFlowData = syncPipeline.createFlowData();

syncFlowData.evidence.add('header.user_agent', 'test');
syncFlowData.evidence.add('header.other', 'no');
syncFlowData.evidence.addObject({ test: 'testing' });

test('evidence add', () => {
  expect(syncFlowData.evidence.get('header.user_agent')).toBe('test');
});

test('evidence addObject', () => {
  expect(syncFlowData.evidence.get('test')).toBe('testing');
});

test('evidenceKeyFilter', () => {
  const allEvidence = syncFlowData.evidence.getAll();

  expect(Object.keys(sync.evidenceKeyFilter.filterEvidence(allEvidence))[0]).toBe('header.user_agent');
});

sync.properties = {
  integer: {
    type: 'int',
    extra: 'test'
  },
  boolean: {
    type: 'bool'
  }
};

const newPropertyFlowData = syncPipeline.createFlowData();

test('Update property list on flowElement', done => {
  sync.updateProperties().then(function () {
    newPropertyFlowData.process().then(function (flowData) {
      expect(flowData.getWhere('extra', 'test').integer).toBe(5);

      done();
    });
  });
});

test('get', done => {
  syncFlowData.process().then(function () {
    expect(syncFlowData.get('sync').get('integer')).toBe(5);

    done();
  });
});

test('get from flowElement property', done => {
  syncFlowData.process().then(function () {
    expect(syncFlowData.sync.get('integer')).toBe(5);

    done();
  });
});

test('get from flowElement property as property', done => {
  syncFlowData.process().then(function () {
    expect(syncFlowData.sync.integer).toBe(5);

    done();
  });
});

test('getFromElement', done => {
  syncFlowData.process().then(function () {
    expect(syncFlowData.getFromElement(sync).get('integer')).toBe(5);

    done();
  });
});

test('getWhere', done => {
  syncFlowData.process().then(function () {
    expect(syncFlowData.getWhere('type', 'int').integer).toBe(5);

    done();
  });
});

test('getWhere function version', done => {
  syncFlowData.process().then(function () {
    expect(syncFlowData.getWhere('type', function (value) {
      return value === 'int';
    }).integer).toBe(5);

    done();
  });
});

test('engines run in series', done => {
  syncFlowData.process().then(function () {
    expect(syncFlowData.get('sync').get('boolean')).toBe(true);

    done();
  });
});

test('error data is populated', done => {
  syncFlowData.process().then(function () {
    expect(syncFlowData.errors.error[0]).toBe('Something went wrong');

    done();
  });
});

let log;

syncPipeline.on('error', function (error) {
  log = error.message;
});

test('logging', done => {
  syncFlowData.process().then(function () {
    expect(log).toBe('Something went wrong');

    done();
  });
});

test('stop flag works', done => {
  syncFlowData.process().then(function () {
    expect(typeof syncFlowData.get('neverRun')).toBe('undefined');

    done();
  });
});

const asyncPipeline = new PipelineBuilder().addParallel([sync, async]).build();
const asyncFlowData = asyncPipeline.createFlowData();

test('engines run in parallel', done => {
  asyncFlowData.process().then(function () {
    expect(asyncFlowData.get('sync').get('boolean')).toBe(false);

    done();
  });
});

const configPipeline = new PipelineBuilder().buildFromConfigurationFile(__dirname + '/config.json');

const configPipelineFlowData = configPipeline.createFlowData();

test('build from config', done => {
  configPipelineFlowData.process().then(function () {
    expect(configPipelineFlowData.get('configTest').get('built')).toBe('hello_world');

    done();
  });
});
