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
@example onPremiseFlowElement.js

This example demonstrates the creation of a custom flow element which takes a birth date as evidence and uses it to check a lookup table for a starsign. This lookup table is stored in a JSON file which is registered using the datafile update service. In this case the file has a simple watcher which checks if the file has changed.

*/

// Require the filesystem module for datafile reading
const fs = require("fs");

// First require the core Pipeline
const FiftyOnePipelineCore = require("fiftyone.pipeline.core");

// Next require the engines extension that extends flowElements to support functionality such as auto updating datafiles, caches and missing property services 
const FiftyOnePipelineEngines = require("../");

// Astrology flowElement
class astrology extends FiftyOnePipelineEngines.engine {

    constructor({ datafile }) {

        super(...arguments);

        // Create a datafile including a filesystem watcher that checks if the datafile has changed. Test by changing the names of the starsigns to see it update
        this.dataFile = new FiftyOnePipelineEngines.dataFile({ flowElement: this, path: datafile, autoUpdate: false, fileSystemWatcher: true });

        this.registerDataFile(this.dataFile);

        this.dataKey = "astrology"; // datakey used to categorise data coming back from this flowElement in a pipeline

        this.evidenceKeyFilter = new FiftyOnePipelineCore.basicListEvidenceKeyFilter(["query.dateOfBirth"]); // A filter (in this case a basic list) stating which evidence the flowElement is interested in, in this case a query string

        // Update the datafile
        this.refresh();

    }

    // A function called when the datafile is updated / refreshed. In this case it simply loads the JSON from the file into the engine's memory.

    refresh() {

        let engine = this;

        fs.readFile(this.dataFile.path, "utf8", function (err, data) {

            data = JSON.parse(data)

            // Load the datafile into memory and parse it to make it more easily readable
            data = data.map(function (e) {

                let start = e[1].split("/");
                let end = e[2].split("/");

                return { starsign: e[0], startMonth: parseInt(start[1]), startDate: parseInt(start[0]), endMonth: parseInt(end[1]), endDate: parseInt(end[0]) }

            });

            engine.data = data;

        });


    }

    // Internal processing function
    processInternal(flowData) {

        let dateOfBirth = flowData.evidence.get("query.dateOfBirth");

        // Collect data to save back into the flowData under this engine

        let result = {};

        // Lookup the date of birth using the provided and now parsed datafile

        if (dateOfBirth) {

            dateOfBirth = dateOfBirth.split("-");

            let month = parseInt(dateOfBirth[1]);
            let day = parseInt(dateOfBirth[2]);

            result.starSign = this.data.filter(function (date) {

                // Find starsigns in the correct month

                if (date.startMonth === month) {

                    if (date.startDate > day) {

                        return false;

                    } else if (date.endMonth === month && date.endDate <= day) {

                        return false;

                    } else {

                        return true;

                    }

                } else if (date.endMonth === month) {

                    if (date.endDate < day) {

                        return false;

                    } else {

                        return true;

                    }

                } else {

                    return false;

                }

            })[0].starsign;

        };

        // Save the data into an extension of the elementData class (in this case a simple dictionary subclass)
        let data = new FiftyOnePipelineCore.elementDataDictionary({
            flowElement: this, contents: result
        });

        // Set this data on the flowElement
        flowData.setElementData(data);

    }

}

let astrologyElement = new astrology({ datafile: __dirname + "/astrology.json" });

const http = require('http');

let pipeline = new FiftyOnePipelineCore.pipelineBuilder()
    .add(astrologyElement)
    .build();

const server = http.createServer((req, res) => {

    let flowData = pipeline.createFlowData();

    // Add any information from the request (headers, cookies and additional client side provided information)
    flowData.evidence.addFromRequest(req);

    flowData.process().then(function () {

        // Output the date of birth form with any results if they exist

        let output = `

        <h1>Starsigns</h1>

        ${flowData.astrology.starSign ? "<p>Your starsign is " + flowData.astrology.starSign + " </p>" : "<p>Add your date of birth to get your starsign</p>"}

        <form><label for='dateOfBirth'>Date of birth</label><input type='date' name='dateOfBirth' id='dateOfBirth'><input type='submit'></form>
        
        `;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(output);

    });

});

let portNum = 3000;
console.info("To test this example, browse to http://localhost:" + portNum);
server.listen(portNum);
