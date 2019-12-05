import { JSDOM } from 'jsdom'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
Enzyme.configure({ adapter: new Adapter() })

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
