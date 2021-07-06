const { buscaOperadora } = require("../util/webServiceBSS");

let relacaoOperadoraPrefixo = {
  "Datora-Cloud": 3012,
  "Americanet-Cloud": 3010,
  "GT Group-Cloud": 3027,
  "TVN - BRDID": 3026,
};

let cache = {};

const buscarOperadoraPrefixo = async ({ fromDID }) => {
  let did = "";

  if (cache[fromDID]) {
    return cache[fromDID];
  }

  if (/55114003\d{4}/.test(fromDID)) {
    did = fromDID.replace("5511", "980");
  }
  if (/550800\d{7}/.test(fromDID)) {
    did = fromDID.replace("550800", "9800");
  }
  if (/55\d{10,11}/.test(fromDID)) {
    did = fromDID.replace("55", "");
  }

  const operadora = await buscaOperadora({ ddr: did });

  cache[fromDID] = relacaoOperadoraPrefixo[operadora];

  return relacaoOperadoraPrefixo[operadora];
};

module.exports = {
  buscarOperadoraPrefixo,
};
