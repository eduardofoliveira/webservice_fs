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

const Anonymous =
  `
<extension name="terminacao-anonymous">
    <condition field="network_addr" expression="^18\\.217\\.251\\.102$"/>
    <condition field="caller_id_name" expression="^Anonymous$"/>
    <condition field="destination_number" expression="^(\\d{4,6})?(55\\d{2}\\d{8,9})$">

      <action application="sched_hangup" data="+10800 allotted_timeout"/>
      <action application="set" data="accountcode=anonymous"/>
      ` +
  '<action application="set" data="effective_caller_id_number=${sip_from_user:2}"/>' +
  `<action application="set" data="bridge_generate_comfort_noise=true"/>
  <action application="export" data="bridge_generate_comfort_noise=true"/>
  <action application="set" data="ringback=` +
  "${us-ring}" +
  `"/>
    <action application="set" data="instant_ringback=true"/>
    <action application="bridge" data="{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/astpp/3012$2"/> <!-- Datora -->
      <action application="respond" data="486"/>
    </condition>
  </extension>
`;

const generateOutboundRoute = ({ from, to, prefixo }) => {
  const xmlText =
    `
    <document type="freeswitch/xml">
      <section name="dialplan" description="RE Dial Plan For FreeSwitch">
        <context name="public">
        ${Anonymous}
          

          <extension name="${from}-${to}">
          <condition field="destination_number" expression="^3040(.*)$">` +
    '<action application="set" data="effective_caller_id_number=${sip_from_user:2}"/>' +
    '<action application="set" data="effective_caller_id_name=${sip_from_user:2}"/>' +
    `<action application="set" data="inherit_codec=true"/>
    <action application="set" data="bridge_generate_comfort_noise=true"/>
    <action application="export" data="bridge_generate_comfort_noise=true"/>
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
    xml.document.section.context.extension[1].condition.action.push({
      $application: "set",
      $data: `continue_on_fail=true`,
    });
    xml.document.section.context.extension[1].condition.action.push({
      $application: "set",
      $data: `hangup_after_bridge=true`,
    });

    for (let i = 0; i < prefixo.length; i++) {
      const itemPrefixo = prefixo[i];

      if (itemPrefixo === 3022) {
        // xml.document.section.context.extension.condition.action.push({
        //   $application: "set",
        //   $data: `bypass_media=true`,
        // });
        xml.document.section.context.extension[1].condition.action.push({
          $application: "bridge",
          $data: `sofia/internal/3041$1@54.207.81.171:5260`,
        });
        // xml.document.section.context.extension.condition.action.push({
        //   $application: "set",
        //   $data: `bypass_media=false`,
        // });
      } else if (itemPrefixo === 3029){
        xml.document.section.context.extension[1].condition.action.push({
          $application: "set",
          $data: "effective_caller_id_number=+${sip_from_user}",
        });
        xml.document.section.context.extension[1].condition.action.push({
          $application: "bridge",
          $data: `{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/astpp/${itemPrefixo}$1`,
        });
        xml.document.section.context.extension[1].condition.action.push({
          $application: "set",
          $data: "effective_caller_id_number=${sip_from_user:2}",
        });
        xml.document.section.context.extension[1].condition.action.push({
          $application: "sleep",
          $data: `1000`,
        });
      } else {
        xml.document.section.context.extension[1].condition.action.push({
          $application: "bridge",
          $data: `{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/astpp/${itemPrefixo}$1`,
        });
        xml.document.section.context.extension[1].condition.action.push({
          $application: "sleep",
          $data: `1000`,
        });
      }
    }
  } else if (typeof prefixo === "string") {
    xml.document.section.context.extension[1].condition.action.push({
      $application: "set",
      $data: `continue_on_fail=true`,
    });
    xml.document.section.context.extension[1].condition.action.push({
      $application: "set",
      $data: `hangup_after_bridge=true`,
    });

    if (prefixo === 3022) {
      // xml.document.section.context.extension.condition.action.push({
      //   $application: "set",
      //   $data: `bypass_media=true`,
      // });
      xml.document.section.context.extension[1].condition.action.push({
        $application: "bridge",
        $data: `sofia/internal/3041$1@54.207.81.171:5260`,
      });
      // xml.document.section.context.extension.condition.action.push({
      //   $application: "set",
      //   $data: `bypass_media=false`,
      // });
    } else {
      xml.document.section.context.extension[1].condition.action.push({
        $application: "bridge",
        $data: `{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/astpp/${prefixo}$1`,
      });
    }
  } else if (typeof prefixo === "number") {
    xml.document.section.context.extension[1].condition.action.push({
      $application: "set",
      $data: `continue_on_fail=true`,
    });
    xml.document.section.context.extension[1].condition.action.push({
      $application: "set",
      $data: `hangup_after_bridge=true`,
    });

    if (prefixo === 3022) {
      // xml.document.section.context.extension.condition.action.push({
      //   $application: "set",
      //   $data: `bypass_media=true`,
      // });
      xml.document.section.context.extension[1].condition.action.push({
        $application: "bridge",
        $data: `sofia/internal/3041$1@54.207.81.171:5260`,
      });
      // xml.document.section.context.extension.condition.action.push({
      //   $application: "set",
      //   $data: `bypass_media=false`,
      // });
    } else {
      xml.document.section.context.extension[1].condition.action.push({
        $application: "bridge",
        $data: `{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/astpp/${prefixo}$1`,
      });
    }
  }

  return jxon.jsToString(xml);
};

const generateOutboundRouteToBasix = ({ from, to }) => {
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
    <action application="export" data="bridge_generate_comfort_noise=true"/>
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

  xml.document.section.context.extension.condition.action.push({
    $application: "bridge",
    $data: `sofia/internal/3050$1@54.207.81.171:5260`,
  });

  return jxon.jsToString(xml);
};

module.exports = {
  notFound,
  generateOutboundRoute,
  generateOutboundRouteToBasix,
};
