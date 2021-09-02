import express from 'express'
import * as usersControler from '../controlers/userControler'

export const userConfigRoutes = express.Router()

userConfigRoutes.post( "/user_subscribe_to_new_token", usersControler.user_subscribe_to_new_token )
userConfigRoutes.delete( "/user_unsubscribe_to_token", usersControler.user_unsubscribe_to_token )
userConfigRoutes.delete( "/user_remove_token_price_alert", usersControler.user_remove_token_price_alert )
userConfigRoutes.delete( "/user_remove_token_price_alert", usersControler.user_remove_token_price_alert )

userConfigRoutes.post( "/user_create", usersControler.user_create )
userConfigRoutes.delete( "/user_delete/:id", usersControler.user_delete )
userConfigRoutes.post( "/user_edit_email", usersControler.user_edit_email )
userConfigRoutes.post( "/user_edit_telegram", usersControler.user_edit_telegram )
userConfigRoutes.post( "/user_edit_membership", usersControler.user_edit_membership )