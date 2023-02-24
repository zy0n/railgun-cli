const { ChainType } = require("@railgun-community/shared-models");
const { BigNumber, utils } = require("ethers");

const networkConfig = {
  ethereum: {
    name: "Ethereum",
    type: ChainType.EVM,
    chainId: 1,
    providers: [
      {
        provider: "https://rpc.ankr.com/eth",
        priority: 1,
        weight: 1,
      },
      {
        provider: "https://cloudflare-eth.com/",
        priority: 2,
        weight: 1,
      },
    ],
  },
  polygon: {
    name: "Polygon",
    type: ChainType.EVM,
    chainId: 137,
    providers: [
      {
        provider: "https://rpc.ankr.com/polygon",
        priority: 1,
        weight: 1,
      },
      {
        provider: "https://polygon-rpc.com",
        priority: 2,
        weight: 1,
      },
      {
        provider: "https://rpc-mainnet.maticvigil.com",
        priority: 3,
        weight: 1,
      },
    ],
  },
};

function serializeObject(obj) {
  for (let prop in obj) {
    if (typeof obj[prop] === "object") {
      serializeObject(obj[prop]);
    } else {
      obj[prop] = `${obj[prop]}`;
    }
  }
  return obj;
}

const formatAmount = (obj) => {
  obj.amountString = utils.formatEther(BigNumber.from(obj.amountString));
  return obj;
};

function generateReport(items) {
  return items?.map((item) => {
    const output = {};
    output.txid = item.txid;
    for (let prop in item) {
      typeof item[prop] == "object" && item[prop].length > 0
        ? (output[prop] = item[prop].map(formatAmount))
        : null;
    }
    output.version = item.version;
    return output;
  });
}

module.exports = {
  networkConfig,
  serializeObject,
  generateReport,
};
