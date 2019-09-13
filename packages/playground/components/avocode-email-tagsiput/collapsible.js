// @flow

import React from 'react'
import AvocodeEmailTagsInput, { utils } from '@avocode/avocode-email-tagsinput'

import type { Query, Tags } from '@avocode/avocode-email-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
}

export default class Collapsible extends React.PureComponent<{}, State> {
  state = {
    tags: [
      { value: 'test@test.com' },
      { value: 'test2@test.com' },
      { value: 'test3@test.com' },
      { value: 'test4@test.com' },
      { value: 'test@test.com' },
      { value: 'test2@test.com' },
      { value: 'test3@test.com' },
      { value: 'test4@test.com' },
      { value: 'test@test.com' },
      { value: 'test2@test.com' },
      { value: 'test3@test.com' },
      { value: 'test4@test.com' },
    ],
    query: '',
  }

  _handleTagAdd = (
    text: Query,
    event: SyntheticKeyboardEvent<*>
  ) => {
    this.setState((prevState) => {
      return {
        query: '',
        tags: [ ...prevState.tags, { value: text } ],
      }
    })
  }

  _handleQueryChange = (query: Query) => {
    this.setState({ query })
  }

  _handleTagDelete = (
    indices: Array<number>,
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
  ) => {
    this.setState((prevState) => {
      const nextTags = utils.removeTagsByIndices(
        prevState.tags,
        indices
      )

      return {
        tags: nextTags,
      }
    })
  }

  _addRandomTag = (event: SyntheticKeyboardEvent<*>) => {
    this._handleTagAdd(
      String(`value-${Date.now().toString()}@avocode.com`),
      event
    )
  }

  render() {
    const codeSnippet = "\
(({ tagCount, focused }) => (\n\
  (!focused && tagCount > 0) &&\n\
    <MyCustomCountComponent count={tagCount} />\n\
))"

    return (
      <div>
        <p>
          Passing <code>collapsible=true</code> will render the input as collapsible that will
          display counter by default
        </p>

        <p>
          Add random tag programatically with this button.
          <br />
          <button onClick={this._addRandomTag}>Add +</button>
        </p>

        <strong>Props</strong>
        <dl>
          <dt>tags</dt>
          <dd>{this.state.tags.map(t => JSON.stringify(t)).join(' , ')}</dd>
          <dt>query</dt>
          <dd>{this.state.query}</dd>
        </dl>

        <AvocodeEmailTagsInput
          collapsible
          name='email-collapsible'
          tags={this.state.tags}
          query={this.state.query}
          onTagAddedRequest={this._handleTagAdd}
          onQueryChangedRequest={this._handleQueryChange}
          onTagDeleteRequest={this._handleTagDelete}
        />

        <p>
          You can also pass prop <code>renderCounter</code>. This is render prop function that 
          receives argument object with <code>tagCount</code> and <code>focused</code> arguments:
        </p>
        <pre><code>{codeSnippet}</code></pre>
        <p>
          With additional CSS styling you can achieve different look and positioning.
        </p>

        <AvocodeEmailTagsInput
          collapsible
          name='custom-email-collapsible'
          tags={this.state.tags}
          query={this.state.query}
          onTagAddedRequest={this._handleTagAdd}
          onQueryChangedRequest={this._handleQueryChange}
          onTagDeleteRequest={this._handleTagDelete}
          renderCounter={({ focused, tagCount }) => (
            (!focused && tagCount > 0) && (
              <div className='email-collapsible-custom-counter'>
                { tagCount }
              </div>
            )
          )}
        />
      </div>
    )
  }
}

