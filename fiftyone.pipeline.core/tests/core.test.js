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
such notice(s) shall fulfill the requirements of that article.
 * ********************************************************************* */

const setup = require(__dirname + '/coreTestSetup.js');
const PipelineBuilder = require('../pipelineBuilder');

const syncPipeline = new PipelineBuilder()
  .add(setup.async)
  .add(setup.sync)
  .build();

const syncFlowData = syncPipeline.createFlowData();

setup.sync.properties = {
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
  setup.sync.updateProperties().then(function () {
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
    expect(syncFlowData.getFromElement(setup.sync).get('integer')).toBe(5);

    done();
  });
});

test('for of', done => {
  syncFlowData.process().then(function () {
    const keys = [];
    for (const key of syncFlowData.sync) {
      keys.push(key);
    }
    expect(JSON.stringify(keys)).toBe(JSON.stringify(['integer', 'boolean']));
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

const asyncPipeline = new PipelineBuilder()
  .addParallel([setup.sync, setup.async]).build();
const asyncFlowData = asyncPipeline.createFlowData();

test('engines run in parallel', done => {
  asyncFlowData.process().then(function () {
    expect(asyncFlowData.get('sync').get('boolean')).toBe(false);

    done();
  });
});

const configPipeline = new PipelineBuilder()
  .buildFromConfigurationFile(__dirname + '/config.json');

const configPipelineFlowData = configPipeline.createFlowData();

test('build from config', done => {
  configPipelineFlowData.process().then(function () {
    expect(configPipelineFlowData.get('configTest')
      .get('built')).toBe('hello_world');

    done();
  });
});

test('aspectPropertyValue', done => {
  const apvPipeline = new PipelineBuilder().add(setup.apvTest).build();

  const flowData = apvPipeline.createFlowData();

  flowData.process().then(function () {
    expect(flowData.apv.get('yes').hasValue).toBe(true);
    expect(flowData.apv.get('yes').value).toBe('success');

    expect(flowData.apv.get('no').hasValue).toBe(false);
    expect(expect(flowData.apv.no.noValueMessage).toBe('Value missing'));

    let error = '';

    try {
      console.log(flowData.apv.no.value);
    } catch (e) {
      error = e;
    }

    expect(expect(error).toBe('Value missing'));

    done();
  });
});
