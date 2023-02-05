import config from '../config'

function isInDesiredForm (str: string): boolean {
  return /^\+?(0|[1-9]\d*)$/.test(str)
}
describe('config', () => {
  it('should return the correct config', () => {
    expect(config.NODE_ENV).toBe('test')
    // port have to be a number string with positive value
    expect(isInDesiredForm(config.PORT)).toBe(true)
  })
})
