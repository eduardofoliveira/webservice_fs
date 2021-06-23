const express = require("express");
const app = express();
// const xml = require("xml");
const jxon = require("jxon");

app.get("/", (req, res) => {
  res.set("Content-Type", "text/xml");

  const action = {
    $application: "bridge",
    $data: "iax/guest@conference.freeswitch.org/888",
  };

  const condition = {
    $field: "destination_number",
    $expression: "^83789$",
    action,
  };

  const extension = {
    $name: "test9",
    condition,
  };

  const context = {
    $name: "default",
    extension,
  };

  const section = {
    $name: "dialplan",
    $description: "RE Dial Plan For FreeSwitch",
    context,
  };

  const document = {
    $type: "freeswitch/xml",
    section,
  };

  const xml = jxon.jsToString({
    document,
  });

  res.send(xml);
});

app.listen(80, () => {
  console.log("Running at port " + 80);
});
