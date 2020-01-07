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

/*
@example pipelines.js

This example demonstrates syncronous and asyncronous pipelines with multiple flowElements and other core features of the 51Degrees pipeline

*/

// First require the core Pipeline (change this to `fiftyone.pipeline.core` 
// to use the modules from NPM rather than your local code)
let pipelineCore = require("../");

let pipelineBuilder = pipelineCore.pipelineBuilder;

// Load in some example flowElements

// A flowElement that runs asyncronously with a sitetimeout task

let async = new (require("./flowElementsForExamples/async"));

// A flowElement that runs syncronously which loads a different result if the async one has already finished processing

let sync = new (require("./flowElementsForExamples/sync"));

// A flowElement that stops processing

let stop = new (require("./flowElementsForExamples/stop"));

// A dummy flowElement to show that subsequent flowElements don't process once the flowData has been stopped
let neverRun = new (require("./flowElementsForExamples/neverRun"));

// Build a pipeline that runs all its elements in series

let syncPipeline = new pipelineBuilder().add(async).add(sync).add(stop).add(neverRun).build();

// Create flowData
let syncFlowData = syncPipeline.createFlowData();

// Various ways of setting evidence

syncFlowData.evidence.add("header.user_agent", "test");
syncFlowData.evidence.add("header.other", "no");
syncFlowData.evidence.addObject({ "test": "testing" });

// Get all, or some evidence
syncFlowData.evidence.get("test");
syncFlowData.evidence.getAll();

// Process the flowData (this returns a promise)
syncFlowData.process().then(function () {

    syncFlowData.sync.integer;
    syncFlowData.getFromElement(sync).integer;
    syncFlowData.getWhere("type", "int");
    syncFlowData.getWhere("type", (type) => type === "int");

});

syncPipeline.on("error", console.error);

// This is a pipeline that runs the flowElements in parallel (the sync element will not wait for the async one to finish)

let asyncPipeline = new pipelineBuilder().addParallel([async, sync]).build();
