/**
 * @name: utils.js
 * @author: Jimmy Peltonen aka JimmEL
 * @copyright: MIT
 * 
 * CREATED FOR PROJECT: BLOCKCHAIN IN JAVASCRIPT
 *      Version 0.1a
 *      Project Start: 2022-10-08
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