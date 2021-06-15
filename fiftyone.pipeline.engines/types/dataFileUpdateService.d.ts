export = DataFileUpdateService;
/**
 * @typedef {import('fiftyone.pipeline.core').Pipeline} Pipeline
 * @typedef {import('./dataFile')} DataFile
 */
/**
 * Datafiles attached to FlowElements register with
 * the dataFileUpdateService so the datafiles can receive
 * automatic updates
 **/
declare class DataFileUpdateService {
    /**
     * Constructor for a DataFileUpdateService
     *
     * @param {Pipeline} pipeline
     * pipeline the update service is attached to
     **/
    constructor(pipeline: Pipeline);
    pipeline: import("fiftyone.pipeline.core/types/pipeline");
    /**
     * Method that updates a datafile when it is due an update
     *
     * @param {DataFile} dataFile the datafile to update
     * @returns {undefined}
     */
    updateDataFile(dataFile: DataFile): undefined;
    /**
     * Internal method called when the datafile has
     * been downloaded and is ready after an update
     *
     * @param {DataFile} dataFile the datafile that is ready
     * @param {string} filename the filename of the updated datafile
     * @returns {undefined}
     */
    fileReady(dataFile: DataFile, filename: string): undefined;
    /**
     * Internal method to process the datafile has been downloaded
     * Including unzipping if needed
     *
     * @param {DataFile} dataFile the datafile to processs
     * @param {string} filename the filename of the downloaded data
     */
    processFile(dataFile: DataFile, filename: string): void;
    /**
     * Internal method to check the next update of a
     * datafile at a polling interval set on the datafile
     *
     * @param {DataFile} dataFile the datafile to check updates for
     */
    checkNextUpdate(dataFile: DataFile): void;
    /**
     * Method that registers a datafile with the update service
     *
     * @param {DataFile} dataFile the datafile to register
     */
    registerDataFile(dataFile: DataFile): void;
}
declare namespace DataFileUpdateService {
    export { Pipeline, DataFile };
}
type DataFile = import('./dataFile');
type Pipeline = import("fiftyone.pipeline.core/types/pipeline");
