//generate private and public key to sign transactions and verify balance
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const priviteKey = key.getPrivate('hex');

console.log('private key:' + priviteKey);
console.log('public key:' + publicKey);