const fs = require("fs");
const crypto = require("crypto");
const { BigNumber, utils } = require("ethers");
const LevelDOWN = require("leveldown");
var argv = require("minimist")(process.argv.slice(2));

const {
  ArtifactStore,
  loadProvider,
  startRailgunEngine,
  createRailgunWallet,
  fullWalletForID,
  getWalletTransactionHistory,
  setOnBalanceUpdateCallback,
  closeRailgunEngine,
} = require("@railgun-community/quickstart");

const { ChainType } = require("@railgun-community/shared-models");

const RAILGUN_DB = ".railgun.db";

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
}

function generateReport(items) {
  return items?.map(item => {
    const output = {}
    output.txid = item.txid;
    item.transferERC20Amounts.length > 0 ? output.transferERC20Amounts = item.transferERC20Amounts.map(formatAmount) : null;
    item.changeERC20Amounts.length > 0 ? output.changeERC20Amounts = item.changeERC20Amounts.map(formatAmount) : null;
    item.receiveERC20Amounts.length > 0 ? output.receiveERC20Amounts = item.receiveERC20Amounts.map(formatAmount) : null;
    item.unshieldERC20Amounts.length > 0 ? output.unshieldERC20Amounts = item.unshieldERC20Amounts.map(formatAmount) : null;
    item.receiveNFTAmounts.length > 0 ? output.receiveNFTAmounts = item.receiveNFTAmounts.map(formatAmount) : null;
    item.transferNFTAmounts.length > 0 ? output.transferNFTAmounts = item.transferNFTAmounts.map(formatAmount) : null;
    item.unshieldNFTAmounts.length > 0 ? output.unshieldNFTAmounts = item.unshieldNFTAmounts.map(formatAmount) : null;
    output.version = item.version;
    return output;
  })
}

async function initializeEngine(chainName) {
  const engineDb = new LevelDOWN(RAILGUN_DB);
  const artifactStorage = new ArtifactStore(
    fs.promises.readFile,
    async (dir, path, data) => {
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(path, data);
    },
    fs.promises.fileExists
  );
  // initialize engine
  await startRailgunEngine(
    "railguncli",
    engineDb,
    false,
    artifactStorage,
    false,
    false
  );
  // initialize network
  await loadProvider(
    networkConfig[chainName],
    networkConfig[chainName].name,
    false
  );

  return {
    type: networkConfig[chainName].type,
    id: networkConfig[chainName].chainId,
  };
}

async function initializeWallet(password, mnemonic) {
  const salt = "Always Salt your Pizza!!👀";
  const secretBytes = crypto
    .createHash("sha256")
    .update(`${salt}:${password}`)
    .digest("hex");
  return await createRailgunWallet(secretBytes, mnemonic);
}

async function fetchHistory(walletInfo, chainInfo) {

  console.log(`RAILGUN zkAddress: ${walletInfo.railgunAddress}`)
  console.log("Fetching Transaction History 👀");
  const wallet = fullWalletForID(walletInfo.id);
  const balances = await wallet.balances(chainInfo);
  setOnBalanceUpdateCallback(async (tokenBalances) => {
    const _txHistory = await getWalletTransactionHistory(chainInfo, wallet.id);
    const txHistory = generateReport(_txHistory.items);
    console.log("🎱 Transactions Found:", _txHistory.items?.length);

    const fullTxData = serializeObject(balances);
    const outFile = JSON.stringify(
      { tokenBalances, txHistory, fullTxData },
      null,
      2
    );
    fs.writeFileSync("txdata.json", outFile);
    console.log(`Full report saved to: ${process.cwd()}/txdata.json`);
    closeRailgunEngine();
    
    process.exit(0);
  });
}

async function main() {
  console.log("\n");
  if (!argv.mnemonic) {
    console.log(
      `Error:\nPlease enter a mnemonic using flag --mnemonic 'mnemonic phrase'\n\nExample: railgun-cli --pass secretpassword --mnemonic='dog fish cat duck turkey'\n\n`
    );
    return;
  }
  const mnemonic = argv.mnemonic;
  if (!argv.pass) {
    console.log(
      `Error:\nPlease enter a password using flag --pass [password]\n\nExample: railgun-cli --pass secretpassword --mnemonic='dog fish cat duck turkey'\n\n`
    );
    return;
  }
  const password = argv.pass;
  let chain = argv.chain || "ethereum";
  const currentChain = await initializeEngine(chain);
  const { railgunWalletInfo, error } = await initializeWallet(
    password,
    mnemonic
  );
  if(error){
    console.log("💥 Error Initializing.");
    process.exit(0);
    return;
  }
  await fetchHistory(railgunWalletInfo, currentChain);
}
main();
