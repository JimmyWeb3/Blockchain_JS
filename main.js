/**
 * @name: main.js
 * @license: MIT
 * @copyright: MIT
 * @author: Jimmy Peltonen
 * 
 * Version 0.1a
 * Project Start: 2022-10-08
 * 
 * DEPENDENCIES node package manager:
 * npm install elliptic --save
 */
'use strict';

import { Wallet } from './wallet.js';
import { Transaction, Block, Blockchain } from './blockchain.js';
import { createStringOfZeros } from './utils.js';
import { TestsManager, wallet_a, wallet_b, wallet_c } from './tests.js';
import crypto from 'crypto';
import EC from 'elliptic';
const ec_secp256k1 = new EC.ec('secp256k1');

// TestsManager runs the bug checking tests designed for this project.
const myTestManager = new TestsManager();
myTestManager.run_all_tests();