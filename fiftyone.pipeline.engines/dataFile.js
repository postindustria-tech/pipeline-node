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
