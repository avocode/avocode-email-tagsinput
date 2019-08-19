import { expect } from 'chai'
import * as utils from '../lib/utils'

describe('utils', () => {
  it('should return func', () => {
    const { parseValue } = utils

    expect(parseValue).to.be.instanceOf(Function)
  })
})
