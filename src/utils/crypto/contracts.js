/* eslint-disable quote-props */
/* eslint-disable max-len */
const { web3 } = require('./web3');
const punksContractAbi = require('./abis/PunksContract.json');
const config = require('../default');

const punksContractAddress = config.PUNKS_OWNER.CONTRACT_ADDRESS;
const punksAbiContract = new web3.eth.Contract(punksContractAbi, punksContractAddress);

export const punksContract = {
  address: punksContractAddress,
  contractAbi: punksContractAbi,
  contract: punksAbiContract
};
