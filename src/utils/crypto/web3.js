const Web3 = require('web3');
const config = require('../default');
const providerUrl = config.WEB3_PROVIDER;
const web3 = new Web3(providerUrl);

export {
  Web3,
  providerUrl,
  web3,
};
