import React from 'react'
import TagsInput, { utils } from '@avocode/better-react-tagsinput'

import type { Query, Tags } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
  cssDoc: string,
}

const cssDocID = '/* DOC=styled */'

export default class Styling extends React.PureComponent<{}, State> {
  state = {
    query: '',
    tags: [
      { value: 'xyz' },
      { value: 'abc' },
    ],
    cssDoc: '',
  }

  componentDidMount() {
    const style = Array.from(document.head.getElementsByTagName('style')).find((n) => n.innerHTML.startsWith(cssDocID))

    const cssDoc = style ? style.innerHTML.replace(cssDocID, '') : ''

    this.setState({ cssDoc })
  }

  _handleQueryChange = (query: Query) => {
    this.setState({
      query,
    })
  }

  _handleTagAdded = (text: Query) => {
    this.setState((prevState) => {
      return {
        tags: [ ...prevState.tags, { value: text } ],
        query: '',
      }
    })
  }

  _handleTagDeleted = (indices: Array<number>) => {
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
    return (
      <div>
        <p>
          Look into source css files bundled with the library to see what CSS is applied. By default you should include the base stylesheet:
        </p>
        <code>
          @import '../node_modules/better-react-tagsinput/dist/main.css'
        </code>
        <p>
          That will make sure that the input looks and behaves properly.
          This example overrides some of the base classes to get custom look.
        </p>
        <pre>
          <code>
            {this.state.cssDoc}
          </code>
        </pre>
        <TagsInput
          name='styled'
          query={this.state.query}
          tags={this.state.tags}
          onPasteRequest={this._handlePaste}
          onQueryChangeRequest={this._handleQueryChange}
          onTagAddRequest={this._handleTagAdded}
          onTagDeleteRequest={this._handleTagDeleted}
        />
      </div>
    )
  }
}

