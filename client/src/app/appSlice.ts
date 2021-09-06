import {createSlice } from "@reduxjs/toolkit"
import { fetchAuthUser } from '../utils/fetchAuthUser'

export interface TokenWatchlistInterface {
  tokenSymbol: string,
  tokenAddress: string,
  priceAlerts: {
    above?: number[],
    below?: number[]
  }
}


export interface UserInterface {
  googleId: string,
  displayName: string,
  firstName: string,
  lastName: string,
  notifyBy: {
    email: string,
    telegram: string
  },
  email: string,
  telegram: string,
  tokenWatchlist: TokenWatchlistInterface[],
  member: boolean
}

interface IAppState {
  isAuthenticated: boolean,
  authUser: UserInterface | null |undefined
}

const initialState: IAppState = {
  isAuthenticated: false,
  authUser: null
}

const AppSlice = createSlice({
  name: "App",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
    setAuthUser: (state, action ) => {
      state.authUser = action.payload
    }
  }
})

export const { setIsAuthenticated, setAuthUser } = AppSlice.actions
export default AppSlice.reducer