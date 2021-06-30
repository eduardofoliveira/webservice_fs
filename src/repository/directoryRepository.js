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

  async getUserNameExtensionList({ domain }) {
    const listUsers = await connection.raw(`
      select
          u.vch_username as username,
          u.vch_name as name,
          a.vch_address as ramal
      from
          tbl_sys_user u,
          tbl_sys_domain d,
          tbl_pbx_address a,
          tbl_pbx_pbxuser pu
      where
          u.int_domain_key = d.int_domain_key and
          pu.int_user_key = u.int_user_key and
          a.int_pbxuser_key = pu.int_pbxuser_key and
          d.vch_domain = '${domain}' and
          u.int_agentuser = 0 and
          a.int_type = 1
      order by
          username,
          ramal
    `);

    return listUsers;
  }
}

module.exports = directoryRepository;
