const jxon = require("jxon");

module.exports = {
  async index(req, res) {
    const {
      section,
      variable_user_name,
      variable_domain_name,
      variable_sip_to_user,
    } = req.body;

    console.log({
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    });

    if (section === "dialplan") {
      const xmlText =
        `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${variable_domain_name}">
              <extension name="${variable_user_name}-${variable_sip_to_user}">
                <condition field="destination_number" expression="^${variable_sip_to_user}$">
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

    res.set("Content-Type", "text/xml");
    return res.send("...Dialplan");
  },
};
