import express from 'express'
import * as usersControler from '../controlers/userControler'

export const userRoutes = express.Router()

userRoutes.post( "/user_subscribe_to_new_token", usersControler.user_subscribe_to_new_token )
userRoutes.delete( "/user_unsubscribe_to_token", usersControler.user_unsubscribe_to_token )
userRoutes.delete( "/user_remove_token_price_alert", usersControler.user_remove_token_price_alert )
userRoutes.delete( "/user_remove_token_price_alert", usersControler.user_remove_token_price_alert )

userRoutes.post( "/user_create", usersControler.user_create )
userRoutes.delete( "/user_delete/:id", usersControler.user_delete )
userRoutes.post( "/user_edit_email", usersControler.user_edit_email )
userRoutes.post( "/user_edit_telegram", usersControler.user_edit_telegram )
userRoutes.post( "/user_edit_membership", usersControler.user_edit_membership )