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

    if (section === "directory" && users.length) {
      xml = registerXml({
        dominio: domain,
        username: user,
        hash: users[0].VCH_PASSWORD,
      });
    } else {
      xml = notFound();
    }

    res.set("Content-Type", "text/xml");
    res.send(xml);
  },
};
