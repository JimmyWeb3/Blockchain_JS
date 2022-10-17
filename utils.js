/**
 * @name: utils.js
 * @license: MIT
 * @copyright: MIT
 * @author: Jimmy Peltonen
 * 
 * Version 0.1a
 * Project Start: 2022-10-08
 * 
 * DEPENDENCIES node package manager:
 * -
 */
 'use strict';

function createStringOfZeros(amount) {
    let str = ""
    for(let i=0; i<amount; i++) {
        str = str + "0";
    }
    return str;
}

// exports from this file
export { createStringOfZeros };