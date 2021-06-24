const routes = require("express").Router();

const dialplanController = require("./controller/dialplanController");
const directoryController = require("./controller/directoryController");

routes.get("/dialplan", dialplanController.index);
routes.get("/directory", directoryController.index);

module.exports = routes;

// const jxon = require("jxon");
// app.post("/dialplan", (req, res) => {
//   res.set("Content-Type", "text/xml");

//   const action = {
//     $application: "bridge",
//     $data: "user/1101@editorapaulus.cloudcom.com.br",
//   };

//   const condition = {
//     $field: "destination_number",
//     $expression: "^(.*)$",
//     action,
//   };

//   const extension = {
//     $name: "ramal-administrator",
//     condition,
//   };

//   const context = {
//     $name: "public",
//     extension,
//   };

//   const section = {
//     $name: "dialplan",
//     $description: "RE Dial Plan For FreeSwitch",
//     context,
//   };

//   const document = {
//     $type: "freeswitch/xml",
//     section,
//   };

//   const xml = jxon.jsToString({
//     document,
//   });

//   res.send(xml);
// });
