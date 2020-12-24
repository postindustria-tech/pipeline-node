![51Degrees](https://51degrees.com/DesktopModules/FiftyOne/Distributor/Logo.ashx?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "Data rewards the curious") **51Degrees Pipeline Core**

[Developer Documentation](https://docs.51degrees.com?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "developer documentation")

## Introduction
The 51Degrees Pipeline API is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

## This package - fiftyone.pipeline.core

This package definds the essential components of the Pipeline API such as `flow elements`, `flow data` and `evidence`. It also packages together JavaScript served by a pipeline and allows for client side requests for additional data populated by evidence from the client side.

It can be used on its own or with the following additional packages.

- **fiftyone.pipeline.engines** - Adds a specialized type of flow element called an engine which allows for additional features including an auto-updating data file for properties, a service called when a requested property is missing and a caching system.

Engines created by 51Degrees including:

- **fiftyone.devicedetection** - A device detection engine
- **fiftyone.location** - A geolocation lookup engine

Make use of the above along with the following additional packages:

- **fiftyone.pipeline.engines.fiftyone** - Functionality specific to 51Degrees engines.
- **fiftyone.pipeline.cloudrequestengine** - An engine used to make requests to the 51Degrees cloud service.

## Installation

```
npm install fiftyone.pipeline.core
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

- **examples/customFlowElements/1-simpleEvidenceFlowElement.js** - Demonstrates how to create a custom flow element that takes some evidence (birthdate) and returns something related to that evidence (star sign)
- **examples/customFlowelements/3-clientSideEvidenceFlowElement.js** - Demonstrates how to modify the flow element from the 'simple evidence' example to gather evidence from code running on the client device (i.e. JavaScript).
