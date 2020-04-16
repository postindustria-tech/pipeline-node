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

const os = require('os');

class DataFile {
  constructor ({ flowElement, identifier, updateURLParams, tempDataDirectory = os.tmpdir(), createTempDataCopy = true, data, path, autoUpdate = true, fileSystemWatcher = true, pollingInterval = 30, updateTimeMaximumRandomisation = 10, verifyMD5 = true, decompress = true, download = true, getDatePublished, getNextUpdate, verifyIfModifiedSince = true, updateOnStart = false, isRegistered = false, refresh }) {
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

  refresh (identifier) {
    this.flowElement.refresh(identifier);
  }

  get updateUrl () {
    return this.urlFormatter();
  }

  urlFormatter () {
    // by default just return the url
    return this.updateURLParams.url;
  }
}

module.exports = DataFile;
