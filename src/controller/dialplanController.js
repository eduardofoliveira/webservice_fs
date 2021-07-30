const jxon = require("jxon");

const DirectoryRepository = require("../repository/directoryRepository");
const DomainRepositoryMysql = require("../repository/domainRepositoryMysql");
const { buscarOperadoraPrefixo } = require("../repository/operadoraRepositoy");
const { generateOutboundRoute, notFound } = require("../util/xmlGenerator");
const { getCallType } = require("../util/call");

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
      (context === "public" && fromHost === "centrex.brastel.com.br") ||
      (context === "public" && fromHost === "54.207.81.171")
    ) {
      const type = getCallType({ to });
      const prefixo = await buscarOperadoraPrefixo({ fromDID: from });
      let xml = null;

      if (!prefixo) {
        xml = notFound();
        res.set("Content-Type", "text/xml");
        return res.send(xml);
      } else {
        if (type.type === "movel") {
          xml = generateOutboundRoute({
            from,
            to,
            prefixo: [3022, 3027, prefixo],
          });
        }
        if (type.type === "fixo") {
          if (prefixo === 3027) {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo: [prefixo, 3012],
            });
          } else {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo,
            });
          }
        }
        if (type.type === "4002" || type.type === "4003") {
          if (prefixo === 3027) {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo: [prefixo, 3012],
            });
          } else {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo,
            });
          }
        }
        if (type.type === "0800") {
          if (prefixo === 3027) {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo: [prefixo, 3012],
            });
          } else {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo,
            });
          }
        }
        if (type.type === "0300") {
          if (prefixo === 3027) {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo: [prefixo, 3012],
            });
          } else {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo,
            });
          }
        }
        if (type.type === "não determinado") {
          if (prefixo === 3027) {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo: [prefixo, 3012],
            });
          } else {
            xml = generateOutboundRoute({
              from,
              to,
              prefixo,
            });
          }
        }

        res.set("Content-Type", "text/xml");
        return res.send(xml);
      }
    }

    //
    // Chamadas recebida do Basix para um dominio que esteja habilitado
    //
    if (context === "public" && listDomains.includes(fromHost)) {
      const xmlText = `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${context}">
              <extension name="${from}-${to}">
                <condition field="destination_number" expression="^(${to})$">
                  <action application="transfer" data="$1 XML ${fromHost}"/>
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
      listDomains.includes(fromHost) &&
      listaRamais[fromHost].map((item) => item.USERNAME).includes(to)
    ) {
      // console.log(
      //   "Chamadas que foram transferidas do contexto public para um contexto interno destinadas a ramais"
      // );
      // console.log({
      //   context,
      //   from,
      //   fromHost,
      //   to,
      //   toHost,
      // });

      let RAMAL = listaRamais[fromHost].find(
        (item) => item.USERNAME === from
      ).RAMAL;
      let NAME = listaRamais[fromHost].find(
        (item) => item.USERNAME === from
      ).NAME;

      if (!RAMAL) {
        RAMAL = from;
        NAME = from;
      }

      const xmlText = `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${context}">
              <extension name="${from}-${to}">
                <condition field="destination_number" expression="^(${to})$">
                  <action application="set" data="effective_caller_id_number=${RAMAL}"/>
                  <action application="set" data="effective_caller_id_name=${NAME}"/>
                  <action application="bridge" data="user/${to}@${context}"/>
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
    if (section === "dialplan" && listDomains.includes(fromHost)) {
      const xmlText =
        `
        <document type="freeswitch/xml">
          <section name="dialplan" description="RE Dial Plan For FreeSwitch">
            <context name="${variable_sip_to_host}">
              <extension name="${from}-${to}">
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
