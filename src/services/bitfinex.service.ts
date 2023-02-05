import Websocket from 'ws'
import { type PartialBy } from '@core/types'

/**
 * A Bid/Ask pair
 * @typedef {object} BidAskPair
 * @property {number} bid - Bid price
 * @property {number} bidSize - Bid size
 * @property {number} ask - Ask price
 * @property {number} askSize - Ask size
 * @property {number} dailyChange - Daily change
 * @property {number} dailyChangeRelative - Daily change relative
 * @property {number} lastPrice - Last price
 * @property {number} volume - Volume
 * @property {number} high - High
 * @property {number} low - Low
 */
export enum TOKEN_SYMBOLS {
  BTCUSD = 'tBTCUSD',
  ETHUSD = 'tETHUSD',
}

export interface IPair {
  chainId: number
  bid: number
  bidSize: number
  ask: number
  askSize: number
  dailyChange: number
  dailyChangeRelative: number
  lastPrice: number
  volume: number
  high: number
  low: number
}

export function isTokenSymbol (
  tokenSymbol: string
): asserts tokenSymbol is TOKEN_SYMBOLS {
  if (!Object.values(TOKEN_SYMBOLS).includes(tokenSymbol as TOKEN_SYMBOLS)) {
    throw new Error('Token symbol is not valid')
  }
}

export default class BitfinexService {
  protected readonly ws: Websocket
  protected isOpen = false

  protected _pairBTCUSD = {
    chainId: 0,
    bid: 0,
    bidSize: 0,
    ask: 0,
    askSize: 0,
    dailyChange: 0,
    dailyChangeRelative: 0,
    lastPrice: 0,
    volume: 0,
    high: 0,
    low: 0
  }

  // get property for pairBTCUSD
  get pairBTCUSD (): Omit<IPair, 'chainId'> {
    const pairClone: PartialBy<typeof this._pairBTCUSD, 'chainId'> =
      Object.assign({}, this._pairBTCUSD)
    delete pairClone.chainId
    return pairClone
  }

  protected _pairETHUSD = {
    chainId: 0,
    bid: 0,
    bidSize: 0,
    ask: 0,
    askSize: 0,
    dailyChange: 0,
    dailyChangeRelative: 0,
    lastPrice: 0,
    volume: 0,
    high: 0,
    low: 0
  }

  // get property for pairETHUSD
  get pairETHUSD (): Omit<IPair, 'chainId'> {
    const pairClone: PartialBy<typeof this._pairETHUSD, 'chainId'> =
      Object.assign({}, this._pairETHUSD)
    delete pairClone.chainId
    return pairClone
  }

  constructor () {
    this.ws = new Websocket('wss://api-pub.bitfinex.com/ws/2')
    void this.getPairOrderBook()
  }

  private async waitIsOpen (): Promise<void> {
    if (!this.isOpen) {
      await new Promise((resolve) => {
        this.ws.on('open', () => {
          this.isOpen = true
          resolve(0)
        })
      })
    }
  }

  public async getPairOrderBook (): Promise<void> {
    // we wait to open ws connection
    await this.waitIsOpen()
    // we subscribe to ticker
    this.ws.send(
      JSON.stringify({
        event: 'subscribe',
        channel: 'ticker',
        symbol: TOKEN_SYMBOLS.BTCUSD
      })
    )
    this.ws.send(
      JSON.stringify({
        event: 'subscribe',
        channel: 'ticker',
        symbol: TOKEN_SYMBOLS.ETHUSD
      })
    )

    // we listen to messages
    // using chainId to identify the pair
    this.ws.on('message', (data) => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const parsedData = JSON.parse(data.toString())
      if (parsedData.event === 'subscribed') {
        if (
          parsedData.channel === 'ticker' &&
          parsedData.symbol === TOKEN_SYMBOLS.BTCUSD
        ) {
          this._pairBTCUSD.chainId = parsedData.chanId
        } else if (parsedData.symbol === TOKEN_SYMBOLS.ETHUSD) {
          this._pairETHUSD.chainId = parsedData.chanId
        } else if (parsedData.channel === 'book') {
          if (parsedData.symbol === TOKEN_SYMBOLS.BTCUSD) {
            this._pairBTCUSD.chainId = parsedData.chanId
          } else if (parsedData.symbol === TOKEN_SYMBOLS.ETHUSD) {
            this._pairETHUSD.chainId = parsedData.chanId
          }
        }
      } else {
        if (parsedData[0] === this._pairBTCUSD.chainId) {
          this.setBidAskBTCUSD(parsedData)
        } else if (parsedData[0] === this._pairETHUSD.chainId) {
          this.setBidAskETHUSD(parsedData)
        }
      }
    })
  }

  private setBidAskBTCUSD (parsedData: any): void {
    if (typeof parsedData[1] !== 'object') {
      return
    }
    const tradingPair = parsedData[1]
    this._pairBTCUSD.bid = tradingPair[0]
    this._pairBTCUSD.bidSize = tradingPair[1]
    this._pairBTCUSD.ask = tradingPair[2]
    this._pairBTCUSD.askSize = tradingPair[3]
    this._pairBTCUSD.dailyChange = tradingPair[4]
    this._pairBTCUSD.dailyChangeRelative = tradingPair[5]
    this._pairBTCUSD.lastPrice = tradingPair[6]
    this._pairBTCUSD.volume = tradingPair[7]
    this._pairBTCUSD.high = tradingPair[8]
    this._pairBTCUSD.low = tradingPair[9]
  }

  private setBidAskETHUSD (parsedData: any): void {
    if (typeof parsedData[1] !== 'object') {
      return
    }
    const tradingPair = parsedData[1]
    this._pairETHUSD.bid = tradingPair[0]
    this._pairETHUSD.bidSize = tradingPair[1]
    this._pairETHUSD.ask = tradingPair[2]
    this._pairETHUSD.askSize = tradingPair[3]
    this._pairETHUSD.dailyChange = tradingPair[4]
    this._pairETHUSD.dailyChangeRelative = tradingPair[5]
    this._pairETHUSD.lastPrice = tradingPair[6]
    this._pairETHUSD.volume = tradingPair[7]
    this._pairETHUSD.high = tradingPair[8]
    this._pairETHUSD.low = tradingPair[9]
  }

  public calculateTradeAmount (
    tokenSymbol: TOKEN_SYMBOLS,
    amount: number,
    typeOperation: 'sell' | 'buy'
  ): number {
    if (tokenSymbol === TOKEN_SYMBOLS.BTCUSD) {
      if (typeOperation === 'sell') {
        return amount * this._pairBTCUSD.ask
      } else {
        return amount * this._pairBTCUSD.bid
      }
    } else if (tokenSymbol === TOKEN_SYMBOLS.ETHUSD) {
      if (typeOperation === 'sell') {
        return amount * this._pairETHUSD.ask
      } else {
        return amount * this._pairETHUSD.bid
      }
    }
    throw new Error('Token symbol not found')
  }
}
