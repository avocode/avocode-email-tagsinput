// @flow

import React from 'react'
import { mount, shallow } from 'enzyme'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'
import chaiSinon from 'chai-sinon'
import uuid from 'uuid'
import { Text } from 'slate'

import TagsInput from '../../../lib/components/tagsinput'
import { testAsync } from '../test-utils'

chai.use(chaiEnzyme())
chai.use(chaiSinon)

describe('TagsInput', () => {
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
      <TagsInput {...defaultProps} {...props} />,
      { lifecycleExperimental: true }
    )
  }

  // NOTE: The input relies heavily on `ref` editor
  // instance so that's why we need to mount the
  // component
  const renderMountedComponent = (props = {}) => {
    const defaultProps = getDefaultProps()

    return mount(
      <TagsInput {...defaultProps} {...props} />
    )
  }

  it('should render container', () => {
    const wrapper = renderComponent()

    expect(wrapper.find('.tagsinput')).to.exist
  })


  it('should render named container', () => {
    const wrapper = renderComponent({ name: 'test' })

    expect(wrapper.find('.tagsinput--test')).to.exist
  })


  it('should render Slate Editor', () => {
    const wrapper = renderComponent({ name: 'test' })

    expect(wrapper.find('Editor')).to.exist
  })


  it('should render focused container', (callback) => {
    const wrapper = renderMountedComponent({
      // TODO: Double-check if we can manage on click focus
      // with non-empty query
      query: '',
    })

    const editorInstance = wrapper.instance()._input

    wrapper.find('Editor').simulate(
      'click',
      new Event('click'),
      editorInstance,
      () => {}
    )

    testAsync(callback, () => {
      expect(wrapper.find('.tagsinput--focused')).to.exist
    }, 100)
  })

  describe('initial value', () => {
    it('should create editor with blank value ' +
       'if query is empty', (callback) => {
      const wrapper = renderComponent({
        query: '',
        tags: [],
      })

      testAsync(callback, () => {
        expect(
          wrapper.find('Editor').props().value.document.text
        ).to.equal('')
      })
    })


    it('should create editor with value ' +
       'of query', (callback) => {
      const wrapper = renderMountedComponent({
        query: 'hello',
        tags: [],
      })

      testAsync(callback, () => {
        expect(
          wrapper.find('Editor').props().value.document.text
        ).to.equal('hello')
      })
    })


    it('should create editor with value ' +
       'of tags', (callback) => {
      const wrapper = renderMountedComponent({
        query: '',
        tags: [ { value: 'tag1' }, { value: 'tag2' } ],
      })

      testAsync(callback, () => {
        const tags = wrapper.find('Editor').props()
          .value.document.getInlinesByType('tag')

        expect(tags.get(0).get('data').get('tagContents'))
          .to.equal('tag1')
        expect(tags.get(1).get('data').get('tagContents'))
          .to.equal('tag2')
      })
    })
  })

  // NOTE: Simulate "componentWillReceiveProps"
  describe('updating value', () => {
    // TODO: This is a bug and should probably be fixed
    // but we don't want to break anything
    xit('should update query', (callback) => {
      const wrapper = renderMountedComponent({
        query: '',
        tags: [],
      })

      wrapper.setProps({
        query: 'test',
      })

      testAsync(callback, () => {
        expect(
          wrapper.find('Editor').props().value.document.text
        ).to.equal('test')
      })
    })


    it('should update tags when tags are added', (callback) => {
      const wrapper = renderMountedComponent({
        query: '',
        tags: [],
      })

      wrapper.setProps({
        tags: [ { value: 'test1' } ],
      })

      testAsync(callback, () => {
        const tags = wrapper.find('Editor').props()
          .value.document.getInlinesByType('tag')

        expect(tags.get(0).get('data').get('tagContents'))
          .to.equal('test1')
      })
    })


    it('should update tags when tags are removed', (callback) => {
      const wrapper = renderMountedComponent({
        query: '',
        tags: [ { value: 'test1' } ],
      })

      wrapper.setProps({
        tags: [],
      })

      testAsync(callback, () => {
        const tags = wrapper.find('Editor').props()
          .value.document.getInlinesByType('tag')

        expect(tags.size).to.equal(0)
      })
    })


    it('should update tags when tags are updated', (callback) => {
      const wrapper = renderMountedComponent({
        query: '',
        tags: [ { value: 'test1' }, { value: 'test2' } ],
      })

      wrapper.setProps({
        tags: [
          { value: 'test10' },
          { value: 'test2', state: 'warning' },
        ],
      })

      testAsync(callback, () => {
        const tags = wrapper.find('Editor').props()
          .value.document.getInlinesByType('tag')

        expect(tags.get(0).get('data').get('tagContents'))
          .to.equal('test10')
        expect(tags.get(1).get('data').get('tagContents'))
          .to.equal('test2')
        expect(tags.get(1).get('data').get('tagState'))
          .to.equal('warning')
      })
    })


    it('should update tags and query when both are updated', (callback) => {
      const wrapper = renderMountedComponent({
        query: '',
        tags: [ { value: 'test1' }, { value: 'test2' } ],
      })

      wrapper.setProps({
        query: 'hello',
        tags: [ { value: 'test10' }, { value: 'test2' } ],
      })

      testAsync(callback, () => {
        expect(
          wrapper.find('Editor').props().value.document.text
        ).to.equal('hello')

        const tags = wrapper.find('Editor').props()
          .value.document.getInlinesByType('tag')

        expect(tags.get(0).get('data').get('tagContents'))
          .to.equal('test10')
        expect(tags.get(1).get('data').get('tagContents'))
          .to.equal('test2')
      })
    })
  })

  describe('user interaction', () => {
    // TODO: Figure out how to trigger keyboard events to
    // simulate user change
    xit('should call onQueryChangedRequest when user types ' +
       'into input', (callback) => {
      const props = {
        query: '',
        tags: [],
        onQueryChangedRequest: sinon.spy(),
      }
      const wrapper = renderMountedComponent(props)
      const editorInstance = wrapper.instance()._input
      const event = new KeyboardEvent('keypress', { keyCode: 65 })

      wrapper.find('Editor').simulate('click', new MouseEvent('click'), editorInstance, () => {})
      wrapper.find('Editor').simulate('keypress', event, editorInstance, () => {})

      testAsync(callback, () => {
        expect(props.onQueryChangedRequest).to.have.been.calledWith('a')
      })
    })
  })
})

