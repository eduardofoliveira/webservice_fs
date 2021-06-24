module.exports = {
  async index(req, res) {
    console.log({
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    });

    res.send("...Directory");
  },
};
