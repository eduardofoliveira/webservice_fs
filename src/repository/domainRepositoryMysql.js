const { connection_mysql } = require("../database/connection");

class domainRepositoryMysql {
  async getActiveDomains() {
    const domains = await connection_mysql("domain")
      .select("*")
      .where("enabled", 1);

    return domains;
  }

  async addDomain({ domain }) {
    const [idInserted] = await connection_mysql("domain").insert({
      domain,
    });

    const [domainInserted] = await connection_mysql("domain")
      .select("*")
      .where("id", idInserted);

    return domainInserted;
  }

  async disable({ domain }) {
    await connection_mysql("domain")
      .update({
        enabled: 0,
        updated_at: "now()",
      })
      .where("domain", domain);

    return true;
  }

  async enable({ domain }) {
    await connection_mysql("domain")
      .update({
        enabled: 1,
        updated_at: "now()",
      })
      .where("domain", domain);

    return true;
  }
}

module.exports = domainRepositoryMysql;
