import React from 'react'
import AvocodeEmailTagsInput from 'avocode-email-tagsinput'

export default class Unique extends React.PureComponent {
  render() {
    return (
      <div>
        <p>
          By passing <code>unique=true</code> prop to the input, you won't be able to insert
          duplicate emails into the input. Try typing the same email.
        </p>

        <AvocodeEmailTagsInput
          unique
        />
      </div>
    )
  }
}

