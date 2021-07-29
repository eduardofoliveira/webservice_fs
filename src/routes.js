const routes = require("express").Router();

const dialplanController = require("./controller/dialplanController");
const directoryController = require("./controller/directoryController");
const configurationController = require("./controller/configurationController");

routes.post("/dialplan", dialplanController.index);
routes.post("/directory", directoryController.index);
routes.post("/configuration", configurationController.index);

routes.post("/configuration/test", configurationController.test);

const { notFound, generateOutboundRoute } = require("./util/xmlGenerator");

routes.get("/notfound", (req, res) => {
  const xml = notFound();

  res.set("Content-Type", "text/xml");
  return res.send(xml);
});

routes.get("/outbound", (req, res) => {
  const xml = generateOutboundRoute({
    from: "551135880866",
    to: "5511961197559",
    prefixo: ["3012", "3010"],
  });

  res.set("Content-Type", "text/xml");
  return res.send(xml);
});

module.exports = routes;
