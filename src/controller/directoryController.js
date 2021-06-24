const { registerXml, notFound } = require("../util/xmlHelper");

const DirectoryRepository = require("../repository/directoryRepository");

module.exports = {
  async index(req, res) {
    const { user, domain, section } = req.body;
    let xml = null;

    const directoryRepository = new DirectoryRepository();
    const users = await directoryRepository.getAuth({
      user,
      domain,
    });

    console.log(users);

    if (section === "directory") {
      xml = registerXml({
        dominio: domain,
        username: user,
        hash: "",
      });
    } else {
      xml = notFound();
    }

    res.send(xml);
  },
};
