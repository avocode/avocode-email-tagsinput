# 2.1.4

-

# 2.1.3

-

# 2.1.2

-

# 2.1.1

- fix Lerna bootstrap because it would overwrite lockfiles

# 2.1.0

- add separate build dependencies (webpack)

# 2.0.0

- released on Github

# 2.0.0-beta

- breaking changes - using new dependencies
- library now works **only with React 16**, this
  also means using newer version of Slate JS
- upgraded peer dependencies:
  * `react@^16.11.0`
  * `react-dom@^16.11.0`
- upgraded dependencies:
  * `slate@^0.47.0`
  * `slate-react@^0.22.0`
- tag nodes drop support for using children to render
  their content as it was causing issues with
  focus states, use custom tag node if you really
  need to render custom stuff

# 1.2.21-beta

- specify window size for end to end specs

# 1.2.20-beta

- optimize `onChange` callback, text input should feel a bit better
- add unit tests for `TagsInput` component
- add unit tests for `CollapsibleTagsInput` component
- add end to end tests for `TagsInput` component
- add end to end tests for `CollapsibleTagsInput` component

# 1.2.19-beta

- breaking changes to API
- rename prop `onQueryChangedRequest` to `onQueryChangeRequest`
- rename prop `onTagAddedRequest` to `onTagAddRequest`
