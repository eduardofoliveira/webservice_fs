const express = require("express");
const app = express();
// const xml = require("xml");
const jxon = require("jxon");

app.get("/dialplan", (req, res) => {
  res.set("Content-Type", "text/xml");

  const action = {
    $application: "bridge",
    $data: "user/1101@editorapaulus.cloudcom.com.br",
  };

  const condition = {
    $field: "destination_number",
    $expression: "^(administrator)$",
    action,
  };

  const extension = {
    $name: "ramal-administrator",
    condition,
  };

  const context = {
    $name: "editorapaulus",
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

  res.send(`<?xml version="1.0" encoding="UTF-8"?>${xml}`);
});

app.listen(80, () => {
  console.log("Running at port " + 80);
});
