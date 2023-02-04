
import { type Request, type Response } from 'express'
import { z } from 'zod'
import { ValidateController } from '../../core/decorators'
import { isTokenSymbol, type TOKEN_SYMBOLS } from '../../services/bitfinex.service'
import type PairTradeService from './pairTrade.service'

const tokenSymbolValidation = z.string().refine((value: string) => {
  try {
    isTokenSymbol(value as unknown as TOKEN_SYMBOLS)
  } catch (error) {
    return false
  }
  return true
})

export default class PairTradeController {
  public pairTradeService: PairTradeService

  constructor (pairTradeService: PairTradeService) {
    this.pairTradeService = pairTradeService
  }

  @ValidateController({
    params: z.object({
      tokenSymbol: tokenSymbolValidation
    })
  })
  public async getPairOrderBook (req: Request, res: Response): Promise<void> {
    const { tokenSymbol } = req.params
    const pairOrderBook = await this.pairTradeService
      .getPairOrderBook(tokenSymbol as unknown as TOKEN_SYMBOLS)
    res.json(pairOrderBook)
  }

  @ValidateController({
    body: z.object({
      tokenSymbol: tokenSymbolValidation,
      amount: z.number().positive(),
      type: z.string().refine((value: string) => ['sell', 'buy'].includes(value))
    })
  })
  public async calculatePairTrade (req: Request, res: Response): Promise<void> {
    const { tokenSymbol, amount, type } = req.body
    const pairTradeAmount = await this.pairTradeService.calculatePairTrade(tokenSymbol, amount, type)
    res.json({ price: pairTradeAmount })
  }
}
