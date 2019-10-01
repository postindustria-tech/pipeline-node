let os = require("os");

class dataFile {

    constructor({ flowElement, identifier, updateURLParams, tempDataDirectory = os.tmpdir(), createTempDataCopy = true, data, path, autoUpdate = true, fileSystemWatcher = true, pollingInterval = 30, updateTimeMaximumRandomisation = 10, verifyMD5 = true, decompress = true, download = true, getDatePublished, getNextUpdate, verifyIfModifiedSince = true, updateOnStart = false, isRegistered = false, refresh }) {

        this.flowElement = flowElement;
        this.identifier = identifier;
        this.updateURLParams = updateURLParams;
        this.tempDataDirectory = tempDataDirectory;
        this.createTempDataCopy = createTempDataCopy;
        this.data = data;
        this.path = path;
        this.autoUpdate = autoUpdate;
        this.fileSystemWatcher = fileSystemWatcher;
        this.pollingInterval = pollingInterval;
        this.updateTimeMaximumRandomisation = updateTimeMaximumRandomisation;
        this.verifyMD5 = verifyMD5;
        this.decompress = decompress;
        this.download = download;
        this.getDatePublished = getDatePublished;
        this.getNextUpdate = getNextUpdate;
        this.verifyIfModifiedSince = verifyIfModifiedSince;
        this.updateOnStart = updateOnStart;
        this.isRegistered = isRegistered;

        if (refresh) {
            this.refresh = refresh;
        }

        if (path) {

            this.path = path;

        } else if (data) {

            this.data = data;

        }

        // Flag for whether the datafile is currently being updated
        this.updating = false;

    }

    refresh(identifier) {

        this.flowElement.refresh(identifier);

    }

    get updateUrl() {

        return this.urlFormatter();

    }

    urlFormatter() {

        // by default just return the url
        return this.updateURLParams.url;

    }

}

module.exports = dataFile;
