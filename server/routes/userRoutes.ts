import express from 'express'
import { user_subscribe_to_new_token } from '../controlers/userControler'
import { ensureAdmin, ensureAuth } from '../middleware/auth'
import { User } from '../models/users'

export const userRoutes = express.Router()

userRoutes.get("/", ensureAuth, (req, res) => {
  res.json(req.user)
})

userRoutes.get('/logout', (req, res) => {
  req.logout()
  res.sendStatus(200)
  console.log("user Logged out", req.user);
})

userRoutes.get('/get_users', ensureAdmin, async (req, res) => {

  const users = await User.find({})
  res.json({data: users})
  
})

userRoutes.get('/get_watchlists', async (req, res) => {
  const googleId = req.body.googleId

})