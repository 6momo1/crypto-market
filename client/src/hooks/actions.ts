import { createAction } from '@reduxjs/toolkit'
import { SupportedNetwork } from '../types/networks'


// add token address to byAddress
export const addTokenKeys = createAction<{ tokenAddresses: string[]; networkId: SupportedNetwork }>(
  'tokens/addTokenKeys'
)