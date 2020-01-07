![51Degrees](https://51degrees.com/DesktopModules/FiftyOne/Distributor/Logo.ashx?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "Data rewards the curious") **Node Pipeline**

[Developer Documentation](https://docs.51degrees.com?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "developer documentation")

## Introduction
This repository contains the components of the Node.JS implementation of the 51Degrees Pipeline API.

The Pipeline is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

## Contents
This repository produces 5 modules:

- **fiftyone.pipeline.core** - Defines the essential components of the Pipeline API such as 'flow elements', 'flow data' and 'evidence'
- **fiftyone.pipeline.engines** - Functionality for a specialized type of flow element called an engine.
- **fiftyone.pipeline.engines.fiftyone** - Functionality specific to 51Degrees engines.
- **fiftyone.pipeline.cloudrequestengine** - An engine used to make requests to the 51Degrees cloud service.
- **fiftyone.pipeline.javascriptbundler** - A flow element used to bundle together and minify multiple JavaScript snippets.

## Tests
Most modules include some automated tests. To run these, navigate to the module directory and execute:

```
npm test
```

## Examples
There are several examples available:

- **examples/pipelines.js** - Demonstrates several different types of flow element and how to add them to a pipeline.
- **examples/caching.js** - Demonstrates a custom cache that makes use of the result caching feature that engines provide.
- **examples/customFlowElements/1-simpleEvidenceFlowElement.js** - Demonstrates how to create a custom flow element that takes some evidence (birthdate) and returns something related to that evidence (star sign)
- **examples/customFlowElements/2-onPremiseFlowElement.js** - Demonstrates how to modify the flow element from the 'simple evidence' example to use a data file to determine star sign rather than a hard-coded table.
- **examples/customFlowelements/3-clientSideEvidenceFlowElement.js** - Demonstrates how to modify the flow element from the 'simple evidence' example to gather evidence from code running on the client device (i.e. JavaScript).