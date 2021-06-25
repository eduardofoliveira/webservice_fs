const { connection } = require("../database/connection");

class directoryRepository {
  async getAuth({ user, domain }) {
    const users = await connection.raw(`
      select
          u.vch_username,
          u.vch_name,
          u.vch_password,
          u.txt_description,
          d.vch_domain
      from
          tbl_sys_user u,
          tbl_sys_domain d
      where
          u.int_domain_key = d.int_domain_key and
          d.vch_domain = '${domain}' and
          u.vch_username = '${user}' and
          u.int_agentuser = 0 and
          u.int_active = 1
    `);

    return users;
  }

  async getDomainGateways({ domain }) {
    const users = await connection.raw(`
      select
          u.vch_username,
          u.vch_name,
          u.vch_password,
          u.txt_description,
          d.vch_domain
      from
          tbl_sys_user u,
          tbl_sys_domain d
      where
          u.int_domain_key = d.int_domain_key and
          d.vch_domain = '${domain}' and
          u.int_agentuser = 0 and
          u.int_active = 1
    `);

    return users;
  }
}

module.exports = directoryRepository;
