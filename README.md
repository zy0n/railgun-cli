# <p style="text-align: center; font-size: 88px">railgun-cli</p>

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

This is a basic implementation for pulling Transaction History and current RAILGUNB balances from the RAILGUN Relays. 


🍻 A full transaction history will be saved locally for double checking your balances and transactions. 

⛔️ No transactions will be made!

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

Okay so its relatively simple. You only need your mnemonic.
#####Usage Flags:
```sh

 --mnemonic 'YOUR_MNEMONIC_PHRASE' # Mnemonic Must be quoted.
 --pass SECRET_PASSWORD
 --chain ethereum #OPTIONALPARAM| 
 # Default: ethereum    - Choices: [ethereum, polygon] 

```
Example Usage:
**Do NOT load funds into the example mnemonic. This was pulled from the RAILGUN mocks. It's a good example to use here, as it has available transaction history on polygon to view.**

*Be sure make sure you're in the main directory.*
#####yarn
```sh
yarn start --mnemonic 'pause crystal tornado alcohol genre cement fade large song like bag where' --pass SomethingSecret --chain polygon
```

#####node
```sh
node src/railgun-cli.js --mnemonic 'pause crystal tornado alcohol genre cement fade large song like bag where' --pass SomethingSecret --chain polygon
```


## Todo: <a name = "todo"></a>
- [ ] Get the binaries to build properly.
- [ ] Add support for the rest of the available chains.
- [ ] Add support for loading existing stored wallets.
- [ ] Add support for handling transactions ? 
[ 🎱 ] Suggestions??

######As of right now building with PKG is failing to produce a running executable. Which in reality, i didnt want to provide executables anyway, but its nice for you to build them still!

#Feel free to fork & contribute!

###🍻 Cheers for Donations!
*If you like my work and would like to help me keep on keepin' on those options are below. Thanks!!*
Definitely not a requirement 💋
👁️ Public (unshielded): 
```sh
0xD74b78AA69d9ee3e232beEE935025530E4d7080d
```
🛡️ Private (shielded):
```sh
0zk1qywazlck3dsmxkhx7vswfkf0zyuhguna79f87cpqad6wlu3d74plrrv7j6fe3z53laqmr4aeh35unfg67etsksd80qj2pvf9r6egpyyhnh56qe9nntmevq6yu6u
```
