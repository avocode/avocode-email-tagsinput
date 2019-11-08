// @flow

import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import chaiSinon from 'chai-sinon'
import uuid from 'uuid'

import CollapsibleTagsinput from '../../../lib/components/collapsible-tagsinput'
import { testAsync } from '../test-utils'

chai.use(chaiEnzyme())
chai.use(chaiSinon)

describe('CollapsibleTagsinput', () => {
  const getRandomTags = (length = Math.ceil(Math.random() * 10)) => {
    return Array.from({ length }, () => uuid.v4())
  }

  const getDefaultProps = () => {
    return {
      query: uuid.v4(),
      tags: getRandomTags(),
      onQueryChangeRequest: sinon.spy(),
      onTagAddRequest: sinon.spy(),
      onTagDeleteRequest: sinon.spy(),
    }
  }
  const renderComponent = (props = {}) => {
    const defaultProps = getDefaultProps()

    return shallow(
      <CollapsibleTagsinput {...defaultProps} {...props} />,
      { lifecycleExperimental: true }
    )
  }

  const renderMountedComponent = (props = {}) => {
    const defaultProps = getDefaultProps()

    return mount(
      <CollapsibleTagsinput {...defaultProps} {...props} />
    )
  }


  it('should render container', () => {
    const wrapper = renderComponent()

    expect(wrapper.find('.collapsible-tagsinput'))
      .to.exist
  })


  it('should render named container', () => {
    const wrapper = renderComponent({
      name: 'test',
    })

    expect(wrapper.find('.collapsible-tagsinput--test'))
      .to.exist
  })


  it('should render collapsed container by default', () => {
    const wrapper = renderComponent()

    expect(wrapper.find('.collapsible-tagsinput--collapsed'))
      .to.exist
  })


  it('should render named collapsed container', () => {
    const wrapper = renderComponent({
      name: 'test',
    })

    expect(wrapper.find('.collapsible-tagsinput--test--collapsed'))
      .to.exist
  })


  it('should render TagsInput', () => {
    const wrapper = renderComponent()

    expect(wrapper.find('TagsInput'))
      .to.exist
  })

  describe('passing props for TagsInput', () => {
    it('should pass addTagKeyCodes to TagsInput', () => {
      const wrapper = renderComponent({
        addTagKeyCodes: [ 99 ],
      })

      expect(wrapper.find('TagsInput').props().addTagKeyCodes)
        .to.deep.equal([ 99 ])
    })


    it('should pass onQueryChangeRequest to TagsInput', () => {
      const props = {
        onQueryChangeRequest: sinon.spy(),
      }
      const wrapper = renderComponent(props)

      expect(wrapper.find('TagsInput').props().onQueryChangeRequest)
        .to.equal(props.onQueryChangeRequest)
    })


    it('should pass onTagAddRequest to TagsInput', () => {
      const props = {
        onTagAddRequest: sinon.spy(),
      }
      const wrapper = renderComponent(props)

      expect(wrapper.find('TagsInput').props().onTagAddRequest)
        .to.equal(props.onTagAddRequest)
    })


    it('should pass onTagDeleteRequest to TagsInput', () => {
      const props = {
        onTagDeleteRequest: sinon.spy(),
      }
      const wrapper = renderComponent(props)

      expect(wrapper.find('TagsInput').props().onTagDeleteRequest)
        .to.equal(props.onTagDeleteRequest)
    })
  })
})

