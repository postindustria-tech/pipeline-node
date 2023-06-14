/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2022 51 Degrees Mobile Experts Limited, Davidson House,
 * Forbury Square, Reading, Berkshire, United Kingdom RG1 3EU.
 *
 * This Original Work is licensed under the European Union Public Licence
 * (EUPL) v.1.2 and is subject to its terms as set out below.
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
const http = require('http');
const RequestClient = require('../requestClient');
const { default: each } = require('jest-each');

// CloudEngine does not use relative path to import module so update the module
// lookups path here via setting of NODE_PATH environment variable.
process.env.NODE_PATH = __dirname + '/../..' + path.delimiter + process.env.NODE_PATH;
require('module').Module._initPaths();

const noCheck = function () {};

let server;

afterEach(() => {
  if (server) {
    server.close();
    server = undefined;
  }
});

getTest = function (origin, writeResponse, checkRequest, checkResponse, done) {
  const client = new RequestClient();
  const requestListener = function (req, res) {
    checkRequest(req);
    writeResponse(res);
  };

  server = http.createServer(requestListener);
  server.listen(3000, () => {
    const response = client.get('http://localhost:3000', origin);
    checkResponse(response)
      .finally(() => {
        done();
      });
  });
};

postTest = function (data, origin, writeResponse, checkRequest, checkResponse, done) {
  const client = new RequestClient();
  const requestListener = function (req, res) {
    checkRequest(req);
    writeResponse(res);
  };

  server = http.createServer(requestListener);
  server.listen(3000, () => {
    const response = client.post('http://localhost:3000', data, origin);
    checkResponse(response)
      .finally(() => {
        done();
      });
  });
};

test('get - success', done => {
  const expectedResponse = 'here is the expected response.';
  getTest(
    undefined,
    res => {
      res.writeHead(200);
      res.end(expectedResponse);
    },
    noCheck,
    res => {
      return expect(res).resolves.toBe(expectedResponse);
    },
    done);
});

test('get - origin', done => {
  const origin = 'some origin';
  const expectedResponse = 'here is the expected response.';
  getTest(
    origin,
    res => {
      res.writeHead(200);
      res.end(expectedResponse);
    },
    req => {
      expect(req.headers.origin).toBe(origin);
    },
    res => {
      return expect(res).resolves.toBe(expectedResponse);
    },
    done);
});

each([[400], [404], [429], [500]])
  .test('get - failure %d', (status, done) => {
    const expectedResponse = 'here is the expected response.';
    getTest(
      undefined,
      res => {
        res.writeHead(status);
        res.end(expectedResponse);
      },
      noCheck,
      res => {
        return expect(res).rejects.toMatchObject({ content: expectedResponse, statusCode: status });
      },
      done);
  });

test('post - success', done => {
  const expectedResponse = 'here is the expected response.';
  postTest(
    {},
    undefined,
    res => {
      res.writeHead(200);
      res.end(expectedResponse);
    },
    noCheck,
    res => {
      return expect(res).resolves.toBe(expectedResponse);
    },
    done);
});

each([[400], [404], [429], [500]])
  .test('post - failure %d', (status, done) => {
    const expectedResponse = 'here is the expected response.';
    postTest(
      {},
      undefined,
      res => {
        res.writeHead(status);
        res.end(expectedResponse);
      },
      noCheck,
      res => {
        return expect(res).rejects.toMatchObject({ content: expectedResponse, statusCode: status });
      },
      done);
  });

test('post - origin', done => {
  const origin = 'some origin';
  const expectedResponse = 'here is the expected response.';
  postTest(
    {},
    origin,
    res => {
      res.writeHead(200);
      res.end(expectedResponse);
    },
    req => {
      expect(req.headers.origin).toBe(origin);
    },
    res => {
      return expect(res).resolves.toBe(expectedResponse);
    },
    done);
});

test('post - data', done => {
  const expectedResponse = 'here is the expected response.';
  const data = { one: 'some evidence', two: 'some more evidence' };
  const encodedData = 'one=some%20evidence&two=some%20more%20evidence';
  postTest(
    data,
    undefined,
    res => {
      res.writeHead(200);
      res.end(expectedResponse);
    },
    req => {
      let recieved = '';
      req.on('data', chunk => {
        recieved += chunk;
      });
      req.on('end', () => {
        expect(req.headers['content-type']).toBe('application/x-www-form-urlencoded');
        expect(req.headers['content-length']).toBe(encodedData.length.toString());
        expect(recieved).toBe(encodedData);
      });
    },
    res => {
      return expect(res).resolves.toBe(expectedResponse);
    },
    done);
});
