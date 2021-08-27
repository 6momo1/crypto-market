"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyByTelegram = exports.notifyByEmail = void 0;
function notifyByEmail(subscriber, email, tokenSymbol, price) {
    console.log(`NOTIFIYING: ${subscriber} 
        by Email: ${email} 
        for token: ${tokenSymbol} 
        at price ${price}
    `);
}
exports.notifyByEmail = notifyByEmail;
function notifyByTelegram(subscriber, username, tokenSymbol, price) {
    console.log(`NOTIFIYING: ${subscriber} 
        by telegram username: ${username} 
        for token: ${tokenSymbol} 
        at price ${price}
    `);
}
exports.notifyByTelegram = notifyByTelegram;
