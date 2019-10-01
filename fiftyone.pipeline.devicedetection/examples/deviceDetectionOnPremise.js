// Checks if the package required is available locally and if unsuccessful 
// return as a module reference.
let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const deviceDetection = require("../deviceDetectionOnPremise");
const pipelineBuilder = require51("fiftyone.pipeline.core").pipelineBuilder;
const fs = require("fs");

// Create a new Device Detection engine and set the config.
// Not supplying a dataFile will default the implementation to use our Cloud service. 
let engine = new deviceDetection({
    // Performance profiles and additional options will be available in a later release.
    /* userAgentCacheCapacity: 100, 
    performanceProfile: "HighPerformance",*/
    dataFile: "../datafile/51Degrees-LiteV3.2.dat",
    licenceKeys: "YOUR_LICENSE_KEY"
})

// Create a new instance of the pipeline and add the Device Detection engine.
let pipeline = new pipelineBuilder().add(engine).build();

pipeline.on("error", console.error);

// Read from a list of 20000 User Agents.
let userAgents = fs.readFileSync("20000_User_Agents.csv", "utf8");

userAgents = userAgents.split("\n");

let test = function (userAgent) {

    return new Promise(function (resolve) {

        // Create the flow data element
        let flowData = pipeline.createFlowData();

        flowData.process().then(function (flowData) {
            // Add User-Agent header evidence for processing
            flowData.evidence.add("header.user-agent", userAgent);
            // Retrieve IsMobile device information from the pipeline
            resolve(flowData.get("device").get("ismobile"));
        });
    });
}

let tests = [];

userAgents.forEach(function (userAgent) {

    tests.push(test(userAgent));

});

// return the time it took to match all User-Agents
console.time("performance");

Promise.all(tests).then(function (params) {

    console.timeEnd("performance");

})
