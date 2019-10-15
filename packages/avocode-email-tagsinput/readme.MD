# avocode-email-tagsinput

React input component for rendering, creating and deleting tags that match emails. It is built upon `better-react-tagsinput` dependency which itself is based on SlateJS.

This library exposes `AvocodeEmailTagsInput` React component, it should be used as controlled component. Additionally it exposes `utils` object which is a collection of utilities that can be used alongside the input.

The input is opinionated and will not allow you to create tags that are not valid emails.

## AvocodeEmailTagsInput API

This input receives the same props as components in **@avocode/better-react-tagsinput** library. Please refer to that documentation to see all the details.

In short you need to pass at least these props:

* `tags`
* `query`
* `onQueryChangeRequest`
* `onTagAddRequest`
* `onTagDeleteRequest`

### `unique: boolean`

Will only allow to display and add unique tags based on their `value` property. If you try to insert the email that was already added, it will not do anything by default.

### `collapsible: boolean`

Will render so-called collapsible input. This means that it will add extra class names if you focus / blur the input. This allows you to style the input via CSS and add `overflow` property onto the input.

Additionally, it renders so-called `Counter` component which is displayed next to the input. The counter displays the amount of *hidden* tag nodes (the ones that are not visible).

### `renderCounter: ({ focused: boolean, tagCount: number }): $React$Node`

Pass this factory if you want to override the provided `Counter` component and provide your own. The factory should return valid React component.

### `onTagCountUpdateRequest: (tagCount: number) => void`

Callback that is triggered when the `collapsible=true` prop is passed, the input is blurred or focused or new tag nodes are received. It allows you to keep track of *hidden* tag nodes.

## Utils API

This object has utilities that are also included in `@avocode/better-react-tagsinput` so refer to documentation of that library for more info. These are:

* `parseValue`
* `removeTagsByIndices`

### `isValueValidEmail: (value: string): boolean`

Pass a string and it will be compared to regular expression to see whether it's email. This utility is used internally by the input to allow only for valid emails.

### `getUniqueTagsByValue: (tags: Tags): Tags`

Will remove duplicate tags based on `value` property. This util is used internally when `unique` prop is passed to the input.
