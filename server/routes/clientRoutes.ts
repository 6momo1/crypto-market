import express from 'express'
import * as clientsControler from '../controlers/clientsControler'

export const clientRoutes = express.Router()

clientRoutes.post( "/client_create", clientsControler.client_create )
