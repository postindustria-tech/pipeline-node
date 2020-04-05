const core = require("fiftyone.pipeline.core");

let testEngine = new core.flowElement({
  dataKey: "testengine",
  properties: {
    one: {
      type: "int"
    },
    two: {
      type: "int"
    },
    three: {
      type: "javascript"
    },
    four: {
      type: "string"
    }
  },
  processInternal: function(flowData) {
    let contents = { one: 1, two: 2 };

    let three = new core.aspectPropertyValue();
    three.value = "console.log('ok')";

    contents.three = three;

    contents.four = new core.aspectPropertyValue(
      "This property is not available"
    );

    let data = new core.elementDataDictionary({
      flowElement: this,
      contents: contents
    });

    flowData.setElementData(data);
  }
});

let pipeline = new core.pipelineBuilder()
  .add(testEngine)
  .build();

let flowData = pipeline.createFlowData();

let fs = require("fs");

test("jsonbuilder contents", done => {
  flowData.process().then(function() {
    let json = JSON.stringify(flowData.jsonbundler.json);

    expect(json).toBe(
      JSON.stringify({
        javascriptProperties: ["testengine.three"],
        testengine: { one: 1, two: 2, three: "console.log('ok')", four: null, fournullreason: "This property is not available" },
      })
    );

    done();
  });
});

// test("javascript output", () => 
// {

//   // Uncomment this to refresh the jsoutput.js file
//   // fs.writeFileSync(__dirname + "/jsoutput.js", flowData.javascriptbuilder.javascript);

//   expect(flowData.javascriptbuilder.javascript).toBe(fs.readFileSync(__dirname + "/jsoutput.js", "utf8"));
// });

test("sequence gives a session id", () => {
  expect(flowData.evidence.get("query.session-id")).toBeTruthy();
});

test("sequence gives a sequence number", () => {
  expect(flowData.evidence.get("query.sequence")).toBe(1);
});

let flowData2 = pipeline.createFlowData();

flowData2.evidence.add("query.session-id", "test");
flowData2.evidence.add("query.sequence", 10);

test("sequence number for same session id increments", (done) => {

  flowData2.process().then(function(){

    expect(flowData2.evidence.get("query.sequence")).toBe(11);

    done();

  })

});

test("no javascriptProperties when sequence cap met", () => {

    expect(flowData2.jsonbundler.json["javascriptProperties"].length).toBe(0);

});
