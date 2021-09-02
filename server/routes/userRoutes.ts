import express from 'express'
import { ensureAuth } from '../middleware/auth'

export const userRoutes = express.Router()

userRoutes.get("/", ensureAuth, (req, res) => {
  res.json(req.user)
})

userRoutes.get('/logout', (req, res) => {
  req.logout()
  res.sendStatus(200)
  console.log("user Logged out", req.user);
})