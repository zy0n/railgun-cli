const { ChainType } = require("@railgun-community/shared-models");
const { BigNumber, Wallet, utils, Contract, providers } = require("ethers");

function getAddressFromMnemonic(mnemonic) {
  const path = "m/44'/60'/0'/0/0"; // the derivation path
  const wallet = Wallet.fromMnemonic(mnemonic, path);
  return wallet.address;
}

const readableAmounts = async (tokenBalances, chainName) => {
  const providerURL = networkConfig[chainName].providers[0].provider;
  const provider = new providers.JsonRpcProvider(providerURL);
  const result = Promise.all(
    tokenBalances.map(async (balance) => {
      const privateBalance = balance;
      const contract = new Contract(
        balance.tokenAddress,
        [
          "function symbol() view returns (string)",
          "function decimals() view returns (uint8)",
        ],
        provider
      );
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      const decimalAmount = BigNumber.from(10).pow(decimals);
      const converted =
        decimals === 18
          ? utils.formatEther(
              BigNumber.from(balance.amountString).toHexString()
            )
          : BigNumber.from(balance.amountString).div(decimalAmount);
      privateBalance.amountReadable = converted.toString(); // utils.formatEther(converted.toString());
      privateBalance.symbol = symbol;
      return privateBalance;
    })
  );
  return result;
};

const getTokenInfo = (address, provider) => {};

const networkConfig = {
  ethereum: {
    name: "Ethereum",
    type: ChainType.EVM,
    chainId: 1,
    blockscan: "https://etherscan.io/address/",
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
    blockscan: "https://polygonscan.com/address/",
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
  binance: {
    name: "BNB_Chain",
    type: ChainType.EVM,
    chainId: 56,
    blockscan: "https://bscscan.com/address/",
    providers: [
      {
        provider: "https://bsc-dataseed1.binance.org",
        priority: 1,
        weight: 1,
      },
      {
        provider: "https://bsc-dataseed2.binance.org",
        priority: 2,
        weight: 1,
      },
      {
        provider: "https://bsc-dataseed3.binance.org",
        priority: 3,
        weight: 1,
      },
    ],
  },
  arbitrum: {
    name: "Arbitrum",
    type: ChainType.EVM,
    chainId: 42161,
    blockscan: "https://arbiscan.io/address/",
    providers: [
      {
        provider: "https://rpc.ankr.com/arbitrum",
        priority: 1,
        weight: 1,
      },
      {
        provider: "https://arbitrumrpc.com",
        priority: 2,
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
  obj.amountString = BigNumber.from(obj.amountString).toString();
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
  getAddressFromMnemonic,
  readableAmounts,
};
