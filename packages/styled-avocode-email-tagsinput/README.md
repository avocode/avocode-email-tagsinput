# styled-avocode-email-tagsinput

React input component for displaying tags. This componenty needs to be controlled from outside in order to work correctly. The input is rendered as SlateJS editor.
This component is wrapper for `AvocodeEmailTagsInput` component ([`@avocode/avocode-email-tagsinput`](https://www.npmjs.com/package/@avocode/avocode-email-tagsinput)) and contains opinionated styles based on [Avocode UI kit](https://www.npmjs.com/package/avocode-ui).

This library exposes component `StyledAvocodeEmailTagsInput` which accepts `theme` prop and controls the visual style of the input. Please refer to the [documentation of `@avocode/avocode-email-tagsinput`](https://github.com/avocode/avocode-email-tagsinput/blob/master/packages/avocode-email-tagsinput/readme.MD) for more information.

Also `utils` object is exposed as well, along Flow type definitions.

## Usage

```js
import StyledAvocodeEmailTagsInput from '@avocode/styled-avocode-email-tagsinput'
import '@avocode/styled-avocode-email-tagsinput/dist/main.css';

// [...]
  render() {
    return (
      <StyledAvocodeEmailTagsInput
        theme='light'
        tags={this.state.tags}
        query={this.state.query}
        onQueryChangeRequest={this._handleQueryChange}
        onTagAddRequest={this._handleTagAdd}
        onTagDeleteRequest={this._handleTagDelete}
      />
    )
  }
```

## StyledAvocodeEmailTagsInput API

This input receives the same props as components in **@avocode/avocode-email-tagsinput** library.

In short you need to pass at least these props:

* `tags`
* `query`
* `onQueryChangeRequest`
* `onTagAddRequest`
* `onTagDeleteRequest`

### `theme?: 'light' | 'dark'`

Sets light or dark theme. This prop can be ommited and default theme is set to light. Variables used with each theme are then applied to given CSS classes.

### `error?: any`

Style component for default error state. If the value evaluates as truthy, it's considered that the input has error. Additionally you can add `state` property with value `"error"` to Tag object to mark specific emails as errored as well (for example validation errors).
