const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.from + this.to + this.amount).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.from) {
      throw new Error('You cannot sign transactions for other wallets');
    }
    const hashTransaction = this.calculateHash();
    const sign = signingKey.sign(hashTransaction, 'base64');
    this.signature = sign.toDER('hex');
  }
  isCorrectlySigned() {
    if (this.from == null) {
      return true;
    }
    //check if there is a signature
    if (!this.signature || this.signature.length === 0) {
      throw new Error('Transaction not signed');
    }
    //verify that the transaction has been signed
    const publicKey = ec.keyFromPublic(this.from, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

module.exports.Transaction = Transaction;