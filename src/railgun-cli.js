require('dotenv').config()
const fs = require("fs");
const crypto = require("crypto");
const LevelDOWN = require("leveldown");
var argv = require("minimist")(process.argv.slice(2));

const {
  ArtifactStore,
  loadProvider,
  startRailgunEngine,
  createRailgunWallet,
  fullWalletForID,
  loadWalletByID,
  getWalletTransactionHistory,
  setOnBalanceUpdateCallback,
  closeRailgunEngine,
} = require("@railgun-community/quickstart");

const { 
  networkConfig, 
  serializeObject, 
  generateReport 
} = require('./utils');

const RAILGUN_DB = ".railgun.db";
const engineDb = new LevelDOWN(RAILGUN_DB);

const closeApp = () =>{
  closeRailgunEngine();
  process.exit(0);
}

const artifactStorage = new ArtifactStore(
  fs.promises.readFile,
  async (dir, path, data) => {
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(path, data);
  },
  fs.promises.fileExists
);

async function initializeEngine(chainName) {
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


  const initWalletId = process.env.RAILGUN_WALLET_ID;
  if(initWalletId){
    try {
      console.log('\n✨ Loading Existing Wallet')
      const result = await loadWalletByID(secretBytes, initWalletId, false);
      if(result.error) throw new Error(result.error)
      return result;
    } catch (error) {
      if(error.message.includes('Unable to decrypt ciphertext.')){
        console.log('\n💥 Invalid Password for Wallet ID.')
      } else {
        console.log(error.message)
      }
      closeApp()
    }
  }
  const result = await createRailgunWallet(secretBytes, mnemonic);
  if(result.error){
    console.log(result.error);
    closeApp();
  }
  fs.appendFileSync('.env', `\nRAILGUN_WALLET_ID='${result.railgunWalletInfo.id}'`)
  return result;
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
    closeApp();
  });
}

async function main() {
  console.log("\n");
  if (!argv.mnemonic && !process.env.RAILGUN_MNEMONIC && !process.env.RAILGUN_WALLET_ID) {
    console.log(
      `Error:\nPlease enter a mnemonic using flag --mnemonic 'mnemonic phrase'\n\nExample: railgun-cli --pass secretpassword --mnemonic='dog fish cat duck turkey'\n\n`
    );
    return;
  }
  const mnemonic = process.env.RAILGUN_MNEMONIC || argv.mnemonic;
  if (!argv.pass && !process.env.RAILGUN_PASSWORD) {
    console.log(
      `Error:\nPlease enter a password using flag --pass [password]\n\nExample: railgun-cli --pass secretpassword --mnemonic='dog fish cat duck turkey'\n\n`
    );
    return;
  }
  const password = process.env.RAILGUN_PASSWORD || argv.pass;

  let chain = (process.env.RAILGUN_CHAIN || argv.chain) || "ethereum";

  console.log(`Scanning ${chain.toUpperCase()} Chain!`)
  const currentChain = await initializeEngine(chain);
  const { railgunWalletInfo, error } = await initializeWallet(
    password,
    mnemonic
  );
  if(error){
    console.log("💥 Error Initializing.");
    closeApp();
    return;
  }
  await fetchHistory(railgunWalletInfo, currentChain);
}
main();
