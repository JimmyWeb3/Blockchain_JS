/**
 * @name: wallet.js
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
import EC from 'elliptic';
const ec_secp256k1 = new EC.ec('secp256k1');

class Wallet {
    constructor() {
        this.key = ec_secp256k1.genKeyPair();
    }
    /**
     * rebuild the key from a given private key
     * @param {string} privateKey 
     * @returns {bool} [success or no success]
    */
    rebuildFromPrivateKey(privateKey) {
        if( privateKey == null ) {
            console.log("Error: rebuildFromPrivateKey - privateKey == null");
            return;
        } else if(privateKey.length != 64) {
            console.log("Error: rebuildFromPrivateKey - privateKey.length != 64");
            return;
        }
        // Error checks done, continue...
        this.key = ec_secp256k1.keyFromPrivate(privateKey);
    }
    /**
     * @returns {string}
     */
    getPrivateKey() {
        return this.key.getPrivate('hex');
    }
    /**
     * @returns {string}
     */
    getPublicKey() {
        return this.key.getPublic('hex');
    }
    /**
     * @returns {string} [point X of the public key]
     */
    getPublicKeyPointX() {
        return this.key.getPublic().getX().toString('hex');
    }
    /**
     * @returns {string} [point Y of the public key]
     */
    getPublicKeyPointY() {
        return this.key.getPublic().getY().toString('hex');
    }
}

// ADD P2PKH PUBLIC ADRESS (KEY)
// https://medium.com/blockthought/creating-bitcoin-wallets-in-js-69c0773c2954
// http://gobittest.appspot.com/Address

export { Wallet }