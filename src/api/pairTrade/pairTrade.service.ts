import type BitfinexService from '@services/bitfinex.service'
import { type IPair, isTokenSymbol, TOKEN_SYMBOLS } from '@services/bitfinex.service'

export default class PairTradeService {
  protected readonly bitfinexService: BitfinexService

  constructor (bitfinexService: BitfinexService) {
    this.bitfinexService = bitfinexService
  }

  public async getPairOrderBook (tokenSymbol: TOKEN_SYMBOLS): Promise<Omit<IPair, 'chainId'>> {
    isTokenSymbol(tokenSymbol)
    if (tokenSymbol === TOKEN_SYMBOLS.BTCUSD) {
      return this.bitfinexService.pairBTCUSD
    }
    return this.bitfinexService.pairETHUSD
  }

  public async calculatePairTrade (
    tokenSymbol: TOKEN_SYMBOLS,
    amount: number,
    type: 'sell' | 'buy'): Promise<number> {
    isTokenSymbol(tokenSymbol)
    return this.bitfinexService.calculateTradeAmount(tokenSymbol, amount, type)
  }
}
