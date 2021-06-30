require("dotenv").config();

module.exports = {
  production: {
    client: "oracledb",
    connection: {
      user: process.env.CLOUD_ORACLE_USER,
      password: process.env.CLOUD_ORACLE_PASS,
      connectString: process.env.CLOUD_CONNECTSTRING,
    },
    pool: {
      min: 1,
      max: 5,
    },
  },
  production_mysql: {
    // debug: true,
    client: "mysql2",
    connection: {
      user: process.env.CLOUD_MYSQL_USER,
      password: process.env.CLOUD_MYSQL_PASS,
      host: process.env.CLOUD_MYSQL_HOST,
      database: process.env.CLOUD_MYSQL_DATABASE,
    },
    pool: {
      min: 1,
      max: 5,
    },
  },
};
