/**
 * @name: tests.js
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
import crypto from 'crypto';
import EC from 'elliptic';
const ec_secp256k1 = new EC.ec('secp256k1');
//
// key a
const key_priv_a = "28CA6A9D397CA4C49A2BB9E7A5593548EBB1E9ABC6C93E859A42BC24A13D55FC";
// 04a45275eeff1718379dac3879f04960a19c6baccc3c0591c75b019f74ba36aec69f2df252ce0430ddd385c9cdf3de8e95236ccfc809b1ef3b0ed4c0d39e75ba1b
// key b
const key_priv_b = "AD47604AD676051E20ABBA120ED9B65BE6BFC2E12A1653006DC051EB4BF952D0";
// 04b49ee8034e75b079b7f7d051116a907dc9aa84246858b7efb82a3774989a3ab3f9fa15123818a568492623c8f45d44fdeca4f92075fe0fe524406fc2259cc97d
// key c
const key_priv_c = "B85FB30574D787F009D61C02C9C4C59C5BE77232D93A6326E83FA3D4B6958C0D";
// 04cf5fd8892873a1deeb921bed872173345761414a0e13024ccab3415ae5683881a8123440b4d9f6a78fc54e1e9ac447086d12f74f2c5514d297b2b552bfbdda81
//
// Create some Wallets from the keypairs above.
const wallet_a = new Wallet();
wallet_a.rebuildFromPrivateKey(key_priv_a);
const wallet_b = new Wallet();
wallet_b.rebuildFromPrivateKey(key_priv_b);
const wallet_c = new Wallet();
wallet_c.rebuildFromPrivateKey(key_priv_c);
//
//
// Class to manage the automatic testing for this project.
// Run a single test or call the function 'run_all_tests()'.
class TestsManager {
    constructor() {
        this.messages = [];
        this.numof_tests_succeeded = 0;
        this.numof_tests_failed = 0;
        this.line = "-----------------------------------------";
        this.line_success = "+++ TEST SUCCESS +++";
        this.line_failure = "--- TEST FAILURE ---";
        this.messages.push(this.line);
        this.messages.push(this.line);
        this.messages.push("---TestsManager-Messages-----------------");
    }
    /**
     * Run all the tests in this class.
     */
    run_all_tests() {
        this.numof_tests_succeeded = 0;
        this.numof_tests_failed = 0;
        this._f01_blockchain_class_constructor_v001();
        this._f02_make_test_valid_transactions_v001();
        this._f03_addTransaction_operspending_pendingtransactions_v001();
        this._f04_getAmount_pendingtransactions_v001();
        this._f05_getBalanceOfAddresses_v001();
        this.messages.push(this.line);
        this.messages.push("numof_tests_succeeded: ", + this.numof_tests_succeeded);
        this.messages.push("numof_tests_failed: ", + this.numof_tests_failed);
        this.messages.push(this.line);
        this.printMessagesToScreen();
    }
    /**
     */
    _fhelper_console_head(functionName) {
        console.log(this.line);
        console.log(functionName);
        console.log("");
    }
    /**
    */
    _fhelper_console_SUCCESS() {
        console.log(this.line_success);
        console.log(this.line);
    }
    /**
     */
    _fhelper_console_FAILURE() {
        console.log(this.line_failure);
        console.log(this.line);
    }
    /**
     */
    _fhelper_console_dump_blockchain(blockchain) {
        if(blockchain === null)
            return false;
        // DUMP BLOCKCHAIN ON SCREEN
        let index = 0;
        for (const block of blockchain.chain) {
            console.log("Block index: " + index);
            console.log(block);
            index += 1;
        }
        return true;
    }
    /**
     */
    _fhelper_add_messages(internalTestIndex,fname,bSuccess) {
        this.messages.push(this.line);
        this.messages.push(internalTestIndex + ": " + fname);
        if (bSuccess)
            this.messages.push(this.line_success);
        else
            this.messages.push(this.line_failure);
    }
    /**
     */
    _f01_blockchain_class_constructor_v001() {
        const fname = "blockchain_class_constructor_v001";
        let bSuccess = false;
        this._fhelper_console_head(fname);
        // Prepare the test.
        const myBlockChain = new Blockchain(wallet_a.getKeyPair());
        // Dump blochchain on screen.
        this._fhelper_console_dump_blockchain(myBlockChain);
        // Check if the test was a success.
        if (myBlockChain.validateState()) {
            this._fhelper_console_SUCCESS();
            this.numof_tests_succeeded += 1;
            bSuccess = true;
        } else {
            this._fhelper_console_FAILURE();
            this.numof_tests_failed += 1;
            bSuccess = false;
        }
        // Add messages to class array for output later.
        this._fhelper_add_messages(0,fname,bSuccess);
    }
    /**
     */
    _f02_make_test_valid_transactions_v001() {
        const fname = "make_test_transactions_v001";
        let bSuccess = false;
        this._fhelper_console_head(fname);
        // Prepare the test.
        const myBlockChain = new Blockchain(wallet_a.getKeyPair());
        myBlockChain.validateState();
        let tx01_Amount = 10;
        let tx02_Amount = 20;
        const tx01 = new Transaction(wallet_a.getPublicKey(), wallet_b.getPublicKey(), tx01_Amount);
        tx01.signTransaction(wallet_a.getKeyPair());
        myBlockChain.addTransaction(tx01);
        const tx02 = new Transaction(wallet_a.getPublicKey(), wallet_c.getPublicKey(), tx02_Amount);
        tx02.signTransaction(wallet_a.getKeyPair());
        myBlockChain.addTransaction(tx02);
        console.log("");
        myBlockChain.minePendingTransactions(wallet_a.getKeyPair()); // block 1
        myBlockChain.validateState();
        // console balances
        let balance_a = myBlockChain.getBalanceOfAddress(wallet_a.getPublicKey());
        console.log("balance_a: " + balance_a);
        let balance_b = myBlockChain.getBalanceOfAddress(wallet_a.getPublicKey());
        console.log("balance_b: " + balance_b);
        let balance_c = myBlockChain.getBalanceOfAddress(wallet_c.getPublicKey());
        console.log("balance_c: " + balance_c);
        console.log("")
        // Dump blochchain on screen.
        this._fhelper_console_dump_blockchain(myBlockChain);
        // Check if the test was a success.
        if (myBlockChain.validateState()) {
            this._fhelper_console_SUCCESS();
            this.numof_tests_succeeded += 1;
            bSuccess = true;
        } else {
            this._fhelper_console_FAILURE();
            this.numof_tests_failed += 1;
            bSuccess = false;
        }
        // Add messages to class array for output later.
        this._fhelper_add_messages(0,fname,bSuccess);
    }
    /**
     */
    _f03_addTransaction_operspending_pendingtransactions_v001() {
        const fname = "addTransaction_operspending_pendingtransactions_v001";
        let bSuccess = false;
        this._fhelper_console_head(fname);
        // Part 1 of this test.
        console.log("-------------------");
        console.log("Part 1 of this test");
        console.log("");
        const myBlockChain = new Blockchain(wallet_a.getKeyPair());
        let tx01_Amount = 35;
        let tx02_Amount = 25;
        const tx01 = new Transaction(wallet_a.getPublicKey(), wallet_b.getPublicKey(), tx01_Amount);
        tx01.signTransaction(wallet_a.getKeyPair());
        myBlockChain.addTransaction(tx01);
        const tx02 = new Transaction(wallet_a.getPublicKey(), wallet_c.getPublicKey(), tx02_Amount);
        tx02.signTransaction(wallet_a.getKeyPair());
        // Check if the test was a success.
        // This should fail
        // tx01 -> 50 - 35 = 15
        // tx02 -> 15 -25 = FAILURE (not enough funds)
        if (myBlockChain.addTransaction(tx02) == false) {
            bSuccess = true;
            this._fhelper_console_SUCCESS();
            this.numof_tests_succeeded += 1;
        } else {
            bSuccess = false;
            this._fhelper_console_FAILURE();
            this.numof_tests_failed += 1;
        }
        // Add messages to class array for output later.
        this._fhelper_add_messages(0,fname,bSuccess);
        // Part 2 of this test.
        console.log("-------------------");
        console.log("Part 2 of this test");
        console.log("");
        myBlockChain.minePendingTransactions(wallet_a.getKeyPair()); // block 1
        // Check balances and validate the blockchain.
        let balance_a = myBlockChain.getBalanceOfAddress(wallet_a.getPublicKey());
        console.log("balance_a: " + balance_a);
        let balance_b = myBlockChain.getBalanceOfAddress(wallet_b.getPublicKey());
        console.log("balance_b: " + balance_b);
        let balance_c = myBlockChain.getBalanceOfAddress(wallet_c.getPublicKey());
        console.log("balance_c: " + balance_c);
        console.log("")
        console.log(this.line);
        // Check if the test was a success.
        if (myBlockChain.validateState() && 
            balance_a == (myBlockChain.miningReward * 2) - tx01_Amount && 
            balance_b == tx01_Amount)
        {
            bSuccess = true;
            this._fhelper_console_SUCCESS();
            this.numof_tests_succeeded += 1;
        } else {
            bSuccess = false;
            this._fhelper_console_FAILURE();
            this.numof_tests_failed += 1;
        }
        // Add messages to class array for output later.
        this._fhelper_add_messages(1,fname,bSuccess);
    }
    /**
     */
    _f04_getAmount_pendingtransactions_v001() {
        const fname = "getAmount_pendingtransactions_v001";
        let bSuccess = false;
        this._fhelper_console_head(fname);
        // Part 1 of this test.
        const myBlockChain = new Blockchain(wallet_a.getKeyPair());
        let tx01_Amount = 17;
        let tx02_Amount = 13;
        const tx01 = new Transaction(wallet_a.getPublicKey(), wallet_b.getPublicKey(), tx01_Amount);
        tx01.signTransaction(wallet_a.getKeyPair());
        myBlockChain.addTransaction(tx01);
        const tx02 = new Transaction(wallet_a.getPublicKey(), wallet_c.getPublicKey(), tx02_Amount);
        tx02.signTransaction(wallet_a.getKeyPair());
        myBlockChain.addTransaction(tx02);
        let testdata_amount = tx01_Amount + tx02_Amount;
        // do test:
        console.log("pendingtransactions:");
        let arr = myBlockChain.fetch_fromAdress_pendingtransactions_as_Array(wallet_a.getPublicKey());
        console.log(arr);
        console.log("");
        console.log("TEST DATA:");
        let txAmountPending = myBlockChain.getAmount_pendingtransactions(wallet_a.getPublicKey());
        console.log("txAmountPending should be " + testdata_amount);
        console.log("txAmountPending: " + txAmountPending);
        console.log("");
        // Check if the test was a success.
        if (txAmountPending === testdata_amount) {
            this._fhelper_console_SUCCESS();
            this.numof_tests_succeeded += 1;
            bSuccess = true;
        } else {
            this._fhelper_console_FAILURE();
            this.numof_tests_failed += 1;
            bSuccess = false;
        }
        // Add messages to class array for output later.
        this._fhelper_add_messages(0,fname,bSuccess);
    }
    /**
     */
    _f05_getBalanceOfAddresses_v001() {
        const fname = "getBalanceOfAddresses_v001";
        let bSuccess = false;
        this._fhelper_console_head(fname);
        // Part 1 of this test.
        const myBlockChain = new Blockchain(wallet_a.getKeyPair());
        // Block 1
        let tx01_Amount = 10;
        let tx02_Amount = 20;
        const tx01 = new Transaction(wallet_a.getPublicKey(), wallet_b.getPublicKey(), tx01_Amount);
        tx01.signTransaction(wallet_a.getKeyPair());
        myBlockChain.addTransaction(tx01);
        const tx02 = new Transaction(wallet_a.getPublicKey(), wallet_c.getPublicKey(), tx02_Amount);
        tx02.signTransaction(wallet_a.getKeyPair());
        myBlockChain.addTransaction(tx02);
        myBlockChain.minePendingTransactions(wallet_a.getKeyPair()); // block 1
        // Block 2
        let tx03_Amount = 11;
        let tx04_Amount = 8;
        const tx03 = new Transaction(wallet_c.getPublicKey(), wallet_b.getPublicKey(), tx03_Amount);
        tx03.signTransaction(wallet_c.getKeyPair());
        myBlockChain.addTransaction(tx03);
        const tx04 = new Transaction(wallet_a.getPublicKey(), wallet_b.getPublicKey(), tx04_Amount);
        tx04.signTransaction(wallet_a.getKeyPair());
        myBlockChain.addTransaction(tx04);
        myBlockChain.minePendingTransactions(wallet_c.getKeyPair()); // block 2
        // Dump blochchain on screen.
        this._fhelper_console_dump_blockchain(myBlockChain);
        // Set balance that should be now.
        let testdata_balance_a = (2 * myBlockChain.miningReward) - tx01_Amount - tx02_Amount - tx04_Amount;
        let testdata_balance_b = (0 * myBlockChain.miningReward) + tx01_Amount + tx03_Amount + tx04_Amount;
        let testdata_balance_c = (1 * myBlockChain.miningReward) + tx02_Amount - tx03_Amount;
        // do test:
        console.log("");
        console.log("TEST DATA:");
        let balance_a = myBlockChain.getBalanceOfAddress(wallet_a.getPublicKey());
        let balance_b = myBlockChain.getBalanceOfAddress(wallet_b.getPublicKey());
        let balance_c = myBlockChain.getBalanceOfAddress(wallet_c.getPublicKey());
        console.log("balance for '04a...' should be " + (testdata_balance_a));
        console.log("balance '04a...': " + balance_a);
        console.log("balance for '04b...' should be " + (testdata_balance_b));
        console.log("balance '04b...': " + balance_b);
        console.log("balance for '04c...' should be " + (testdata_balance_c));
        console.log("balance '04c...': " + balance_c);
        console.log("")
        // Check if the test was a success.
        if (balance_a === testdata_balance_a && 
            balance_b === testdata_balance_b && 
            balance_c === testdata_balance_c)
        {
            this._fhelper_console_SUCCESS();
            this.numof_tests_succeeded += 1;
            bSuccess = true;
        }
        else {
            this._fhelper_console_FAILURE();
            this.numof_tests_failed += 1;
            bSuccess = false;
        }
        // Add messages to class array for output later.
        this._fhelper_add_messages(0,fname,bSuccess);
    }
    /**
     * Print all pushed messages to screen.
     */
    printMessagesToScreen() {
        //console.log("TestsManager Messages...");
        for(const msg of this.messages) {
            console.log(msg);
        }
    }
}
// Make exports for this module.
export { TestsManager, wallet_a, wallet_b, wallet_c }