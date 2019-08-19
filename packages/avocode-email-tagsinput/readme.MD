React input component for rendering, creating and deleting tags that match emails. It is built upon `better-react-tagsinput` dependency which itself is based on SlateJS.

## API

* `query: string`

    The text value of the input which is created by user typing via keyboard.

* `tags: Array<Tag>`

    The tags that are rendered inside the input. The input renders tats first and then the query is rendered as last.

    `Tag` is a javascript object that contains data and metadata describing it:

    ```
    {
      value: string,
      state?: string | number,
      data?: Object,
    }
    ```
