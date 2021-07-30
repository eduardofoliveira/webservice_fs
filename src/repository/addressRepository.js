const { connection } = require("../database/connection");

class addressRepository {
  async getAllAddress() {
    const addresses = await connection.raw(`
      select
          vch_address
      from
          tbl_pbx_address
      where
          int_type = 3 and
          int_active!= 0
      order by
          vch_address
    `);

    return addresses;
  }
}

module.exports = addressRepository;
