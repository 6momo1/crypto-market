import express from 'express'
import * as usersControler from '../controlers/userControler'

export const userRoutes = express.Router()

userRoutes.post( "/user_create", usersControler.user_create )
userRoutes.post( "/user_subscribe_to_new_token", usersControler.user_subscribe_to_new_token )
userRoutes.delete( "/user_delete/:id", usersControler.user_delete )
userRoutes.delete( "/user_unsubscribe_to_token", usersControler.user_unsubscribe_to_token )

userRoutes.post( "/testEndpoint", usersControler.testEndpoint )

