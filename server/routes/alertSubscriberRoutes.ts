import express from 'express'
import * as alertSubscriberControler from '../controlers/alertSubscriberControler'
export const alertSubscriberRoutes = express.Router()

alertSubscriberRoutes.get( "/test", alertSubscriberControler.alertAll )


