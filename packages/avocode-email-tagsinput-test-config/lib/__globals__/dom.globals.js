const { JSDOM } = require('jsdom')
const Enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

Enzyme.configure({ adapter: new Adapter() })
const jsdom = new JSDOM('<!doctype html><html><body></body></html>')

const { window } = jsdom

const copyProps = (src, target) => {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  })
}

global.window = window
global.document = window.document

window.getSelection = () => {}

copyProps(window, global)
