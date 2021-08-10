
export enum SupportedNetwork {
  ETHEREUM,
  ARBITRUM,
  OPTIMISM,
}

export type NetworkInfo = {
  id: SupportedNetwork
  name: string
  imageURL: string
  bgColor: string
  primaryColor: string
  secondaryColor: string
  blurb?: string
}