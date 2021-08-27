import express from 'express'
import * as fetchDataControler from '../controlers/fetchDataControler'

export const fetchDataRoutes = express.Router()

fetchDataRoutes.post( "/TokenDatas", fetchDataControler.tokenDatas )
fetchDataRoutes.post ("/fetchTokenPriceData", fetchDataControler.tokenPriceData)

