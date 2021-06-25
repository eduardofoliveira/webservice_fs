const jxon = require("jxon");
const fs = require("fs");

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

      const gateway = fs.createReadStream("./src/util/gateway_base.xml");
      gateway.on("data", (data) => {
        let gatewayTemplate = data.toString();

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
      });

      gateway.on("end", () => {
        resolve(xml);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const loadProfileTemplate = () => {
  return new Promise((resolve, reject) => {
    try {
      let xml = null;

      const profile = fs.createReadStream("./src/util/profile_base.xml");
      profile.on("data", async (data) => {
        let profileTemplate = data.toString();

        let profileXml = jxon.stringToJs(profileTemplate);

        profileXml.profile.gateways = [
          await loadGatewayTemplate({
            gatewayName: "Eduardo-cloudcom",
            password: "123456",
            realm: "cloud.cloudcom.com.br",
            username: "Eduardo",
            proxy: "cloud.cloudcom.com.br:6000",
          }),
        ];

        xml = profileXml;
        resolve(jxon.jsToString(xml));
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
