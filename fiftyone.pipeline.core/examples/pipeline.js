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


// Evidence can also be added from an HTTP request
const http = require('http');
const port = 3000;
const server = http.createServer((req, res) => {

    let flowData = parallelPipeline.createFlowData();
    flowData.evidence.addFromRequest(req);
    flowData.process();

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><body>');
    res.write('<p>Evidence taken from request:</p>')
    var evidence = flowData.evidence.getAll();  
    Object.keys(evidence).forEach(function(key) {
        var val = evidence[key];
        res.write('<p>');
        res.write(key + ' = ' + val);
        res.write('</p>');
    });
    res.write('</body></html>');
    res.end();
});

server.listen(port);

