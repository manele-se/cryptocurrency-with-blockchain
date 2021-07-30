
/* Simple implementation of a cryptocurrency with blockchain. 
To activate the program type:  'node main.mjs' in the terminal */


const { Blockchain } = require('./blockchain');
const { Transaction } = require('./transaction');
const chalk = require('chalk');
const program = require('commander');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


//initialise keys
const myKey = ec.keyFromPrivate('72a2534872f5257962fc2b3fa8da5cfd5d6be12e7c3910ddacc0d76ec9db6e06');
const myWalletAddress = myKey.getPublic('hex');


program.version('0.0.1').description('Cryptocurrency mining');

program
  .option('-d, --difficulty <number>', 'difficulty of cryptomining', '4')
  .option('-r, --reward <number>', 'set the reward for 1 coin', '20')
  .parse();

const { difficulty, reward } = program.opts()
//create a new coin
let eleCoin = new Blockchain(parseInt(difficulty), parseFloat(reward));



//starting mining and transaction
console.log('\nStarting mining ...');
while (true) {
  eleCoin.minePendingTransaction(myWalletAddress);
  const trans = new Transaction(myWalletAddress, ec.genKeyPair().getPublic(), Math.random() * reward * 2);
  trans.signTransaction(myKey);
  eleCoin.addTransaction(trans);
  console.log(chalk.magenta('Balance is: ' + eleCoin.getBalanceOfAddress(myWalletAddress).toFixed(2) + ' EC'));
}



