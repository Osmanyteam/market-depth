import App from '../../../app'
import PairTraRouter from '../pairTrade.router'
import request from 'supertest'

const app = new App([PairTraRouter]).app

describe('Pair Trade', () => {
  it('should return 200 OK', () => {
    return request(app).get('/api/v1/trade/tBTCUSD').expect(200)
  })
  it('should return 200 OK', () => {
    return request(app).get('/api/v1/trade/tETHUSD')
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          bid: expect.any(Number),
          bidSize: expect.any(Number),
          ask: expect.any(Number),
          askSize: expect.any(Number),
          dailyChange: expect.any(Number),
          dailyChangeRelative: expect.any(Number),
          lastPrice: expect.any(Number),
          volume: expect.any(Number),
          high: expect.any(Number),
          low: expect.any(Number)
        }))
      })
  })
  it('should return 400 ERROR', () => {
    return request(app).get('/api/v1/trade/tETHSD').expect(400)
  })
})

describe('Pair Trade Calculate', () => {
  it('should return 200 OK', () => {
    return request(app)
      .post('/api/v1/trade')
      .send({
        tokenSymbol: 'tBTCUSD',
        amount: 1,
        type: 'buy'
      })
      .expect(200)
  })
  it('should return 200 OK', () => {
    return request(app)
      .post('/api/v1/trade')
      .send({
        tokenSymbol: 'tETHUSD',
        amount: 1,
        type: 'sell'
      })
      .expect(200)
  })
  it('should return 400 ERROR with custom error validation', () => {
    return request(app)
      .post('/api/v1/trade')
      .send({
        tokenSymbol: 'tETUSD', // invalid token symbol
        amount: '1', // invalid amount
        type: 'se' // invalid type
      })
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual({
          message: 'Bad request',
          error: [
            {
              code: 'custom',
              message: 'Invalid input',
              path: ['tokenSymbol']
            },
            {
              code: 'invalid_type',
              expected: 'number',
              message: 'Expected number, received string',
              path: ['amount'],
              received: 'string'
            },
            {
              code: 'custom',
              message: 'Invalid input',
              path: ['type']
            }
          ]
        })
      })
  })
  it('it should return 400 ERROR with too_small error validation', () => {
    return request(app)
      .post('/api/v1/trade')
      .send({
        tokenSymbol: 'tETHUSD',
        amount: -1, // invalid amount
        type: 'sell'
      })
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual({
          message: 'Bad request',
          error: [
            {
              code: 'too_small',
              minimum: 0,
              type: 'number',
              inclusive: false,
              exact: false,
              message: 'Number must be greater than 0',
              path: ['amount']
            }
          ]
        })
      })
  })
})
