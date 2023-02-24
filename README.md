# <p style="text-align: center; font-size: 88px">railgun-cli</p>

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Todo](#todo)

## About <a name = "about"></a>

This is a basic implementation for local verification of Transaction History and current RAILGUN balances from the RAILGUN Relays.

🍻 A full transaction history will be saved locally for double checking your balances and transactions.

⛔️ No transactions will be made!

###### Reminder that the information output from this application within reports directory should be considered private information and treated as such. This folder is essentially a roadmap of your private transactions.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them.

```
NodeJS
npm (or) yarn
```

### Installing

Some basic instructions on how to get the project operational.

##### Clone the repo:

```sh
git clone https://github.com/zy0n/railgun-cli
```

##### Enter the Repo

```sh
cd railgun-cli
```

##### Install Dependencies:

```
npm install
or
yarn install
```

End with an example of getting some data out of the system or using it for a little demo.

## Usage <a name = "usage"></a>

Okay so its relatively simple.

- Required:
  - Mnemonic
  - Password

##### Usage Flags:

```sh

 --mnemonic 'YOUR_MNEMONIC_PHRASE' # Mnemonic Must be quoted.
 --pass SECRET_PASSWORD
 --chain ethereum #OPTIONALPARAM|
 # Default: ethereum    - Choices: [ethereum, polygon]

```

.env file usage (optional)

```sh
# example.env file. rename this to .env in the project root directory.
RAILGUN_MNEMONIC='pause crystal tornado alcohol genre cement fade large song like bag where'
RAILGUN_PASSWORD='SomethingSuperSecret'
RAILGUN_CHAIN='polygon'

# Auto-Generated, If not already present.
# If present it looks for the wallet ID stored, and uses the password to decrypt.
# You can store these ID's for reference and recall the wallet later on with the correct password.
RAILGUN_WALLET_ID='6e4b85e0bf1fc2a3a3a0c23582c5f76fba68b237e2dfe2973fa3c0f21b8598b6'
```

##### After the first run:

###### You can remove the mnemonic once the first run has been completed. Your wallet info is cryptographically stored within the .railgun.db file. This provides the ability to reload your existing state with the correct password & start polling again from there.

## Example Usage:

**Do NOT load funds into the example mnemonic. This was pulled from the RAILGUN mocks. It's a good example to use here, as it has available transaction history on polygon to view.**

_Be sure you're in the main directory._

##### yarn

```sh
yarn start --mnemonic 'pause crystal tornado alcohol genre cement fade large song like bag where' --pass SomethingSecret --chain polygon
```

##### node

```sh
node src/railgun-cli.js --mnemonic 'pause crystal tornado alcohol genre cement fade large song like bag where' --pass SomethingSecret --chain polygon
```

##### [.env usage]

```sh
yarn start
node src/railgun-cli.js
```

## Todo: <a name = "todo"></a>

- [ ] Get the binaries to build properly.
- [x] Add support for the rest of the available chains.
- [x] ~~Add support for loading existing stored wallets~~.
- [ ] Add support for handling transactions ?

[ 🎱 ] Suggestions??

###### As of right now building with PKG is failing to produce a running executable. Which in reality, i didnt want to provide executables anyway, but its nice for you to build them still!

# Feel free to fork & contribute!

### 🍻 Cheers for Donations! <a name = "donate"></a>

_If you like my work and would like to help me keep on keepin' on those options are below. Thanks!!_

Definitely not a requirement 💋

👁️ Public (unshielded):

```sh
0xD74b78AA69d9ee3e232beEE935025530E4d7080d
```

🛡️ Private (shielded):

```sh
0zk1qywazlck3dsmxkhx7vswfkf0zyuhguna79f87cpqad6wlu3d74plrrv7j6fe3z53laqmr4aeh35unfg67etsksd80qj2pvf9r6egpyyhnh56qe9nntmevq6yu6u
```
