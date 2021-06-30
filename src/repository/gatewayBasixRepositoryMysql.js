const { connection_mysql } = require("../database/connection");

class gatewayBasixRepositoryMysql {
  async getActiveGateways() {
    const gateways = await connection_mysql("gateway_basix")
      .join("domain", "domain.id", "=", "gateway_basix.fk_id_domain")
      .select("*")
      .where("gateway_basix.enabled", 1)
      .orderBy("username", "asc");

    return gateways;
  }

  async disableGateway({ domain, username }) {
    const [domainData] = await connection_mysql("domain")
      .select("*")
      .where("domain", domain);

    if (!domainData) {
      throw new Error("Domain not found");
    }

    const [gateway] = await connection_mysql("gateway_basix")
      .select("*")
      .where("fk_id_domain", domainData.id)
      .andWhere("username", username);

    if (!gateway) {
      throw new Error("Gateway not found");
    }

    await connection_mysql("gateway_basix")
      .update({
        enabled: 0,
        updated_at: "now()",
      })
      .where("fk_id_domain", domainData.id)
      .andWhere("username", username);

    const [UpdatedGateway] = await connection_mysql("gateway_basix")
      .select("*")
      .where("fk_id_domain", domainData.id)
      .andWhere("username", username);

    return UpdatedGateway;
  }

  async disableGateway({ domain, username }) {
    const [domainData] = await connection_mysql("domain")
      .select("*")
      .where("domain", domain);

    if (!domainData) {
      throw new Error("Domain not found");
    }

    const [gateway] = await connection_mysql("gateway_basix")
      .select("*")
      .where("fk_id_domain", domainData.id)
      .andWhere("username", username);

    if (!gateway) {
      throw new Error("Gateway not found");
    }

    await connection_mysql("gateway_basix")
      .update({
        enabled: 1,
        updated_at: "now()",
      })
      .where("fk_id_domain", domainData.id)
      .andWhere("username", username);

    const [UpdatedGateway] = await connection_mysql("gateway_basix")
      .select("*")
      .where("fk_id_domain", domainData.id)
      .andWhere("username", username);

    return UpdatedGateway;
  }
}

module.exports = gatewayBasixRepositoryMysql;
