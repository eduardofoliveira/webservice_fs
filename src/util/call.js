const getCallType = ({ to }) => {
  if (/^(\d{4,5})?55(0300\d{7})$/.test(to)) {
    const [, prefix, number] = to.toString().match(/^(\d{4,5})?55(0300\d{7})$/);

    return {
      type: "0300",
      prefix,
      number: `55${number}`,
    };
  }

  if (/^(\d{4,5})?55(0800\d{7})$/.test(to)) {
    const [, prefix, number] = to.toString().match(/^(\d{4,5})?55(0800\d{7})$/);

    return {
      type: "0800",
      prefix,
      number: `55${number}`,
    };
  }

  if (/^(\d{4,5})?55(\d{2})(4002\d{4})$/.test(to)) {
    const [, prefix, ddd, number] = to
      .toString()
      .match(/^(\d{4,5})?55(\d{2})(4002\d{4})$/);

    return {
      type: "4002",
      prefix,
      ddd,
      number: `55${ddd}${number}`,
    };
  }

  if (/^(\d{4,5})?55(\d{2})(4003\d{4})$/.test(to)) {
    const [, prefix, ddd, number] = to
      .toString()
      .match(/^(\d{4,5})?55(\d{2})(4003\d{4})$/);

    return {
      type: "4003",
      prefix,
      ddd,
      number: `55${ddd}${number}`,
    };
  }

  if (/^(\d{4,5})?55(\d{2})(\d{8})$/.test(to)) {
    const [, prefix, ddd, number] = to
      .toString()
      .match(/^(\d{4,5})?55(\d{2})(\d{8})$/);

    return {
      type: "fixo",
      prefix,
      ddd,
      number: `55${ddd}${number}`,
    };
  }

  if (/^(\d{4,5})?55(\d{2})(9\d{8})$/.test(to)) {
    const [, prefix, ddd, number] = to
      .toString()
      .match(/^(\d{4,5})?55(\d{2})(9\d{8})$/);

    return {
      type: "movel",
      prefix,
      ddd,
      number: `55${ddd}${number}`,
    };
  }

  return {
    type: "não determinado",
    number: to,
  };
};

module.exports = {
  getCallType,
};
