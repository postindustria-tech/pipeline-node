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

const path = require('path');
const CloudRequestEngine = require('../cloudRequestEngine');
const sharedValues = require('../sharedValues');

// Invalid resource key
const testResourceKey = 'AAAAAAAAA';

const testEnvVarEndPoint = 'https://testhost:testport/';

afterEach(() => {
  // Reset the FOD_CLOUD_API_URL environment variable 
  process.env.FOD_CLOUD_API_URL = '';
});

// Check that explicitly setting of the baseURL will take precedence over
// environment variable setting.
test('custom end point - config precedence', done => {
  process.env.FOD_CLOUD_API_URL = testEnvVarEndPoint;
  const testEndPoint = "testEndPoint/";
  let testCloudRequestEngine = new CloudRequestEngine({
    resourceKey: testResourceKey,
    baseURL: testEndPoint
  });

  expect(testCloudRequestEngine.baseURL).toBe(testEndPoint);

  done();
});

// Check that environment variable setting will take precedence over default
// setting
test('custom end point - environment precedence', done => {
  process.env.FOD_CLOUD_API_URL = testEnvVarEndPoint;
  let testCloudRequestEngine = new CloudRequestEngine({
    resourceKey: testResourceKey
  });

  expect(testCloudRequestEngine.baseURL).toBe(testEnvVarEndPoint);

  done();
});

// Check that default setting is used if nothing else is set
test('custom end point - default value', done => {
  let testCloudRequestEngine = new CloudRequestEngine({
    resourceKey: testResourceKey
  });

  expect(testCloudRequestEngine.baseURL).toBe(sharedValues.baseURLDefault);

  done();
});