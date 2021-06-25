const { loadProfileTemplate } = require("../util/xmlTemplate");
const DirectoryRepository = require("../repository/directoryRepository");

module.exports = {
  async index(req, res) {
    const { section, profile } = req.body;

    if (section === "configuration" && profile === "internal") {
      const directoryRepository = new DirectoryRepository();

      const usersCloud = await directoryRepository.getDomainGateways({
        domain: "cloud.cloudcom.com.br",
      });

      const usersEditora = await directoryRepository.getDomainGateways({
        domain: "editorapaulus.cloudcom.com.br",
      });

      let users = [...usersCloud, ...usersEditora];

      users = users.map((item) => {
        return {
          gatewayName: `${item.VCH_USERNAME}-${item.VCH_DOMAIN}`,
          password: item.TXT_DESCRIPTION,
          realm: item.VCH_DOMAIN,
          username: item.VCH_USERNAME,
          proxy: `${item.VCH_DOMAIN}:6000`,
        };
      });

      const xml = await loadProfileTemplate({ users });
      res.set("Content-Type", "text/xml");
      return res.send(xml);
    }

    return res.send("...Configuration");
  },
};
