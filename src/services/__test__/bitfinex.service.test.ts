import BitfinexService from '../bitfinex.service'

describe('Bitfinex Service', () => {
  const bitfinexService = new BitfinexService()
  it('after 10 seconds pairBTCUSD should be not empty', async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000))
    expect(bitfinexService.pairBTCUSD).not.toEqual({
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
    })
  }, 20000)
  it('after 10 seconds pairBTCUSD should be not empty', async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000))
    expect(bitfinexService.pairBTCUSD).not.toEqual({
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
    })
  }, 20000)
})
