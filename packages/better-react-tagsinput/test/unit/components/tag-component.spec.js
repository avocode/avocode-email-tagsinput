// @flow

import React from 'react'
import { shallow } from 'enzyme'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'
import chaiSinon from 'chai-sinon'
import uuid from 'uuid'

import TagComponent from '../../../lib/components/tag-component'

chai.use(chaiEnzyme())
chai.use(chaiSinon)

describe('TagComponent', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      id: uuid.v4(),
      isFocused: Math.random() >= 0.5,
      data: null,
      title: uuid.v4(),
      contents: uuid.v4(),
      onRemoveButtonClick: sinon.spy(),
    }

    return shallow(
      <TagComponent
        {...defaultProps}
        {...props }
      />
    )
  }


  it('should render contents', () => {
    const wrapper = renderComponent({ contents: 'abcd' })

    expect(wrapper).to.have.text('abcd')
  })


  it('should render children', () => {
    const children = <div className='test' />
    const wrapper = renderComponent({ children })

    expect(wrapper.find('.test')).to.exist
  })


  describe('wrapper', () => {
    it('should render component wrapper', () => {
      const wrapper = renderComponent()

      expect(wrapper.find('.tag')).to.exist
    })


    it('should render title on wrapper', () => {
      const wrapper = renderComponent({ title: 'A title' })

      expect(wrapper.find('.tag').props().title).to.equal('A title')
    })


    it('should generate class name based on name prop', () => {
      const wrapper = renderComponent({ name: 'test' })

      expect(wrapper.find('.tag--test')).to.exist
    })


    it('should generate class name based on default name prop', () => {
      const wrapper = renderComponent({ defaultName: 'test-default' })

      expect(wrapper.find('.tag--test-default')).to.exist
    })


    it('should generate class name based on focused prop', () => {
      const wrapper = renderComponent({ isFocused: true })

      expect(wrapper.find('.tag--focused')).to.exist
    })


    it('should generate class name based on focused and name prop', () => {
      const wrapper = renderComponent({
        isFocused: true,
        name: 'test',
      })

      expect(wrapper.find('.tag--test--focused')).to.exist
    })


    it('should generate class name based on focused and ' +
       'default name prop', () => {
      const wrapper = renderComponent({
        isFocused: true,
        defaultName: 'test-default',
      })

      expect(wrapper.find('.tag--test-default--focused')).to.exist
    })


    it('should generate class name based on state prop', () => {
      const wrapper = renderComponent({ state: 'warning' })

      expect(wrapper.find('.tag--warning')).to.exist
    })


    it('should generate class name based on state and name prop', () => {
      const wrapper = renderComponent({
        state: 'warning',
        name: 'test',
      })

      expect(wrapper.find('.tag--test--warning')).to.exist
    })


    it('should generate class name based on state ,name ' +
       'and focused props', () => {
      const wrapper = renderComponent({
        state: 'warning',
        name: 'test',
        isFocused: true,
      })

      expect(wrapper.find('.tag--test--warning--focused')).to.exist
    })
  })

  describe('container', () => {
    it('should render container', () => {
      const wrapper = renderComponent()

      expect(wrapper.find('.tag__container')).to.exist
    })


    it('should generate class name based on name prop', () => {
      const wrapper = renderComponent({ name: 'test' })

      expect(wrapper.find('.tag__container--test')).to.exist
    })


    it('should generate class name based on default name prop', () => {
      const wrapper = renderComponent({ defaultName: 'test-default' })

      expect(wrapper.find('.tag__container--test-default')).to.exist
    })


    it('should generate class name based on state prop', () => {
      const wrapper = renderComponent({ state: 'warning' })

      expect(wrapper.find('.tag__container--warning')).to.exist
    })
  })

  describe('label', () => {
    it('should render label', () => {
      const wrapper = renderComponent()

      expect(wrapper.find('.tag__label')).to.exist
    })


    it('should generate class name based on name prop', () => {
      const wrapper = renderComponent({ name: 'test' })

      expect(wrapper.find('.tag__label--test')).to.exist
    })


    it('should generate class name based on default name prop', () => {
      const wrapper = renderComponent({ defaultName: 'test-default' })

      expect(wrapper.find('.tag__label--test-default')).to.exist
    })


    it('should generate class name based on state prop', () => {
      const wrapper = renderComponent({ state: 'warning' })

      expect(wrapper.find('.tag__label--warning')).to.exist
    })
  })

  describe('remove button', () => {
    it('should render remove button', () => {
      const wrapper = renderComponent()

      expect(wrapper.find('.tag__remove-button')).to.exist
    })


    it('should generate class name based on name prop', () => {
      const wrapper = renderComponent({ name: 'test' })

      expect(wrapper.find('.tag__remove-button--test')).to.exist
    })


    it('should generate class name based on default name prop', () => {
      const wrapper = renderComponent({ defaultName: 'test-default' })

      expect(wrapper.find('.tag__remove-button--test-default')).to.exist
    })


    it('should generate class name based on state prop', () => {
      const wrapper = renderComponent({ state: 'warning' })

      expect(wrapper.find('.tag__remove-button--warning')).to.exist
    })


    it('should prevent event on handle mouse down', (callback) => {
      const event = new MouseEvent('mousedown')
      // $FlowFixMe: Ignore for now
      event.preventDefault = () => {
        callback()
      }
      const wrapper = renderComponent()

      wrapper.find('.tag__remove-button').simulate('mousedown', event)
    })


    it('should call onRemoveButtonClick callback with tag ID ' +
       'and event', () => {
      const event = new MouseEvent('mousedown')
      const props = {
        id: 'abc',
        onRemoveButtonClick: sinon.spy(),
      }
      const wrapper = renderComponent(props)

      wrapper.find('.tag__remove-button').simulate('click', event)

      expect(props.onRemoveButtonClick).to.have.been.calledWith(
        event,
        'abc'
      )
    })
  })
})

