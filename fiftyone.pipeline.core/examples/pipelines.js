/* ********************************************************************
 * Copyright (C) 2019  51Degrees Mobile Experts Limited.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ******************************************************************** */

/*
@example pipelines.js

This example demonstrates syncronous and asyncronous pipelines with multiple flowElements and other core features of the 51Degrees pipeline

*/

let pipelineCore = require("../");

let pipelineBuilder = pipelineCore.pipelineBuilder;

// Load in some example flowElements

// A flowElement that runs asyncronously with a sitetimeout task

let async = new require("./flowElementsForExamples/async");

// A flowElement that runs syncronously which loads a different result if the async one has already finished processing

let sync = new require("./flowElementsForExamples/sync");

// A flowElement that stops processing

let stop = new require("./flowElementsForExamples/stop");

// A dummy flowElement to show that subsequent flowElements don't process once the flowData has been stopped
let neverRun = new require("./flowElementsForExamples/neverRun");

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
