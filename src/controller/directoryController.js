module.exports = {
  async index(req, res) {
    console.log({
      body: res.body,
      params: res.params,
      query: res.query,
      headers: res.headers,
    });

    res.send("...Directory");
  },
};
