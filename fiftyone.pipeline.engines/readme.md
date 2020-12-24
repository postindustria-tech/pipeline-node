![51Degrees](https://51degrees.com/DesktopModules/FiftyOne/Distributor/Logo.ashx?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "Data rewards the curious") **51Degrees Pipeline Engines**

[Developer Documentation](https://docs.51degrees.com?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "developer documentation")

## Introduction

The 51Degrees Pipeline API is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

## This package - fiftyone.pipeline.engines

This package extends the `flow element` class created by the `fiftyone.pipeline.core` pacakge into a specialized type of flow element called an engine. This allows for additional features including:

* An auto-updating data file for properties
* A service called when a requested property
* A caching system and implementation of an LRU (least recently used) cache

Engines created by 51Degrees:

- **fiftyone.devicedetection** - A device detection engine
- **fiftyone.location** - A geolocation lookup engine

Make use of this package along with the following additional packages:

- **fiftyone.pipeline.engines.fiftyone** - Functionality specific to 51Degrees engines.
- **fiftyone.pipeline.cloudrequestengine** - An engine used to make requests to the 51Degrees cloud service.

## Installation

```
npm install fiftyone.pipeline.engines
```

## Tests

To run tests you will need to install the `jest` library.

```
npm install jest --global
```

Then, navigate to the module directory and execute:

```
npm test
```

## Examples

- **examples/onPremiseFlowElement.js** - Demonstrates the creation of an engine that uses an auto-updating datafile to populate properties
- **examples/caching.js** - Demonstrates a custom cache that makes use of the result caching feature that engines provide.
