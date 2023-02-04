
import { type Request, type Response } from 'express'
import { z } from 'zod'
import { ValidateController } from '../../core/decorators'
import { isTokenSymbol, type TOKEN_SYMBOLS } from '../../services/bitfinex.service'
import type PairTradeService from './pairTrade.service'

export default class PairTradeController {
  public pairTradeService: PairTradeService

  constructor (pairTradeService: PairTradeService) {
    this.pairTradeService = pairTradeService
  }

  @ValidateController({
    params: z.object({
      tokenSymbol: z.string().refine((value: string) => {
        try {
          isTokenSymbol(value as unknown as TOKEN_SYMBOLS)
        } catch (error) {
          return false
        }
        return true
      })
    })
  })
  public async getPairOrderBook (req: Request, res: Response): Promise<void> {
    const { tokenSymbol } = req.params
    const pairOrderBook = await this.pairTradeService.getPairOrderBook(tokenSymbol as unknown as TOKEN_SYMBOLS)
    res.json(pairOrderBook)
  }
}
