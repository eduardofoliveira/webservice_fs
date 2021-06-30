const { loadProfileTemplate } = require("../util/xmlTemplate");
const DirectoryRepository = require("../repository/directoryRepository");
const DomainRepositoryMysql = require("../repository/domainRepositoryMysql");
const GatewayBasixRepositoryMysql = require("../repository/gatewayBasixRepositoryMysql");

module.exports = {
  async index(req, res) {
    const { section, profile } = req.body;

    if (section === "configuration" && profile === "internal") {
      const directoryRepository = new DirectoryRepository();
      const domainRepositoryMysql = new DomainRepositoryMysql();
      const gatewayBasixRepositoryMysql = new GatewayBasixRepositoryMysql();

      const activeDomains = await domainRepositoryMysql.getActiveDomains();

      let users = [];

      for (let i = 0; i < activeDomains.length; i++) {
        const domainItem = activeDomains[i];

        const usersList = await directoryRepository.getDomainGateways({
          domain: domainItem.domain,
        });

        users = [...usersList, ...users];
      }

      const enableGateways =
        await gatewayBasixRepositoryMysql.getActiveGateways();

      users = users.filter((userItem) => {
        const existe = enableGateways.find((gatewayItem) => {
          if (
            gatewayItem.username === userItem.VCH_USERNAME &&
            gatewayItem.domain === userItem.VCH_DOMAIN
          ) {
            return true;
          }
          return false;
        });

        if (existe) {
          return true;
        }
        return false;
      });

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

  async test(req, res) {
    const gatewayBasixRepositoryMysql = new GatewayBasixRepositoryMysql();
    const gateways = await gatewayBasixRepositoryMysql.getActiveGateways();

    return res.json(gateways);
  },
};
