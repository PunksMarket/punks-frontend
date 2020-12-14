const config = {
  WEB3_PROVIDER: process.env.REACT_APP_WEB3_PROVIDER,
  PUNKS_OWNER: {
    CONTRACT_ADDRESS: process.env.REACT_APP_PUNKS_CONTRACT_ADDRESS
  },
  decimals: 18,
};

module.exports = config;
