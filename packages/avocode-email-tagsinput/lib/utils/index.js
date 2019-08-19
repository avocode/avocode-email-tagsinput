// @flow
import { utils } from 'better-react-tagsinput'

import type { Tags } from 'better-react-tagsinput'

const VALIDATION_EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const isValueValidEmail = (value: string): boolean => {
  return VALIDATION_EMAIL_REGEX.test(value)
}

const getUniqueTagsByValue = (tags: Tags): Tags => {
  return tags.reduce((tagList, tag) => {
    const isDuplicate = tagList.find((candidate) => {
      return candidate.value === tag.value
    })

    return isDuplicate ? tagList : [ ...tagList, tag ]
  }, [])
}

const { parseValue, removeTagsByIndices } = utils

export {
  parseValue,
  removeTagsByIndices,
  isValueValidEmail,
  getUniqueTagsByValue,
}
