const { loadProfileTemplate } = require("../util/xmlTemplate");

module.exports = {
  async index(req, res) {
    const { section, profile } = req.body;

    if (section === "configuration" && profile === "internal") {
      console.log("configuration - internal");

      console.log({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
      });

      return res.send(await loadProfileTemplate());
    }

    return res.send("...Configuration");
  },
};
