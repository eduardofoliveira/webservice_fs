const jxon = require("jxon");

const registerXml = ({ username, dominio, password, hash }) => {
  let paramPassword = null;
  if (password) {
    paramPassword = {
      $name: "password",
      $value: password,
    };
  }
  if (hash) {
    paramPassword = {
      $name: "a1-hash",
      $value: hash,
    };
  }

  const paramsPassword = {
    param: paramPassword,
  };

  const user = {
    $id: username,
    params: paramsPassword,
  };

  const users = {
    user,
  };

  const group = {
    $name: "default",
    users,
  };

  const groups = {
    group,
  };

  const param = {
    $name: "dial-string",
    $value:
      "{presence_id=${dialed_user}@${dialed_domain}}${sofia_contact(${dialed_user}@${dialed_domain})}",
  };

  const params = {
    param,
  };

  const variable = [];

  const variable1 = {
    $name: "register-gateway",
    $value: `${username}-${dominio}`,
  };

  const variable2 = {
    $name: "user_context",
    $value: dominio,
  };

  const variable3 = {
    $name: "accountcode",
    $value: dominio,
  };

  variable.push(variable1);
  variable.push(variable2);
  variable.push(variable3);

  const variables = {
    variable,
  };

  const domain = {
    $name: dominio,
    params,
    variables,
    groups,
  };

  const section = {
    $name: "directory",
    domain,
  };

  const document = {
    $type: "freeswitch/xml",
    section,
  };

  const xml = jxon.jsToString({
    document,
  });

  return xml;
};

const notFound = () => {
  const result = {
    $status: "not found",
  };

  const section = {
    $name: "result",
    result,
  };

  const document = {
    $type: "freeswitch/xml",
    section,
  };

  const xml = jxon.jsToString({
    document,
  });

  return xml;
};

module.exports = {
  registerXml,
  notFound,
};
