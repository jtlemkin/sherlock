# How To Use

## Installation
1. In the server directory, run 'npm install' to get necessary dependencies. 
2. If desired you can add contracts to contracts.txt in the form of <OWNER>/
<PROJECT>. This contract will then be used by the app as a reference to determine
if forking occured.
3. Run 'npm run download-contracts' in order to download popular smart contracts
that our app will compare other contracts to
4. Run 'npm run start' to start
the server listening on port 8000.

## Usage
The project currently only retrieves contract source code from etherscan. 
1. On a Etherscan project, go to the contract tab and copy the contract ID.
2. Go to http://localhost:8000/contract/<CONTRACT_ID>

ex. http://localhost:8000/contract/0xDA6Ba41F79db7226fe6411690CEAfC77504EfDCE

There are still many features not implemented yet. This program takes a 
hierarchical approach to determining the origin of smart contract code. First it
looks at all of the contracts in two projects and checks to see if there is 
significant overlap. If so, the contract then looks at each individual contract
that project and compares it to our candidate contract in order to determine if
this smart contract code could have potentially have been forked. Currently all
output is logging statements.