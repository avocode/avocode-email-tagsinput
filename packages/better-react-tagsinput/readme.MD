# better-react-tagsinput

React input component for displaying tags. This componenty needs to be controlled from outside in order to work correctly. The input is rendered as SlateJS editor.

## TagsInput API

### `query: string`

The text value of the input which is created by user typing via keyboard.

### `tags: Array<Tag>`

The tags that are rendered inside the input. The input renders tats first and then the query is rendered as last.

`Tag` is a javascript object that contains data and metadata describing it:

```
{
  value: string,
  state?: string | number,
  data?: Object,
}
```

The important and required property is `value` which is the text value that is rendered in the tag. The `state` can be used for identifying the state of the tag. The default Tag component uses state as class name. For example setting value of `state` to _error_ would append _error_ to a class name and you could render that specific tag in error state.

### `addTagKeyCodes: Array<number>`

Javascript event keyboard codes. These keys trigger adding a new tag. By default *Space*, *Enter* and *Comma* keys are used.

### `tagComponentFactory: (props) => React$Node`

Render props for rendering custom tag component. The callback receives props such as `isFocused` (if cursor is focused on tag), `contents` (text content of tag), `state` (state value of tag) and others. Look at source code of the `tag-component` to see how to correctly create your own component.

### `plugins: Array<Plugin`

Override default plugin. See [plugins](#plugins).

### `onQueryChangeRequest: (query: string)`

Callback that is triggered when user types in the input. The argument is the value of the input.

### `onTagAddRequest: (text: string, event: Event)`

Callback that is triggered if any of the `addTagKeyCodes` keys has been pressed. The event object is passed as first argument. Second argument is the text value of new tag.

### `onTagDeleteRequest: (indices: Array<number>, event: Event)`

Callback that is triggered when tag / tags are deleted. This can happen by clicking on remove icon on the tag itself or when user deletes the tag via keyboard (by pressing any of the `removeTagKeyCodes`). `indices` is array of indices of the tags that are about to be deleted. It can be single index (if remove icon is clicked) or multiple (by selecting multiple tags with keyboard).

### `onPasteRequest: (event: SyntheticClipboardEvent)`

Callback that is triggered when some content is pasted into the input. Useful for specifying how to parse data into tags / query.

### `onBlur: (event: SyntheticKeyboardEvent | SyntheticMouseEvent, editor: Editor, next: Function)`

Callback that is triggered when input is blurred. **IMPORTANT** Do not forget to call `next()` at the end of your callback so SlateJS can perform correct updates.

### `onFocus: (event: SyntheticKeyboardEvent | SyntheticMouseEvent, editor: Editor, next: Function)`

Callback that is triggered when input is focused. **IMPORTANT** Do not forget to call `next()` at the end of your callback so SlateJS can perform correct updates.

### `onChange: ({ value, operations }: { value: Value, operations: List<Operation> })`

Any time any of input's internal editor value is changed this callback is triggered.

### `setRef: (node: ?React$ElementRef)`

If you need to set reference to the editor itself, you can use this function to set it.

### `onInitialLoad: ()`

This callback is triggered once the query and tags are parsed and the internal editor value is generated, basically after the editor's internal state is set and first render occurs. The callback is called at the end of `componentDidMount`.

## CollapsibleTagsInput API

You can pass the same props as for `TagsInput` component. The additional props are these.

### `onTagCountUpdateRequest (count: number)`

The callback is triggered every time the input is focused or blurred. Additionaly it is called when the input is mounted. The callback passes `count` argument which is the amount of Tag nodes that are of different top offset (the offset can be specified via `offset` prop).

By default the initial offset is calculated by looking at first Tag node `offsetTop` property. This is used as main offset. Then other tag components' `offsetTop` properties are observed and those that do not match are considered to be _hidden_ nodes. The number of these nodes is used as `count` argument.

### `offset: number`

Overrides the default offset. Instead of relying on `offsetTop` position of first Tag node, this offset is used. This is useful if you change the tag input dynamically or apply other styles.

## Package API

### `TagsInput`

React component containing the input. See [TagsInput API](#tagsinput-api)

### `CollapsibleTagsInput`

React component that renders `TagsInput` internally. This component allows for passing callbacks that are triggered when input is blurred / focused and mounted. The component searches through editor nodes to calculate visible tag nodes which is specified by configuration and CSS.

See [CollapsibleTagsInput API](#collapsibletagsinput-api)

### `TagComponent`

Default React component that renders tag items.

### `plugins`

Object containing default SlateJS plugins used with `TagsInput`. These plugins are used by default with the input. The plugins are created as classes so you need to call `plugin.initialize()` before passing them to the input.

- `TagsPlugin`

Handles rendering of the tag objects. It also triggers callbacks when tag should be added or removed, either via mouse or keyboard.

- `KeyboardNavigationPlugin`

Plugin that enables navigation with cursor arrows between tag nodes so empty nodes between tag nodes are skipped.

- `UpdateValue`

Plugin that parses incoming `tag` and `query` props into SlateJS value representation.

### `createPlugins`

Factory function for initializing all default plugins. This factory function is called by default within the input.

### `utils`

Object containing utility functions:

- `parseValue: (tags, query, prevValue): Value`

    Creates SlateJS `Value` and maintains `Selection`. This value is consumed by SlateJS editor embedded inside `TagsInput`.

- `removeTagsByIndices: (tags, indices): tags`

    Removes tags at given indices. This utility is used by default when removing tags and helps with modifying the tag list.

### `schema`

SlateJS schema that is used by default with the input.

