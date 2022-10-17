# Blockchain_JS
![Language](https://img.shields.io/badge/Language-Javascript-blue)
[![Visual Studio](https://badgen.net/badge/icon/visualstudio?icon=visualstudio&label)](https://code.visualstudio.com/)
[![Npm](https://badgen.net/badge/icon/npm?icon=npm&label)](https://https://npmjs.com/)
![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)

Welcome. My name is Jimmy and I have written a simple blockchain
in Javascript. The project uses Node.js to run. The blockchain has
mining implemented so it can create new blocks that is added to it
through proof of work.

Let's go over the code structure. There are five classes in this project.
- class Transaction
```
The Transaction takes a fromAdress and a toAdress and the amount
to be sent. Every Transaction is signed with the private key of
the sender.
```
- class Block
```
The Block instance stores Transactions that has been added to it.
A Block can be mined. Mining exists too prove that you have done work
(proof of work) by hashing the whole Block with sha256 and finding
a hash that begins with enough zeros. The amount of zeros depends
on the current mining difficulty.
```
- class Blockchain
```
The Blockchain instance stores Blocks that has been added to it.
Every block is bound together by having the hash stored of
the previous Block in the Blockchain.
```
- class Wallet
```
The Wallet instance contains a private key and a public key.
It is referred to as a key pair. The public key is derived from the
private key trhough elliptic curve calculations.
A Wallet contains a certain amount of coins tied to the key pair.
```

- class TestsManager
```
Class to manage the automatic testing for this project.
Run a single test or call the function 'run_all_tests()'.
```
``` JS
// TestsManager runs the bug checking tests designed for this project.
const myTestManager = new TestsManager();
myTestManager.run_all_tests();
```

# EXAMPLE
How to use? First import packages.

``` JS
import { Wallet } from './wallet.js';
import { Transaction, Block, Blockchain } from './blockchain.js';
import { createStringOfZeros } from './utils.js';
import crypto from 'crypto';
import EC from 'elliptic';
const ec_secp256k1 = new EC.ec('secp256k1');
```

A Bitcoin private key in hexadecimal is 64 characters long. Define three of those.
The Bitcoin public key is generated from the private key.
``` JS
const key_priv_a = "28CA6A9D397CA4C49A2BB9E7A5593548EBB1E9ABC6C93E859A42BC24A13D55FC";
const key_priv_b = "AD47604AD676051E20ABBA120ED9B65BE6BFC2E12A1653006DC051EB4BF952D0";
const key_priv_c = "B85FB30574D787F009D61C02C9C4C59C5BE77232D93A6326E83FA3D4B6958C0D";
```

A wallet stores the private key and the public key.
Create three wallets from the private keys above.
``` JS
const wallet_a = new Wallet();
wallet_a.rebuildFromPrivateKey(key_priv_a);
const wallet_b = new Wallet();
wallet_b.rebuildFromPrivateKey(key_priv_b);
const wallet_c = new Wallet();
wallet_c.rebuildFromPrivateKey(key_priv_c);
```
Now create an instance of the Blockchain.
After it is created we validate its state.
``` JS
const myBlockChain = new Blockchain(wallet_a.getKeyPair());
myBlockChain.validateState();
```
Now we create some Transactions. They need to be signed with our private key.
After they are signed they can be added to the Blockchain queue of
pending Transactions.
``` JS
let tx01_Amount = 10;
let tx02_Amount = 20;
const tx01 = new Transaction(wallet_a.getPublicKey(), wallet_b.getPublicKey(), tx01_Amount);
tx01.signTransaction(wallet_a.getKeyPair());
myBlockChain.addTransaction(tx01);
const tx02 = new Transaction(wallet_a.getPublicKey(), wallet_c.getPublicKey(), tx02_Amount);
tx02.signTransaction(wallet_a.getKeyPair());
myBlockChain.addTransaction(tx02);
```
To mine the pending transactions of a Blockchain we call
the function minePendingTransactions() After the mining is done we validate
the blockchain to see if all went okay.
``` JS
myBlockChain.minePendingTransactions(wallet_a.getKeyPair()); // block 1
myBlockChain.validateState();
```
If we want to see the balance of a wallet we call the function getBalanceOfAddress().
``` JS
// console balances
let balance_a = myBlockChain.getBalanceOfAddress(wallet_a.getPublicKey());
console.log("balance_a: " + balance_a);
```

This is the general workings of this project.


# CONTACT
Any questions feel free to email me at:

web3devjimmy@gmail.com

![Language](https://img.shields.io/badge/Language-Javascript-blue)
![Language](https://img.shields.io/badge/Language-HTML-green)
![Language](https://img.shields.io/badge/Language-CSS-red)
![Language](https://img.shields.io/badge/Language-Python-yellow)
![Language](https://img.shields.io/badge/Language-C++-green)
