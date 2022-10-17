# Blockchain_JS

Welcome. My name is Jimmy and I have written a simple blockchain
in Javascript. The project uses Node.js to run. The blockchain has
mining implemented so it can create new blocks that is aded to it
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
A Block can be mined. Mining is too prove you have done work
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

A wallet stores the private key and the public key. Create three wallets from the private keys above.
``` JS
const wallet_a = new Wallet();
wallet_a.rebuildFromPrivateKey(key_priv_a);
const wallet_b = new Wallet();
wallet_b.rebuildFromPrivateKey(key_priv_b);
const wallet_c = new Wallet();
wallet_c.rebuildFromPrivateKey(key_priv_c);
```
