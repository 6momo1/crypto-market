import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import logger from "redux-logger"
import { applyMiddleware } from "redux";

export const store = configureStore({
  reducer: {
    app: appSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>