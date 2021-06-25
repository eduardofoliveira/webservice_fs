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

      const xml = await loadProfileTemplate();
      res.set("Content-Type", "text/xml");
      return res.send(xml);
    }

    return res.send("...Configuration");
  },
};
