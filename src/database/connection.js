const knex = require("knex");

const configuration = require("../../knexfile");

const connection = knex(configuration.production);
const connection_mysql = knex(configuration.production_mysql);

module.exports = {
  connection,
  connection_mysql,
};
