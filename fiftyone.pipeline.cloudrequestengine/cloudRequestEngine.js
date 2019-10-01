let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const engine = require51("fiftyone.pipeline.engines").engine;
const querystring = require("querystring");
const cloudHelpers = require("./cloudHelpers");
const aspectDataDictionary = require51("fiftyone.pipeline.engines").aspectDataDictionary;

class cloudRequestEngine extends engine {

    /**
     * Constructor for engine that makes a call to the 51Degrees cloud service
     * Returns raw JSON as a "cloud" property in "cloud"
     * @param {Object} options
     * @param {String} options.resourceKey
     * @param {String} options.licenseKey
    */
    constructor({ resourceKey, licenseKey, baseURL = "https://ts.51degrees.com/api/v4/" }) {

        super(...arguments);

        this.dataKey = "cloud";

        if (!resourceKey) {

            throw "Cloud engine needs a resourceKey";

        }

        this.resourceKey = resourceKey;

        this.licenseKey = licenseKey;
        this.baseURL = baseURL;

    }

    /**
    * Interanal process for cloud engine
    * Returns raw JSON as a "cloud" property in "cloud"
    * @param {flowData} flowData
   */
    processInternal(flowData) {

        let engine = this;

        // Check if properties list exists, if not fetch it

        if (!Object.keys(this.properties).length) {

            return this.fetchProperties().then(function (properties) {

                engine.properties = properties;

                return engine.getData(flowData);

            })

        } else {

            return engine.getData(flowData);

        }


    }

    fetchProperties() {

        let engine = this;

        return new Promise(function (resolve, reject) {

            let url = engine.baseURL + "accessibleproperties/";

            // licensekey is optional
            if (engine.licenseKey) {

                url += "?license=" + engine.licenseKey;

            }

            cloudHelpers.makeHTTPRequest(url).then(function (properties) {

                let propertiesOutput = {};

                properties = JSON.parse(properties);

                let products = properties.Products;

                for (let product in products) {

                    propertiesOutput[product] = {};

                    products[product].Properties.forEach(function (productProperty) {

                        propertiesOutput[product][productProperty.Name.toLowerCase()] = productProperty;

                    })

                }

                resolve(propertiesOutput);

            }).catch(reject);


        });

    }

    getData(flowData) {

        let engine = this;

        let evidence = flowData.evidence.getAll();

        let evidenceRequest = {};

        Object.entries(evidence).forEach(function ([key, value]) {

            let keyWithoutPrefix = key.split(".")[1];

            evidenceRequest[keyWithoutPrefix] = value;

        });

        let url = this.baseURL + this.resourceKey + ".json?" + querystring.stringify(evidenceRequest);

        // licensekey is optional
        if (this.licenseKey) {

            url += "&license=" + this.licenseKey;

        }

        return new Promise(function (resolve, reject) {

            cloudHelpers.makeHTTPRequest(url).then(function (body) {

                let data = new aspectDataDictionary({ flowElement: engine, contents: { cloud: body, properties: engine.properties } });

                flowData.setElementData(data);

                resolve();

            }).catch(reject);

        });

    }

}

module.exports = cloudRequestEngine;
