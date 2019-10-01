let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const engines = require51("fiftyone.pipeline.engines");
const engine = engines.engine;
const aspectDataDictionary = engines.aspectDataDictionary;

class deviceDetectionGeolocation extends engine {

    // engineKey = location or location_osm
    constructor({ engineKey }) {

        super(...arguments);

        this.dataKey = engineKey;

    }

    processInternal(flowData) {

        let engine = this;

        this.checkProperties(flowData).then(function (params) {

            let cloudData = flowData.get("cloud").get("cloud");

            cloudData = JSON.parse(cloudData);

            let engineData = cloudData[engine.dataKey];

            let response = {
                WebRequestResponse: engineData
            }

            let data = new aspectDataDictionary(
                {
                    flowElement: engine,
                    contents: response
                });

            flowData.setElementData(data);

        });

    }

    checkProperties(flowData) {

        let engine = this;

        return new Promise(function (resolve, reject) {

            // Check if properties set, if not set them

            if (!Object.keys(engine.properties).length) {

                let cloudProperties = flowData.get("cloud").get("properties");

                let deviceProperties = cloudProperties[engine.dataKey]

                engine.properties = deviceProperties;

                engine.updateProperties().then(resolve);

            } else {

                resolve();

            }

        });

    }

}

module.exports = deviceDetectionGeolocation;
