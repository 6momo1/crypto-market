import express from 'express'
import { authRoutes } from './authRoutes'
import { fetchDataRoutes } from './fetchDataRoutes'
import { userConfigRoutes } from './userConfigRoutes'
import { userRoutes } from './userRoutes'

export const router = express.Router()

router.get("/", (req, res) => {
  res.json({"message":"crypto-watch API"})
});

router.use('/auth',authRoutes)
router.use('/fetch',fetchDataRoutes)
router.use('/user',userRoutes)
router.use('/user_settings',userConfigRoutes)
