/**
 * @name: main.js
 * @author: Jimmy Peltonen aka JimmEL
 * @copyright: MIT
 * 
 * CREATED FOR PROJECT: BLOCKCHAIN IN JAVASCRIPT
 *      Version 0.1a
 *      Project Start: 2022-10-08
 *
 * DEPENDENCIES node package manager:
 * npm install elliptic --save
 */
'use strict';

import { Wallet } from './wallet.js';
import { Transaction, Block, Blockchain } from './blockchain.js';
import { createStringOfZeros } from './utils.js';
import { TestsManager, eckey_a, eckey_b, eckey_c } from './tests.js';
import crypto from 'crypto';
import EC from 'elliptic';
const ec_secp256k1 = new EC.ec('secp256k1');

// TestsManager runs the bug checking tests designed for this project.
const myTestManager = new TestsManager(eckey_a,eckey_b,eckey_c);
myTestManager.run_all_tests();