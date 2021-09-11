"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureGuest = exports.ensureAdmin = exports.ensureAuth = void 0;
const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.status(401).send("please Login first.");
    }
};
exports.ensureAuth = ensureAuth;
const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.googleId == process.env.ADMIN_GOOGLE_ID1) {
        return next();
    }
    else {
        res.status(401).send("Not Admin.");
    }
};
exports.ensureAdmin = ensureAdmin;
const ensureGuest = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401);
    }
};
exports.ensureGuest = ensureGuest;
