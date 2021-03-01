# How To Use

In the server directory, run 'npm install' to get necessary dependencies. Then
run 'npm run download-contracts' in order to download popular smart contracts
that our app will compare other contracts to. Then run 'npm run start' to start
the server listening on port 8000.

All of the features are not implemented yet, however the application will log
some similarity metrics between contracts. This program takes a hierarchical
approach to determining the origin of smart contract code. First it looks at all
of the contracts in two projects and checks to see if there is significant 
overlap. If so, the contract then looks at each individual contract that project
and compares it to our candidate contract in order to determine if this smart
contract code could have potentially have been forked. Currently all output is
logging statements.