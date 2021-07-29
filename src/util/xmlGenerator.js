const jxon = require("jxon");

const notFound = () => {
  const xmlText = `
    <document type="freeswitch/xml">
      <section name="dialplan" description="RE Dial Plan For FreeSwitch">
        <result status="not found" />
      </section>
    </document>`;

  xml = jxon.stringToJs(xmlText);
  return jxon.jsToString(xml);
};

const generateOutboundRoute = ({ from, to, prefixo }) => {
  const xmlText =
    `
    <document type="freeswitch/xml">
      <section name="dialplan" description="RE Dial Plan For FreeSwitch">
        <context name="public">
          <extension name="${from}-${to}">
          <condition field="destination_number" expression="^3040(.*)$">` +
    '<action application="set" data="effective_caller_id_number=${sip_from_user:2}"/>' +
    '<action application="set" data="effective_caller_id_name=${sip_from_user:2}"/>' +
    `<action application="set" data="inherit_codec=true"/>
    <action application="set" data="bridge_generate_comfort_noise=true"/>
    <action application="set" data="ringback=` +
    "${us-ring}" +
    `"/>
                  <action application="set" data="instant_ringback=true"/>
                  
                </condition>
              </extension>
            </context>
          </section>
        </document>
  `;

  xml = jxon.stringToJs(xmlText);

  if (Array.isArray(prefixo)) {
    xml.document.section.context.extension.condition.action.push({
      $application: "set",
      $data: `continue_on_fail=true`,
    });
    xml.document.section.context.extension.condition.action.push({
      $application: "set",
      $data: `hangup_after_bridge=true`,
    });

    for (let i = 0; i < prefixo.length; i++) {
      const itemPrefixo = prefixo[i];

      if (itemPrefixo === 3022) {
        xml.document.section.context.extension.condition.action.push({
          $application: "bridge",
          $data: `{absolute_codec_string=^^:G729}sofia/internal/$1`,
        });
      } else {
        xml.document.section.context.extension.condition.action.push({
          $application: "bridge",
          $data: `{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/astpp/3041$1`,
        });
      }
    }
  } else if (typeof prefixo === "string") {
    if (itemPrefixo === 3022) {
      xml.document.section.context.extension.condition.action.push({
        $application: "bridge",
        $data: `{absolute_codec_string=^^:G729}sofia/internal/$1`,
      });
    } else {
      xml.document.section.context.extension.condition.action.push({
        $application: "bridge",
        $data: `{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/astpp/${prefixo}$1`,
      });
    }
  } else if (typeof prefixo === "number") {
    if (itemPrefixo === 3022) {
      xml.document.section.context.extension.condition.action.push({
        $application: "bridge",
        $data: `{absolute_codec_string=^^:G729}sofia/internal/$1`,
      });
    } else {
      xml.document.section.context.extension.condition.action.push({
        $application: "bridge",
        $data: `{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/astpp/${prefixo}$1`,
      });
    }
  }

  return jxon.jsToString(xml);
};

module.exports = {
  notFound,
  generateOutboundRoute,
};
