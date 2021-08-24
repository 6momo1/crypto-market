export const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

export function formatTokenName(address: string, name: string) {
  if (address === WETH_ADDRESS) {
    return 'Ether'
  }
  return name
}

export function formatTokenSymbol(address: string, symbol: string) {
  if (address === WETH_ADDRESS) {
    return 'ETH'
  }
  return symbol
}