// @flow

import { expect } from 'chai'
import * as utils from '../../../lib/utils'

describe('utils', () => {
  describe('removeTagsByIndices', () => {
    it('should not remove any tags if indices are empty', () => {
      const tags = [ { value: 'a' }, { value: 'b' } ]
      const indices = []

      expect(utils.removeTagsByIndices(tags, indices))
        .to.deep.equal(tags)
    })


    it('should remove single tag by single index', () => {
      const tags = [ { value: 'a' }, { value: 'b' } ]
      const indices = [ 0 ]

      expect(utils.removeTagsByIndices(tags, indices))
        .to.deep.equal([ { value: 'b' } ])
    })


    it('should multiple tags by multiple indices', () => {
      const tags = [ { value: 'a' }, { value: 'b' }, { value: 'c' } ]
      const indices = [ 0, 2 ]

      expect(utils.removeTagsByIndices(tags, indices))
        .to.deep.equal([ { value: 'b' } ])
    })


    it('should not remove tags when index does not exist', () => {
      const tags = [ { value: 'a' }, { value: 'b' } ]
      const indices = [ 3 ]

      expect(utils.removeTagsByIndices(tags, indices))
        .to.deep.equal(tags)
    })
  })
})
