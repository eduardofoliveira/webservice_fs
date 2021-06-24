require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("./routes"));

app.listen(process.env.PORT, () => {
  console.log(`Webservice Running at port: ${process.env.PORT}`);
});
