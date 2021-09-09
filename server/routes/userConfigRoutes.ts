import express from 'express'
import * as usersControler from '../controlers/userControler'

export const userConfigRoutes = express.Router()



// DELETE
userConfigRoutes.delete( "/user_unsubscribe_to_token", usersControler.user_unsubscribe_to_token )
userConfigRoutes.delete( "/user_remove_token_price_alert", usersControler.user_remove_token_price_alert )

userConfigRoutes.delete( "/user_delete/:id", usersControler.user_delete )

// PUT
userConfigRoutes.put( "/user_subscribe_to_new_token", usersControler.user_subscribe_to_new_token )

userConfigRoutes.put( "/user_edit_email", usersControler.user_edit_email )
userConfigRoutes.put( "/user_edit_telegram", usersControler.user_edit_telegram )
userConfigRoutes.put( "/user_edit_membership", usersControler.user_edit_membership )

userConfigRoutes.put("/user_toggle_email", usersControler.user_toggle_email)
userConfigRoutes.put("/user_toggle_telegram", usersControler.user_toggle_telegram)