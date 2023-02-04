import type BitfinexService from '../../services/bitfinex.service'
import { isTokenSymbol, TOKEN_SYMBOLS } from '../../services/bitfinex.service'

export default class PairTradeService {
  protected readonly bitfinexService: BitfinexService

  constructor (bitfinexService: BitfinexService) {
    this.bitfinexService = bitfinexService
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async getPairOrderBook (tokenSymbol: TOKEN_SYMBOLS) {
    isTokenSymbol(tokenSymbol)
    if (tokenSymbol === TOKEN_SYMBOLS.BTCUSD) {
      return this.bitfinexService.pairBTCUSD
    } else if (tokenSymbol === TOKEN_SYMBOLS.ETHUSD) {
      return this.bitfinexService.pairETHUSD
    }
  }
}
