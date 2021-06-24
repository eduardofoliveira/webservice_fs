const routes = require("express").Router();

const dialplanController = require("./controller/dialplanController");
const directoryController = require("./controller/directoryController");

routes.post("/dialplan", dialplanController.index);
routes.post("/directory", directoryController.index);

module.exports = routes;
