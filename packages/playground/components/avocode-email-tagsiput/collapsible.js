import React from 'react'
import AvocodeEmailTagsInput, { utils } from '@avocode/avocode-email-tagsinput'

export default class Collapsible extends React.PureComponent {
  state = {
    tags: [
      { value: 'test@test.com' },
      { value: 'test2@test.com' },
      { value: 'test3@test.com' },
      { value: 'test4@test.com' },
    ],
    query: '',
  }

  _handleTagAdd = (event, text) => {
    this.setState((prevState) => {
      return {
        query: '',
        tags: [ ...prevState.tags, { value: text } ],
      }
    })
  }

  _handleQueryChange = (query) => {
    this.setState({ query })
  }

  _handleTagDelete = (event, indices) => {
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

