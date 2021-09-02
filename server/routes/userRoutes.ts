import express from 'express'
import * as userControler from '../controlers/fetchDataControler'
import { ensureAuth } from '../middleware/auth'

export const userRoutes = express.Router()

userRoutes.get("/user", ensureAuth, (req, res) => {
  res.json(req.user)
})