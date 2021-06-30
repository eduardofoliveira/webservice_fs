const jxon = require("jxon");
const fs = require("fs");
let gatewayTemplate = "";

const gateway = fs.createReadStream("./src/util/gateway_base.xml");
gateway.on("data", (data) => {
  gatewayTemplate = data.toString();
});

const loadGatewayTemplate = ({
  gatewayName,
  username,
  realm,
  password,
  proxy,
}) => {
  return new Promise((resolve, reject) => {
    try {
      let xml = null;

      let gatewayXml = jxon.stringToJs(gatewayTemplate);
      xml = gatewayXml;

      xml.gateway.$name = gatewayName;
      for (let i = 0; i < xml.gateway.param.length; i++) {
        const item = xml.gateway.param[i];

        if (item.$name === "username") {
          item.$value = username;
        }
        if (item.$name === "realm") {
          item.$value = realm;
        }
        if (item.$name === "from-user") {
          item.$value = username;
        }
        if (item.$name === "from-domain") {
          item.$value = realm;
        }
        if (item.$name === "extension") {
          item.$value = username;
        }
        if (item.$name === "password") {
          item.$value = password;
        }
        if (item.$name === "proxy") {
          item.$value = proxy;
        }
        if (item.$name === "register-proxy") {
          item.$value = proxy;
        }

        xml.gateway.param[i] = item;
      }

      resolve(xml);
    } catch (error) {
      reject(error);
    }
  });
};

const loadProfileTemplate = ({ users }) => {
  return new Promise((resolve, reject) => {
    try {
      const profile = fs.createReadStream("./src/util/profile_base.xml");
      profile.on("data", async (data) => {
        let profileTemplate = data.toString();

        let profileXml = jxon.stringToJs(profileTemplate);

        const gateway = [];

        for (let i = 0; i < users.length; i++) {
          const { gatewayName, password, realm, username, proxy } = users[i];

          // console.log({ gatewayName, password, realm, username, proxy });

          let { gateway: item } = await loadGatewayTemplate({
            gatewayName,
            password,
            realm,
            username,
            proxy,
          });

          gateway.push(item);
        }

        const gateways = {
          gateway,
        };

        profileXml.document.section.configuration.profiles.profile.gateways =
          gateways;
        // console.log(profileXml.document.section.configuration.profiles.profile);

        resolve(jxon.jsToString(profileXml));
      });
      // profile.on("end", () => {
      //   console.log(xml);
      //   resolve(xml);
      // });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  loadGatewayTemplate,
  loadProfileTemplate,
};

// let execute = async () => {
//   console.log(await loadProfileTemplate());
// };

// execute();
