export type TokenSubscribersInfo = {
  tokenData: {
    id: string,
    name: string,
    symbol: string
  }
}

export type Client = {
  name: {
    tokenWatchList: {
      tokenSymbol: {
        priceAlerts: {
          above: number[],
          below: number[]
        }
      }
    },
    notificationServices: {
      email: string,
      telegram: string
    },
    member: boolean
  }
}

export type TokenAlerts = {
  tokenAlerts: TokenSubscribersInfo[]
}

export type Clients = {
  clients: Client[]
}