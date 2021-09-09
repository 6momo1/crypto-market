import express from "express";
import passport from "passport";

export const authRoutes = express.Router();

const errorLoginUrl = 'http://localhost:3000/error'
const successLoginUrl = 'http://localhost:3000/login/success'

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
  passport.authenticate('google', {
    failureMessage: "Cannot login to Google.",
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
  }),
  (req, res) => {
    res.json({user:req.user})
    console.log("User: ", req.user);
  }
);