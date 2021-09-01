import express from "express";
import * as authControler from "../controlers/authControler";
import passport from "passport";

export const authRoutes = express.Router();

// @desc Auth with Google
// @route GET /auth/google
authRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// @desc Auth callback
// @route GET /auth/google/callback
authRoutes.get(
  "/google/callback",
  passport.authenticate('google', {failureRedirect: '/'}),
  (req, res) => {
    res.redirect('/dashboard')
  }
);
