/* eslint-disable @typescript-eslint/no-misused-promises */
import PairTradeController from './pairTrade.controller'
import { type Request, type Response, Router } from 'express'
import PairTradeService from './pairTrade.service'
import BitfinexService from '../../services/bitfinex.service'
import config from '../../core/config'

class PairTradeRouter {
  protected readonly pairTradeController: PairTradeController

  constructor () {
    this.pairTradeController = new PairTradeController(
      new PairTradeService(
        new BitfinexService(config.BITFINEX_API_KEY, config.BITFINEX_SECRET_KEY)
      )
    )
  }

  public getRouter (): Router {
    const router = Router()
    /**
     * GET /api/v1/trade/{tokenSymbol}
     * @summary Get pair order book
     * @param {string} tokenSymbol.path
     * @returns {object} 200 - An array of user info
     */
    router.get('/trade/:tokenSymbol', async (req: Request, res: Response) => {
      await this.pairTradeController.getPairOrderBook(req, res)
    })

    return router
  }
}

export default PairTradeRouter
