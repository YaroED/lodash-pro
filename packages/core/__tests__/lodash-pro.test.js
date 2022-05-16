const lodashPro = require('../index')

describe('lodash-pro', () => {
  test('isPhone', () => {
    expect(lodashPro.isPhone(13312341234)).toBe(true)
  })
  test('random', () => {
    expect(lodashPro._.max([100, 1000])).toBe(1000)
  })
})
