const fs = require("fs");
const zlib = require("zlib");
const crypto = require("crypto");
const https = require("https");
const http = require("http");
const url = require("url");

const minToMs = (min) => min * 60000;

class dataFileUpdateService {

    constructor(pipeline) {

        this.pipeline = pipeline;

    }

    updateDataFile(dataFile) {

        let dataFileUpdateService = this;

        if (dataFile.updating) {

            return false;

        } else {

            dataFile.updating = true;

        }

        let urlParts = url.parse(dataFile.updateUrl);

        let requestOptions = urlParts;

        if (dataFile.verifyIfModifiedSince) {

            requestOptions.headers = {
                'If-Modified-Since': dataFile.getDatePublished(),
            }

        }

        let request;

        if (urlParts.protocol === "https:") {

            request = https.get(requestOptions);

        } else {

            request = http.get(requestOptions);

        }

        request.on("response", function (response) {

            if (response.statusCode !== 200) {

                dataFileUpdateService.checkNextUpdate(dataFile);
                dataFile.updating = false;

                switch (response.statusCode) {
                    case (429):
                        dataFileUpdateService.pipeline.log("error", "Too many requests to '" + dataFile.updateUrl + "' for engine '" +
                            dataFile.flowElement.dataKey + "'");
                        break;
                    case (304):
                        dataFileUpdateService.pipeline.log("warn", "No data update available from " + dataFile.updateUrl + "' for engine '" +
                            dataFile.flowElement.dataKey + "'");
                        break;
                    case (403):
                        dataFileUpdateService.pipeline.log("error", "Access denied from " + dataFile.updateUrl + "' for engine '" +
                            dataFile.flowElement.dataKey + "'");
                        break;
                    default:
                        dataFileUpdateService.pipeline.log("error", "Error" + response.statusCode + " from " + dataFile.updateUrl + "' for engine '" +
                            dataFile.flowElement.dataKey + "'");
                        break;
                }

                return false;

            }

            let filename = dataFile.tempDataDirectory + "/" + dataFile.identifier + Date.now();

            response.pipe(fs.createWriteStream(filename));

            response.on("end", function () {

                // Open file

                if (dataFile.verifyMD5) {

                    let headerMD5 = response.headers["content-md5"];

                    var fd = fs.createReadStream(filename);

                    var hash = crypto.createHash('md5');
                    hash.setEncoding('hex');

                    fd.on('end', function () {
                        hash.end();
                        if (hash.read() !== headerMD5) {

                            dataFileUpdateService.pipeline.log("error", "MD5 doesn't match from '" + dataFile.updateUrl + "' for engine '" + dataFile.flowElement.dataKey + "'");

                            dataFile.updating = false;
                            dataFileUpdateService.checkNextUpdate(dataFile);

                        } else {

                            dataFileUpdateService.processFile(dataFile, filename);

                        }
                    });

                    fd.pipe(hash);

                } else {

                    dataFileUpdateService.processFile(dataFile, filename);

                }

            });

        });

    }

    fileReady(dataFile, filename) {

        let dataFileUpdateService = this;

        fs.rename(filename, dataFile.path, function (err, data) {

            dataFile.refresh();

            dataFileUpdateService.checkNextUpdate(dataFile);

            dataFile.updating = false;

        });
    }

    processFile(dataFile, filename) {

        let dataFileUpdateService = this;

        if (dataFile.decompress) {

            fs.readFile(filename, function (err, buffer) {

                zlib.gunzip(buffer, function (err, data) {

                    let doneFileName = filename + "_done";

                    fs.writeFile(doneFileName, data, function () {

                        dataFileUpdateService.fileReady(dataFile, doneFileName);

                    })

                });

            })

        } else {

            dataFileUpdateService.fileReady(dataFile, filename);

        }

    }

    checkNextUpdate(dataFile) {

        try {

            let dataFileUpdateService = this;

            let interval = minToMs((Math.floor(Math.random() * dataFile.updateTimeMaximumRandomisation) + 1) + dataFile.pollingInterval);

            interval += dataFile.getNextUpdate().getMilliseconds();

            dataFile.updateOnStart = true;

            // Run update on start if specified to do so
            if (dataFile.updateOnStart) {

                dataFileUpdateService.updateDataFile(dataFile);

            }

            setTimeout(function () {

                dataFileUpdateService.updateDataFile(dataFile);

            }, interval);

        } catch (e) {

            // Catch any extra errors with datafile updates

            this.pipeline.log("error", e);

        }

    }

    registerDataFile(dataFile) {

        dataFile.registered = true;

        this.checkNextUpdate(dataFile);

        // check if fileSystemWatcher is enabled and listen for datafile changes

        if (dataFile.fileSystemWatcher) {

            fs.watch(dataFile.path, function (event) {

                if (!dataFile.updating) {

                    dataFile.refresh();

                }

            });

        }


    }

}

module.exports = dataFileUpdateService;
