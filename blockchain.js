/**
 * @name: blockchain.js
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

import crypto from 'crypto';
import * as utils from './utils.js';
import EC from 'elliptic';
const ec_secp256k1 = new EC.ec('secp256k1');
//
//
// Class for the block chain transactions
class Transaction {
    /**
     * @param {string} fromAddress 
     * @param {string} toAddress 
     * @param {int} amount 
     */
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
        this.signature = null;
    }
    /**
     * Calculate the SHA256 for this Transaction
     * @returns {string}
     */
    calculateHash() {
        let dataStr = this.fromAddress + this.toAddress + this.amount + this.timestamp;
        return crypto.createHash('sha256').update(dataStr).digest('hex');
    }
    /**
     * @param {ec.KeyPair} signingKey 
     * @returns {boolean}
     */
    signTransaction(signingKey) {
        // A key address is only allowed to sign transactions that is going
        // to be sent from this key adress.
        if (this.fromAddress !== "0" && signingKey.getPublic('hex') !== this.fromAddress)
        {
            console.log(
                "Error: Transaction.signTransaction() - " + 
                "Trying to sign a transaction not sent from this key adress. Illegal.");
            return false;
        }
        // Calculate hash and sign. Convert to DER format before returning sig.
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
        return true;
    }
    /**
     * Check if transaction signature is valid.
     * @returns {boolean}
     */
    isValid() {
        // Does a signature exist?
        if (this.signature == null || this.signature.length === 0) {
            console.log('Error: Transaction.IsValid() - No signature in this transaction');
            return false;
        }
        // Check if this is a mining transaction.
        if (this.fromAddress === "0")
            return true;
        // Create an elliptic keypair from the public key. This keypair will of
        // course not contain the secret private key, only the public key.
        const ecKey = ec_secp256k1.keyFromPublic(this.fromAddress, 'hex');
        return ecKey.verify(this.calculateHash(), this.signature);
    }
}
//
//
// Class for the blocks in the blockchain.
class Block {
    /**
     * @param {string} timestamp 
     * @param {Transaction[]} transactions
     * @param {string} previousHash 
     */
    constructor(timestamp,transactions,previousHash) {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    /**
     * Calculate the SHA256 for this Block
     * @returns {string}
     */
    calculateHash() {
        let dataStr = this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce;
        return crypto.createHash('sha256').update(dataStr).digest('hex');
    }
    /**
     * Try to mine this block. Add nonce and hash at current difficulty.
     * @param {integer} difficulty 
     * @returns {boolean}
     */
    mineBlock(difficulty) {
        if(difficulty <= 0)
            return false;
        // Recalculate hash
        this.hash = this.calculateHash();
        // Get string of zeros to compare the generated hash with below in the loop.
        let strZeros = utils.createStringOfZeros(difficulty);
        // Loop until hash contains correct number of zeros to the left.
        while(this.hash.substring(0,difficulty) !== strZeros) {
            this.nonce = this.nonce + 1;
            this.hash = this.calculateHash();
        }
        return true;
    }
    /**
    * Check if the transactions in this block has valid signatures.
    * @returns {boolean}
     */
    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                console.log("Error: Block.hasValidTransactions() - not valid transactions")
                return false;
            }
        }
        // All blocks are valid.
        return true;
    }
}
//
//
// Class for the blockchain.
class Blockchain {
    constructor(eckey) {
        // The ticker symbol for this coin.
        this.chain = [];
        this.pendingTransactions = [];
        // NOTE:
        // The variables and data below for this class is hardcoded.
        // They must not be changed. The hash for the genesis block
        // also hardcoded below. This hash must not be tampered with.
        // This increases the security for the blockchain.
        this.symbol = "JLC";
        this.difficulty = 3;
        this.difficultyGenesisBlock = 4;
        this.miningReward = 50;
        this.genesisBlock_timestamp = 1665525600000; // Hardcoded
        // nonce and hash is set/saved in 'buildGenesisBlock()'
        this.genesisBlock_nonce = 0;
        this.genesisBlock_hash = "0000000000000000000000000000000000000000000000000000000000000000";
        // Create and mine the genesis block.
        this.buildGenesisBlock(eckey);
    }
    /**
     * Build the genesis block for this instance of the blockchain.
     * @returns {Block}
     */
    buildGenesisBlock(eckey) {
        // No transactions exist yet.
        this.pendingTransactions = [];
        // Create the first miningreward transaction.
        const tx_genesis = new Transaction("0",eckey.getPublic('hex'),this.miningReward);
        // Sign the transaction with the private key of 'eckey'.
        tx_genesis.signTransaction(eckey);
        this.pendingTransactions.push(tx_genesis);
        // Create block.
        const genesisBlock = new Block(this.genesisBlock_timestamp,this.pendingTransactions,"0");
        if(genesisBlock.mineBlock(this.difficultyGenesisBlock))
            console.log("Success: Genesis block mined successfully.");
        // Add mined block to the blockchain.
        this.chain.push(genesisBlock);
        // There are no pending transactions now.
        this.pendingTransactions = [];
        // Now save the nonce and the hash for this genesis block.
        // Then we can detect if someone has tampered with the blockchain later.
        this.genesisBlock_nonce = genesisBlock.nonce;
        this.genesisBlock_hash = genesisBlock.hash;
        // Output results.
        console.log("Genesis block timestamp:" + this.genesisBlock_timestamp);
        console.log("Genesis block nonce:" + this.genesisBlock_nonce);
        console.log("Genesis block hash:" + this.genesisBlock_hash);
        console.log("[ The blockchain is now ready to use ]");
        console.log("");
        return true;
    }
    /**
     * Returns the latest block that was added to this blockchain.
     * @returns [Block]
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    /**
     * Returns the total coin amount to be sent in pendingtransactions
     * for a specific address.
     * Noone should be able to send more coins then they have in their balance.
     * @param {string} fromAddress
     * @returns {integer}
     */
    getAmount_pendingtransactions(fromAddress) {
        if(fromAddress === null) {
            console.log("Error: Blockchain.getAmount_in_pendingtransactions() - address === null");
            return 0;
        }
        let tx_totalAmount = 0;
        for(const tx of this.pendingTransactions) {
            if(tx.fromAddress === fromAddress)
                tx_totalAmount += tx.amount;
        }
        return tx_totalAmount;
    }
    /**
     * Add a new transaction to pendingtransactions in the blockchain.
     * @param {Transaction} tx
     * @returns {boolean}
     */
    addTransaction(tx) {
        let tx_valid = false;
        if(tx === null) {
            console.log("Error: Blockchain.addTransaction() - tx === null");
            return false;
        }
        if(tx.fromAddress === null || tx.toAddress === null) {
            console.log("Error: Blockchain.addTransaction() -");
            console.log("tx.fromAddress === null || tx.toAddress === null");
            return false
        }
        // Negative amount of coins can not be sent and zero amount can not be sent.
        if(tx.amount <= 0 ) {
            console.log("Error: Blockchain.addTransaction() - tx.amount <= 0");
            return false;
        }
        // Check if this transaction is valid.
        if(tx.isValid() == false) {
            console.log("Error: Blockchain.addTransaction() - tx.isValid() == false");
            return false;
        }
        // For fromAddress, get the total amount to send in all pending transactions
        // and this new transaction. Check so fromAddress has a balance to spend
        // this amount of coins.
        let fromAddress_balance = this.getBalanceOfAddress(tx.fromAddress);
        let fromAddress_total_tx_send_amount = this.getAmount_pendingtransactions(tx.fromAddress);
        if(tx.amount + fromAddress_total_tx_send_amount > fromAddress_balance) {
            console.log("Error: Blockchain.addTransaction() - not enough funds for this transaction.");
            console.log("tx.fromAddress: " + tx.fromAddress);
            console.log("tx.amount: " + tx.amount);
            return false;
        }
        // Add as the last transaction to the end pf array.
        this.pendingTransactions.push(tx);
        console.log("Success: Blockchain.addTransaction()");
        return true;
    }
    /**
     * Mine the pendingtransactions into a new block and add it to the end
     * of the blockchain.
     * A 'miningreward' transaction is added first to the block.
     * This transaction gives the miner the mining reward.
     * @param {ecKeypair} eckey
     * @returns {boolean}
     */
    minePendingTransactions(eckey) {
        if (eckey === null) {
            console.log("Error: Blockchain.minePendingTransactions() - eckey === null");
            return false;
        }
        // Create the 'miningreward' transaction to get the mining reward.
        const tx_miningreward = new Transaction("0",eckey.getPublic('hex'),this.miningReward);
        if (tx_miningreward.signTransaction(eckey) == false) {
            console.log("Error: Blockchain.minePendingTransactions() - " + 
                        "tx_miningreward.signTransaction(eckey) == false");
            return false;
        }
        // Add this 'miningreward' as the first transaction in the array.
        this.pendingTransactions.unshift(tx_miningreward);
        // Create the block to be mined.
        const block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        // Do mining.
        block.mineBlock(this.difficulty);
        // Add mined block to the blockchain.
        this.chain.push(block);
        // Empty the array for the pending transactions.
        this.pendingTransactions = [];
        console.log("Success: Blockchain.minePendingTransactions() - New Block Mined");
        return true;
    }
    /**
     * @param {string} address 
     * @returns {string}
     */
    getBalanceOfAddress(address) {
        if(address.length != 130){
            console.log("Error: adress must be a full public key of length 130");
            console.log("address: " + address);
            return 0;
        }
        let balance = 0;
        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    /**
     * @param {string} fromAddress 
     * @returns []
     */
    fetch_fromAdress_pendingtransactions_as_Array(fromAddress) {
        if(fromAddress === null) {
            console.log("Error: Blockchain.getAmount_in_pendingtransactions() - address === null");
            return [];
        }
        let returnArray = [];
        for(const tx of this.pendingTransactions) {
            if(tx.fromAddress === fromAddress)
            returnArray.push(tx);
        }
        return returnArray;
    }
    /**
     * Check if the blockchain is in a valid state.
     * @returns {boolean}
     */
    validateState() {
        // Start by validating the genesis block.
        // No tampering must ever be done after the blockchain has been created.
        //  (to be secure one should use a hardcoded genesis block like in the
        //  Bitcoin Core C++ code by Satoshi Nakamoto.)
        if(this.genesisBlock_nonce !== this.chain[0].nonce) {
            console.log(
                "Error: Blockchain.validateState() - " +
                "this.genesisBlock_nonce !== this.chain[0].nonce");
            console.log(this.genesisBlock_nonce + " / " + this.chain[0].nonce);
            return false;
        }
        if(this.genesisBlock_hash !== this.chain[0].hash) {
            console.log(
                "Error: Blockchain.validateState() - " +
                "this.genesisBlock_hash !== this.chain[0].hash");
            console.log(this.genesisBlock_hash + " / " + this.chain[0].hash);
            return false;
        }
        // Loop through the chain and start at block after genesis block.
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            // Hashes of blocks connects them. Check so the current
            // block has 'previousHash' set to 'hash' of previous block.
            if(previousBlock.hash !== currentBlock.previousHash) {
                console.log(
                    "Error: Blockchain.validateState() - " +
                    "previousBlock.hash !== currentBlock.previousHash");
                return false;
            }
            // All transactions valid in this block?
            if(currentBlock.hasValidTransactions() == false)
            {
                console.log(
                    "Error: Blockchain.validateState() - " +
                    "currentBlock.hasValidTransactions() == false");
                return false;
            }
            // Has someone tampered with the has in the current block?
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(
                    "Error: Blockchain.validateState() - " +
                    currentBlock.hash !== currentBlock.calculateHash());
                return false;
            }
        }
        console.log("Success: Blockchain.validateState()");
        return true;
    }
}

// Make exports for this module.
export { Transaction, Block, Blockchain }