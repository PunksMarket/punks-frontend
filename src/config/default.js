const config = {
  WEB3_PROVIDER: process.env.REACT_APP_WEB3_PROVIDER || 'https://ropsten.infura.io/v3/608777ea4b3343e291b5ec70d42f2214',
  PUNKS_OWNER: {
    CONTRACT_ADDRESS: '0x3ae04AE3D54B6B84f3d520487B6b21A7F34D29EF'//'0xD5e6ebaB94c5eA8fd3CF09b44e53Bcbbd41633B2'//process.env.REACT_APP_PUNKS_CONTRACT_ADDRESS
  },
  decimals: 18,
};

module.exports = config;
