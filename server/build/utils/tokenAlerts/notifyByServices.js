"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyByTelegram = exports.notifyByEmail = void 0;
function notifyByEmail(user, tokenAlertObj, price) {
    console.log(`NOTIFIYING: ${user.firstName} by email: ${user.email} for token: ${tokenAlertObj.tokenSymbol} at price ${price} `);
}
exports.notifyByEmail = notifyByEmail;
function notifyByTelegram(user, tokenAlertObj, price) {
    console.log(`NOTIFIYING: ${user.firstName} by telegram: ${user.telegram} for token: ${tokenAlertObj.tokenSymbol} at price ${price}`);
}
exports.notifyByTelegram = notifyByTelegram;
