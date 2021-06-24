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
};
