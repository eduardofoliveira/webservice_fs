const axios = require("axios");
const jxon = require("jxon");

const buscaOperadora = async ({ ddr }) => {
  return new Promise((resolve, reject) => {
    try {
      const dataPost = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        <ConsultaDDR xmlns="http://tempuri.org/">
          <ddr>${ddr}</ddr>
        </ConsultaDDR>
      </soap12:Body>
    </soap12:Envelope>`;

      var options = {
        method: "POST",
        url: "http://3.131.69.158/wsDDR/Service.asmx",
        headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
        data: dataPost,
      };

      axios
        .request(options)
        .then(function (response) {
          const responseData = jxon.stringToJs(response.data);
          let operadora = "";

          if (
            responseData["soap:Envelope"] &&
            responseData["soap:Envelope"]["soap:Body"] &&
            responseData["soap:Envelope"]["soap:Body"]["ConsultaDDRResponse"] &&
            responseData["soap:Envelope"]["soap:Body"]["ConsultaDDRResponse"][
              "ConsultaDDRResult"
            ]
          ) {
            operadora =
              responseData["soap:Envelope"]["soap:Body"]["ConsultaDDRResponse"][
                "ConsultaDDRResult"
              ];
            resolve(operadora);
          }
        })
        .catch(function ({ response }) {
          reject(response);
        });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  buscaOperadora,
};
