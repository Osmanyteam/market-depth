/* eslint-disable @typescript-eslint/no-misused-promises */
import PairTradeController from '@api/pairTrade/pairTrade.controller'
import { type Request, type Response, Router } from 'express'
import PairTradeService from '@api/pairTrade/pairTrade.service'
import BitfinexService from '@services/bitfinex.service'

const pairTradeController = new PairTradeController(
  new PairTradeService(new BitfinexService())
)

const router = Router()
/**
 * GET /api/v1/trade/{tokenSymbol}
 * @tags PairTrade
 * @summary Get pair order book
 * @param {string} tokenSymbol.path
 * @returns {BidAskPair} 200 - Info about pair order book
 * @returns {object} 400 - Bad request
 * @example request - 400 - Bad request
 * {
 *   "message": "Bad request",
 *  "error": [
 *   {
 *      "code": "custom",
 *      "message": "Invalid input",
 *      "path": [
 *        "tokenSymbol"
 *      ]
 *    }
 *  ]
 * }
 */
router.get('/trade/:tokenSymbol', async (req: Request, res: Response) => {
  await pairTradeController.getPairOrderBook(req, res)
})

/**
 * A CalculatePairTradeRequest
 * @typedef {object} CalculatePairTradeRequest
 * @property {string} tokenSymbol.required - Token symbol - eg: BTCUSD
 * @property {number} amount.required - Amount of token
 * @property {string} type.required - Type of trade - eg: sell, buy
 */

/**
 * A CalculatePairTradeResponse
 * @typedef {object} CalculatePairTradeResponse
 * @property {number} price.required - Price of trade
 */

/**
 * POST /api/v1/trade
 * @tags PairTrade
 * @summary Calculate pair trade
 * @param {CalculatePairTradeRequest} request.body.required
 * @returns {CalculatePairTradeResponse} 200 - Price of trade
 * @returns {object} 400 - Bad request
 * @example response - 400 - Bad request
 * {
 *  "message": "Bad request",
 *  "error": [
 *    {
 *      "code": "custom",
 *      "message": "Invalid input",
 *      "path": [
 *        "tokenSymbol"
 *      ]
 *    },
 *    {
 *      "code": "too_small",
 *      "minimum": 0,
 *      "type": "number",
 *      "inclusive": false,
 *      "exact": false,
 *      "message": "Number must be greater than 0",
 *      "path": [
 *        "amount"
 *      ]
 *    },
 *    {
 *      "code": "custom",
 *      "message": "Invalid input",
 *      "path": [
 *        "type"
 *      ]
 *    }
 *  ]
 * }
 */
router.post('/trade', async (req: Request, res: Response) => {
  await pairTradeController.calculatePairTrade(req, res)
})

export default router
