// Creating a pipeline
let pipelineBuilder = require("../pipelineBuilder");
let flowElement = require("../flowElement");
let basicListEvidenceKeyFilter = require("../basicListEvidenceKeyFilter");

let flowElementExample = new flowElement({ dataKey: "one" });
let flowElementExample2 = new flowElement({ dataKey: "two", evidenceKeyFilter: new basicListEvidenceKeyFilter("header.user-agent") });

// This pipeline will run synchronously 
let linearPipeline = new pipelineBuilder().add(flowElementExample).add(flowElementExample2).build();

// This pipeline will run asynchronously
let parallelPipeline = new pipelineBuilder().addParallel([flowElementExample, flowElementExample2]).build();

// A built pipeline can create flowData
let flowData = parallelPipeline.createFlowData();

// Evidence can be added to a flowData object
flowData.evidence.add("header.User-Agent", "example");
flowData.evidence.addObject({ "cookie.my-cookie": "example" });

// Evidence can also be added from an HTTP request
const http = require('http');
const port = 3000;
const server = http.createServer((req, res) => {

    let flowData = pipeline.createFlowData();
    flowData.evidence.addFromRequest(req);

});

server.listen(port);

