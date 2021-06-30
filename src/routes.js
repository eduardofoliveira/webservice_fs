const routes = require("express").Router();

const dialplanController = require("./controller/dialplanController");
const directoryController = require("./controller/directoryController");
const configurationController = require("./controller/configurationController");

routes.post("/dialplan", dialplanController.index);
routes.post("/directory", directoryController.index);
routes.post("/configuration", configurationController.index);

routes.post("/configuration/test", configurationController.test);

module.exports = routes;
