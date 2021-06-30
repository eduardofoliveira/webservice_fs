const jxon = require("jxon");

module.exports = {
  async index(req, res) {
    const {
      section,
      variable_user_name,
      variable_domain_name,
      variable_sip_to_user,
      variable_sip_to_host,
      variable_sip_from_user,
      variable_sip_from_host,
    } = req.body;
    const callerContext = req.body["Caller-Context"];

    //
    // 1 Contexto : dominio || public
    // 2 From : usuario || DID
    // 3 From Host : dominio || IP
    // 4 To : usuario || DID
    // 4 To Host : dominio || IP
    //

    const context = callerContext;
    const from = variable_sip_from_user;
    const fromHost = variable_sip_from_host;
    const to = variable_sip_to_user;
    const toHost = variable_sip_to_host;

    console.log({
      context,
      from,
      fromHost,
      to,
      toHost,
    });

    //
    // Chamadas Recebidas Externas para ramais internos
    //
    if (
      callerContext === "public" &&
      (variable_sip_from_host.includes("brastel") ||
        variable_sip_from_host.includes("cloudcom"))
    ) {
      const xmlText = `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${callerContext}">
              <extension name="${variable_user_name}-${variable_sip_to_user}">
                <condition field="destination_number" expression="^(${variable_sip_to_user})$">
                  <action application="transfer" data="$1 XML ${variable_sip_from_host}"/>
                </condition>
              </extension>
            </context>
          </section>
        </document>
        `;

      let xml = jxon.stringToJs(xmlText);
      res.set("Content-Type", "text/xml");
      return res.send(jxon.jsToString(xml));
    }

    //
    // Chamadas externas
    //
    if (
      section === "dialplan" &&
      (variable_sip_to_user >= 1000 ||
        variable_sip_to_user <= 9999 ||
        variable_sip_to_user >= 11111111 ||
        variable_sip_to_user <= 99999999) &&
      (callerContext === "cloud.cloudcom.com.br" ||
        callerContext === "editorapaulus.cloudcom.com.br")
    ) {
      const xmlText =
        `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${variable_domain_name}">
              <extension name="${variable_user_name}-${variable_sip_to_user}">
                <condition field="destination_number" expression="^(${variable_sip_to_user})$">
                  <action application="bridge" data="{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/` +
        "${register-gateway}" +
        `/$1"/>
                </condition>
              </extension>
            </context>
          </section>
        </document>
        `;

      let xml = jxon.stringToJs(xmlText);
      res.set("Content-Type", "text/xml");
      return res.send(jxon.jsToString(xml));
    }

    //
    // Chamadas para contextos internos destinadas a ramais
    //
    if (
      callerContext === "cloud.cloudcom.com.br" ||
      callerContext === "editorapaulus.cloudcom.com.br"
    ) {
      const xmlText = `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${callerContext}">
              <extension name="${variable_user_name}-${variable_sip_to_user}">
                <condition field="destination_number" expression="^(${variable_sip_to_user})$">
                  ${
                    variable_sip_from_user === "Marlon"
                      ? '<action application="set" data="effective_caller_id_number=1106"/> <action application="set" data="effective_caller_id_name=Ramal do Marlon"/>'
                      : ""
                  }
                  <action application="bridge" data="user/${variable_sip_to_user}@${callerContext}"/>
                </condition>
              </extension>
            </context>
          </section>
        </document>
        `;

      let xml = jxon.stringToJs(xmlText);
      res.set("Content-Type", "text/xml");
      return res.send(jxon.jsToString(xml));
    }

    // console.log({
    //   body: req.body,
    //   params: req.params,
    //   query: req.query,
    //   headers: req.headers,
    // });

    res.set("Content-Type", "text/xml");
    return res.send("...Dialplan");
  },
};
