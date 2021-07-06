const jxon = require("jxon");
const DirectoryRepository = require("../repository/directoryRepository");
const DomainRepositoryMysql = require("../repository/domainRepositoryMysql");
const { buscarOperadoraPrefixo } = require("../repository/operadoraRepositoy");

let listaRamais = {};
let listDomains = [];

module.exports = {
  async index(req, res) {
    const {
      section,
      // variable_user_name,
      // variable_domain_name,
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

    //
    // Busca os dominios que estão habilitados
    //
    if (listDomains.length === 0) {
      const domainRepositoryMysql = new DomainRepositoryMysql();
      let domains = await domainRepositoryMysql.getActiveDomains();
      domains = domains.map((item) => item.domain);

      listDomains = domains;
    }

    //
    // Verifica se a lista de ramais de um dominio esta em cache, caso não esteja irá buscar do banco Oracle
    //

    if (listDomains.includes(toHost) && listaRamais[toHost] === undefined) {
      const directoryRepository = new DirectoryRepository();
      const listExtensions = await directoryRepository.getUserNameExtensionList(
        {
          domain: toHost,
        }
      );

      listaRamais[toHost] = listExtensions;
      console.log(listaRamais);
    }

    //
    // Chamadas recebida do Basix para terminação
    //
    if (
      callerContext === "public" &&
      variable_sip_from_host === "centrex.brastel.com.br"
    ) {
      const prefixo = await buscarOperadoraPrefixo({ fromDID: from });

      const xmlText =
        `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="public">
              <extension name="${variable_sip_from_user}-${variable_sip_to_user}">
                <condition field="destination_number" expression="^3040(.*)$">
                  <action application="set" data="effective_caller_id_number=` +
        "${sip_from_user:2}" +
        `"/>
                  <action application="bridge" data="{absolute_codec_string=^^:PCMU:PCMA}sofia/gateway/astpp/${prefixo}$1"/>
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
    // Chamadas recebida do Basix para um dominio que esteja habilitado
    //
    if (
      callerContext === "public" &&
      listDomains.includes(variable_sip_from_host)
    ) {
      const xmlText = `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${callerContext}">
              <extension name="${variable_sip_from_user}-${variable_sip_to_user}">
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
    // Chamadas que foram transferidas do contexto public para um contexto interno destinadas a ramais
    //
    if (
      listDomains.includes(variable_sip_from_host) &&
      listaRamais[variable_sip_from_host]
        .map((item) => item.USERNAME)
        .includes(variable_sip_to_user)
    ) {
      const xmlText = `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${callerContext}">
              <extension name="${variable_sip_from_user}-${variable_sip_to_user}">
                <condition field="destination_number" expression="^(${variable_sip_to_user})$">
                  <action application="set" data="effective_caller_id_number=${
                    listaRamais[variable_sip_from_host].find(
                      (item) => item.USERNAME === variable_sip_from_user
                    ).RAMAL
                  }"/> <action application="set" data="effective_caller_id_name=${
        listaRamais[variable_sip_from_host].find(
          (item) => item.USERNAME === variable_sip_from_user
        ).NAME
      }"/>
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

    //
    // Chamadas externas
    //
    if (
      section === "dialplan" &&
      listDomains.includes(variable_sip_from_host)
    ) {
      const xmlText =
        `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${variable_sip_to_host}">
              <extension name="${variable_sip_from_user}-${variable_sip_to_user}">
                <condition field="destination_number" expression="^(.*)$">
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
    // Caso não seja nenhum dos tipos acima é retornado 404 not found
    //
    const xmlText = `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <result status="not found" />
          </section>
        </document>
        `;

    let xml = jxon.stringToJs(xmlText);
    res.set("Content-Type", "text/xml");
    return res.send(jxon.jsToString(xml));
  },
};
