import express from 'express'
import { authRoutes } from './authRoutes'
import { fetchDataRoutes } from './fetchDataRoutes'
import { userConfigRoutes } from './userConfigRoutes'
import { userRoutes } from './userRoutes'

export const router = express.Router()

router.use('/auth',authRoutes)
router.use('/fetch',fetchDataRoutes)
router.use(userRoutes)
router.use(userConfigRoutes)


