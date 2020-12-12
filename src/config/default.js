const config = {
  WEB3_PROVIDER: process.env.REACT_APP_WEB3_PROVIDER || 'https://ropsten.infura.io/v3/608777ea4b3343e291b5ec70d42f2214',
  PUNKS_OWNER: {
    CONTRACT_ADDRESS: process.env.REACT_APP_PUNKS_CONTRACT_ADDRESS
  },
  decimals: 18,
};

module.exports = config;
