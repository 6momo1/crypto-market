import express from 'express'
import { user_subscribe_to_new_token } from '../controlers/userControler'
import { ensureAdmin, ensureAuth } from '../middleware/auth'
import { User } from '../models/users'

export const userRoutes = express.Router()

/**
 * @param req GET
 * @param res returns user information of requested user
 */
userRoutes.get("/", ensureAuth, (req, res) => {
  res.json(req.user)
})

/**
 * GET: logs user out
 */
userRoutes.get('/logout', (req, res) => {
  req.logout()
  res.sendStatus(200)
  console.log("user Logged out", req.user);
})

/**
 * GET: allow admin only to get all users
 */
userRoutes.get('/get_users', ensureAdmin, async (req, res) => {

  const users = await User.find({})
  res.json({data: users})
  
})
