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
const MockRequestClient = require('./classes/mockRequestClient');
const CloudRequestEngine = require('../cloudRequestEngine');
const CloudRequestError = require('../cloudRequestError');

// CloudEngine does not use relative path to import module so update the module
// lookups path here via setting of NODE_PATH environment variable.
process.env.NODE_PATH = __dirname + '/../..' + path.delimiter + process.env.NODE_PATH;
require('module').Module._initPaths();

const PipelineBuilder = require(
    __dirname + '/../../fiftyone.pipeline.core/pipelineBuilder'
);

// Invalid resource key
var testResourceKey = 'AAAAAAAAAAAA';

/**
 * Test cloud request engine adds correct information to post request
 * and returns the response in the ElementData
 */
test("process", done => {

    const jsonResponse = { "device": { "value": 51 } };
    const client = new MockRequestClient({json: jsonResponse});
    const engine = new CloudRequestEngine({
        resourceKey: testResourceKey,
        requestClient: client
    });

    const pipeline = new PipelineBuilder()
        .add(engine)
        .build();

    var data = pipeline.createFlowData();

    data.process().then((processedData) => {
        var result = processedData.getFromElement(engine)["cloud"];

        expect(result).toBe(JSON.stringify(jsonResponse));
    
        var jsonObj = JSON.parse(result);
        expect(jsonObj["device"]["value"]).toBe(51);
        done();
    });
});

/**
 * Verify that the CloudRequestEngine can correctly parse a
 * response from the accessible properties endpoint that contains
 * meta-data for sub-properties.
 */
test("sub properties", () => {
    const properties = {
        'Products': {
            'device': {
                'DataTier': 'CloudV4TAC',
                'Properties': [
                    {
                        'Name': 'IsMobile',
                            'Type': 'Boolean',
                            'Category': 'Device'
                    },
                    {
                        'Name': 'IsTablet',
                            'Type': 'Boolean',
                            'Category': 'Device'
                    }
                ]
            },
            'devices': {
                'DataTier': 'CloudV4TAC',
                'Properties': [
                    {
                        'Name': 'Devices',
                        'Type': 'Array',
                        'Category': 'Unspecified',
                        'ItemProperties': [
                            {
                                'Name': 'IsMobile',
                                'Type': 'Boolean',
                                'Category': 'Device'
                            },
                            {
                                'Name': 'IsTablet',
                                'Type': 'Boolean',
                                'Category': 'Device'
                            }
                        ]
                    }
                ]
            }
        }
    };
    const client = new MockRequestClient({ properties: properties });
    const engine = new CloudRequestEngine({
        resourceKey: testResourceKey,
        requestClient: client
    });
    return engine.ready().then((engine => {
        expect(Object.entries(engine.flowElementProperties).length).toBe(2);
        var deviceProperties = engine.flowElementProperties["device"];
        expect(Object.entries(deviceProperties).length).toBe(2);
        propertiesContainName(deviceProperties, "IsMobile");
        propertiesContainName(deviceProperties, "IsTablet");
        var devicesProperties = engine.flowElementProperties["devices"];
        expect(devicesProperties).not.toBeUndefined();
        expect(devicesProperties).not.toBeNull();
        expect(Object.entries(devicesProperties).length).toBe(1);
        propertiesContainName(devicesProperties["devices"]["itemproperties"], "IsMobile");
        propertiesContainName(devicesProperties["devices"]["itemproperties"], "IsTablet");
    }))
    
});

/**
 * Test cloud request engine handles JSON errors from the cloud service 
 * as expected.
 * An exception should be thrown by the cloud request engine
 * containing the errors from the cloud service in the JSON object.
 */
test("validate error handling JSON errors", async () => {
    const errorMessage = "an error message returned by the cloud service"
    const client = new MockRequestClient({
        resourceKey: "resourceKey",
        error: '{ "status":"400", "errors": ["' + errorMessage + '"] }'
    });

    const e = () => {
        return new CloudRequestEngine({
            resourceKey: testResourceKey,
            requestClient: client
        }).ready();
    }    
    await expect(e()).rejects.toEqual([new CloudRequestError(errorMessage)]);
});

function propertiesContainName(properties, name) {
    expect(properties[name.toLowerCase()]).not.toBeUndefined();
    expect(properties[name.toLowerCase()]).not.toBeNull();
    expect(properties[name.toLowerCase()].name).toBe(name);
}
