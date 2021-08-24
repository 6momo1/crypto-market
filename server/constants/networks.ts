// import * as ETHEREUM_LOGO_URL from '../assets/images/ethereum-logo.png'


export enum SupportedNetwork {
  ETHEREUM,
  ARBITRUM,
  OPTIMISM,
}

export type NetworkInfo = {
  id: SupportedNetwork
  name: string
  // imageURL: string
  bgColor: string
  primaryColor: string
  secondaryColor: string
  blurb?: string
}

export const EthereumNetworkInfo: NetworkInfo = {
  id: SupportedNetwork.ETHEREUM,
  name: 'Ethereum',
  bgColor: '#fc077d',
  primaryColor: '#fc077d',
  secondaryColor: '#2172E5',
  // imageURL: ETHEREUM_LOGO_URL,
}