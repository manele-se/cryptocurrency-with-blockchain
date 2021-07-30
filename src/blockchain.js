const SHA256 = require('crypto-js/sha256');
const { Transaction } = require('./transaction');
const chalk = require('chalk');

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  //proof of work
  mineBlock(difficulty) {
    //the hash will start with some amount of zeros which is equal to a certain difficulty
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(chalk.green("Block mined: ") + this.hash);
  }

  hasValidTransactions() {
    for (const trans of this.transactions) {
      if (!trans.isCorrectlySigned()) {
        return false;
      }
    }
    return true;
  }
}

class Blockchain {
  constructor(difficulty, reward) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty; //from command line
    this.pendingTransactions = [];
    this.miningReward = reward; //from command line
  }

  createGenesisBlock() {
    return new Block(new Date(), "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  //if the minor successfully mines a block the reward is sent to their address.
  minePendingTransaction(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward, this.amount)
    ];
  }

  addTransaction(transaction) {
    if (!transaction.from || !transaction.to) {
      throw new Error('The transaction must inclute from and to address');
    }
    if (!transaction.isCorrectlySigned()) {
      throw new Error('The transaction cannot be added because invalid');
    }
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    //loop over each block
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.from === address) {
          //reduce the balance if your transfer money
          balance -= trans.amount;
        }
        if (trans.to === address) {
          //increase balance if money are transfered to you
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  //validate the blockchain
  isBlockchainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }
      //checck if the hash of the current block is valid
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      //check if the previous block is correct
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    //valid chain 
    return true;
  }
}

module.exports.Blockchain = Blockchain;