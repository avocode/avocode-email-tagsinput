import puppeteer from 'puppeteer'
import { expect } from 'chai'
import {
  getInputText,
  getTagNodes,
  getAnchorAndFocus,
} from './test-utils'

const URL = isDevelopment
  ? 'http://localhost:8080/#/better-react-tagsinput/test-tagsinput'
  : 'https://avocode-email-tagsinput.surge.sh/#/better-react-tagsinput/test-tagsinput'

describe('TagsInput', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions)
  })

  afterAll(async () => {
    await browser.close()
  })

  beforeEach(async () => {
    page = await browser.newPage()
    await page.goto(URL)
  })

  it('should render editor', async () => {
    const editor = await page.waitForSelector('.tagsinput')

    expect(editor).to.exist
  })


  describe('user typing', () => {
    it('should insert text', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')

      const text = await getInputText(page)

      expect(text).to.equal('abcd')
    })


    it('should delete text with backspace', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Backspace')

      const text = await getInputText(page)

      expect(text).to.equal('abc')
    })


    it('should delete text with delete', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('Delete')

      const text = await getInputText(page)

      expect(text).to.equal('abc')
    })


    it('should navigate one char left', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('ArrowLeft')

      const [ anchorOffset ] = await getAnchorAndFocus(page)

      expect(anchorOffset).to.equal(3)
    })


    it('should navigate one char left and one char right', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowRight')

      const anchorOffset = await page.evaluate(() => {
        return window.getSelection().anchorOffset
      })

      expect(anchorOffset).to.equal(4)
    })


    it('should navigate to beginning of input', async () => {
      const ctrlKey = isMac ? 'Alt' : 'Control'
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')

      await page.keyboard.down(ctrlKey)
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.up(ctrlKey)

      const [ anchorOffset ] = await getAnchorAndFocus(page)

      expect(anchorOffset).to.equal(0)
    })


    it('should navigate to beginning and end of input', async () => {
      const ctrlKey = isMac ? 'Alt' : 'Control'
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.down(ctrlKey)
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.up(ctrlKey)
      await page.keyboard.down(ctrlKey)
      await page.keyboard.press('ArrowRight')
      await page.keyboard.up(ctrlKey)

      const [ anchorOffset ] = await getAnchorAndFocus(page)

      expect(anchorOffset).to.equal(4)
    })
  })

  describe('adding tags', () => {
    it('should add tag by pressing comma', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')

      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(1)
    })


    it('should add tag by pressing spacebar', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Space')

      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(1)
    })


    it('should add tag by pressing enter', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Enter')

      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(1)
    })


    it('should add multiple tags with text', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')

      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(2)
      expect(tagNodes[0].text).to.equal('abcd')
      expect(tagNodes[1].text).to.equal('xyz')
    })
  })


  describe('removing tags', () => {
    it('should remove last tag by pressing backspace', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')
      await page.keyboard.press('Backspace')

      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(1)
      expect(tagNodes[0].text).to.equal('abcd')
    })


    it('should remove first tag by clicking ' +
       'remove button', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')

      const removeButtons = await page.$$('.tagsinput .tag .tag__remove-button')

      await removeButtons[0].click()

      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(1)
      expect(tagNodes[0].text).to.equal('xyz')
    })


    it('should remove last tag by focusing on it ' +
       'and pressing backspace', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('Delete')

      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(1)
      expect(tagNodes[0].text).to.equal('abcd')
    })


    it('should remove first tag by focusing on it ' +
       'and pressing backspace', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('Delete')

      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(1)
      expect(tagNodes[0].text).to.equal('xyz')
    })


    it('should remove all tag nodes ' +
       'using mouse drag and hitting delete', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'hello')

      const [ x, y ] = await page.evaluate(() => {
        const lastTag = document.querySelectorAll('.tag')[1]
        const rect = lastTag.getBoundingClientRect()

        return [ rect.x, rect.y ]
      })

      // NOTE: Make up for the difference agains text node
      await page.mouse.move(x + 100, y)
      await page.mouse.down()
      await page.mouse.move(x - 100, y)
      await page.mouse.up()

      await page.keyboard.press('Delete')

      const tagNodes = await getTagNodes(page)
      const text = await getInputText(page)

      expect(tagNodes).to.have.length(0)
      expect(text).to.equal('')
    })
  })

  describe('focus', () => {
    it('should bring focus to input by tabbing', async () => {
      await page.focus('#focus-button')
      await page.keyboard.press('Tab')

      const editorClasses = await page.evaluate(() => {
        return document.querySelector('.tagsinput').className
      })

      expect(editorClasses).to.include('tagsinput--focused')
    })


    it('should bring focus to input by clicking', async () => {
      await page.click('.tagsinput')

      const editorClasses = await page.evaluate(() => {
        return document.querySelector('.tagsinput').className
      })

      expect(editorClasses).to.include('tagsinput--focused')
    })


    it('should focus individual tag by keyboard', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowLeft')

      const tagNodes = await getTagNodes(page)

      expect(tagNodes[0].className).to.include('tag--focused')
      expect(tagNodes[1].className).not.to.include('tag--focused')
    })


    it('should focus individual tag by mouse', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')

      const nodes = await page.$$('.tag')
      await nodes[0].click()

      const tagNodes = await getTagNodes(page)

      expect(tagNodes[0].className).to.include('tag--focused')
      expect(tagNodes[1].className).not.to.include('tag--focused')
    })


    it('should focus remove button using keyboard', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('Tab')

      const activeElementClass = await page.evaluate(() => {
        const activeElement = document.activeElement
        return activeElement.className
      })

      expect(activeElementClass).to.include('tag__remove-button')
    })


    it('should focus to input after adding tag', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')

      const activeElementTag = await page.evaluate(() => {
        const activeElement = document.activeElement
        return activeElement.tagName
      })

      expect(activeElementTag).to.include('DIV')
    })


    it('should focus to input after removing tag', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')

      const removeButtons = await page.$$('.tagsinput .tag .tag__remove-button')

      await removeButtons[0].click()

      const activeElementTag = await page.evaluate(() => {
        const activeElement = document.activeElement
        return activeElement.tagName
      })

      expect(activeElementTag).to.include('DIV')
    })
  })

  describe('selection', () => {
    it('should select selection backward on text ' +
       'using keyboard', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.down('Shift')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.up('Shift')

      const [ anchorOffset, focusOffset ] = await getAnchorAndFocus(page)

      expect(anchorOffset).to.equal(4)
      expect(focusOffset).to.equal(3)
    })


    it('should select selection forward on text ' +
       'using keyboard', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.down('Shift')
      await page.keyboard.press('ArrowRight')
      await page.keyboard.up('Shift')

      const [ anchorOffset, focusOffset ] = await getAnchorAndFocus(page)

      expect(anchorOffset).to.equal(2)
      expect(focusOffset).to.equal(3)
    })


    // NOTE: Unable to simulate this on macOS:
    // https://github.com/GoogleChrome/puppeteer/issues/1313
    xit('should select the whole text using keyboard', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.down('Meta')
      await page.keyboard.press('a')
      await page.keyboard.up('Meta')

      const [ anchorOffset, focusOffset ] = await getAnchorAndFocus(page)

      expect(anchorOffset).to.equal(0)
      expect(focusOffset).to.equal(4)
    })


    it('should select the whole text using mouse', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('ArrowLeft')
      await page.keyboard.press('ArrowLeft')
      await page.click('.tagsinput', { clickCount: 3 })

      const [ anchorOffset, focusOffset ] = await getAnchorAndFocus(page)

      expect(anchorOffset).to.equal(0)
      expect(focusOffset).to.equal(4)
    })


    it('should select the whole text and tag nodes ' +
       'using mouse drag', async () => {
      await page.click('.tagsinput')
      await page.type('.tagsinput', 'abcd')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'xyz')
      await page.keyboard.press('Comma')
      await page.type('.tagsinput', 'hello')

      const [ x, y ] = await page.evaluate(() => {
        const lastTag = document.querySelectorAll('.tag')[1]
        const rect = lastTag.getBoundingClientRect()

        return [ rect.x, rect.y ]
      })

      // NOTE: Make up for the difference agains text node
      await page.mouse.move(x + 100, y)
      await page.mouse.down()
      await page.mouse.move(x - 100, y)
      await page.mouse.up()

      const [ anchorOffset, focusOffset ] = await getAnchorAndFocus(page)

      const tagNodes = await getTagNodes(page)

      expect(tagNodes[0].className).to.include('tag--focused')
      expect(tagNodes[1].className).to.include('tag--focused')
      expect(anchorOffset).to.equal(5)
      expect(focusOffset).to.equal(0)
    })
  })
})
