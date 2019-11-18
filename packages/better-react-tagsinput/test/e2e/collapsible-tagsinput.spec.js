import puppeteer from 'puppeteer'
import { expect } from 'chai'
import {
  getInputText,
  getTagNodes,
  getAnchorAndFocus,
} from './test-utils'

const URL = isDevelopment
  ? 'http://localhost:8080/#/better-react-tagsinput/test-collapsible-tagsinput'
  : 'https://avocode-email-tagsinput.surge.sh/#/better-react-tagsinput/test-collapsible-tagsinput'

describe('CollapsibleTagsinput', () => {
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


  const typeTwoLines = async (page) => {
    await page.type('.collapsible-tagsinput', 'abcdefg')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', '1234567')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', 'helloworld')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', '1234567')
    await page.keyboard.press('Comma')
  }

  const typeFourLines = async (page) => {
    await page.type('.collapsible-tagsinput', 'abcdefg')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', '1234567')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', 'helloworld')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', 'nananan')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', 'ioioioioio')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', '91823123')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', 'ffffffuuuuu')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', 'abcdefg')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', 'helloworld')
    await page.keyboard.press('Comma')
    await page.type('.collapsible-tagsinput', 'nananan')
    await page.keyboard.press('Comma')
  }


  it('should render collapsible editor', async () => {
    const editor = await page.waitForSelector('.collapsible-tagsinput')

    expect(editor).to.exist
  })


  it('should be collapsed by default', async () => {
    const editor = await page.waitForSelector('.collapsible-tagsinput--collapsed')

    expect(editor).to.exist
  })

  describe('focus', () => {
    it('should switch class name when focused', async () => {
      await page.click('.collapsible-tagsinput')

      const className = await page.evaluate(() => {
        const editor = document.querySelector('.collapsible-tagsinput')

        return editor.className
      })

      expect(className).not.to.include('.collapsible-tagsinput--collapsed')
    })
  })

  describe('collapsing', () => {
    it('should show tags on one line when not collapsed', async () => {
      await page.click('.collapsible-tagsinput')
      await page.type('.collapsible-tagsinput', 'abcdefg')
      await page.keyboard.press('Comma')
      await page.type('.collapsible-tagsinput', '1234567')
      await page.keyboard.press('Comma')
      await page.type('.collapsible-tagsinput', 'helloworld')
      await page.keyboard.press('Comma')

      await page.click('#focus-button')

      const height = await page.evaluate(() => {
        const editor = document.querySelector('.collapsible-tagsinput .tagsinput')

        return editor.getBoundingClientRect().height
      })

      expect(height).to.equal(35)
    })


    it('should show tags on one line when collapsed', async () => {
      await page.click('.collapsible-tagsinput')
      await page.type('.collapsible-tagsinput', 'abcdefg')
      await page.keyboard.press('Comma')
      await page.type('.collapsible-tagsinput', '1234567')
      await page.keyboard.press('Comma')
      await page.type('.collapsible-tagsinput', 'helloworld')
      await page.keyboard.press('Comma')

      const height = await page.evaluate(() => {
        const editor = document.querySelector('.collapsible-tagsinput .tagsinput')

        return editor.getBoundingClientRect().height
      })

      expect(height).to.equal(35)
    })


    it('should collape input to single line with multiple tags', async () => {
      await page.click('.collapsible-tagsinput')
      await typeTwoLines(page)

      await page.click('#focus-button')

      const height = await page.evaluate(() => {
        const editor = document.querySelector('.collapsible-tagsinput')

        return editor.getBoundingClientRect().height
      })

      expect(height).to.equal(35)
    })


    it('should scroll input to last tag with multiple tags in ' +
       'collapsed state', async () => {
      await page.click('.collapsible-tagsinput')
      await typeTwoLines(page)

      await page.click('#focus-button')

      const editorYPosition = await page.evaluate(() => {
        const editor = document.querySelector('.collapsible-tagsinput')
        const bounds = editor.getBoundingClientRect()
        return bounds.y
      })

      const lastTagNodeYPosition = await page.evaluate(() => {
        const tags = document.querySelectorAll('.collapsible-tagsinput .tag')
        const lastTag = tags[tags.length - 1]

        return lastTag.getBoundingClientRect().y
      })

      expect(lastTagNodeYPosition).is.above(editorYPosition)
    })


    it('should hide tags on first line with multiple tags in ' +
       'collapsed state', async () => {
      await page.click('.collapsible-tagsinput')
      await typeTwoLines(page)

      await page.click('#focus-button')

      const editorYPosition = await page.evaluate(() => {
        const editor = document.querySelector('.collapsible-tagsinput')
        const bounds = editor.getBoundingClientRect()
        return bounds.y
      })

      const firstTagNodeYPosition = await page.evaluate(() => {
        const tags = document.querySelectorAll('.collapsible-tagsinput .tag')
        const firstTag = tags[0]

        return firstTag.getBoundingClientRect().y
      })

      expect(firstTagNodeYPosition).is.below(editorYPosition)
    })


    it('should scroll to last tag even after scrolling up ', async () => {
      await page.click('.collapsible-tagsinput')
      await typeFourLines(page)

      const editorYPosition = await page.evaluate(() => {
        const editor = document.querySelector('.collapsible-tagsinput')
        const bounds = editor.getBoundingClientRect()
        return bounds.y
      })

      await page.evaluate((scrollOffset) => {
        document.querySelector('.tagsinput--e2e-collapsing-input--focused').scrollBy(0, -scrollOffset)
      }, editorYPosition)

      await page.click('#focus-button')

      const lastTagNodeYPosition = await page.evaluate(() => {
        const tags = document.querySelectorAll('.collapsible-tagsinput .tag')
        const lastTag = tags[tags.length - 1]

        return lastTag.getBoundingClientRect().y
      })

      expect(lastTagNodeYPosition).is.above(editorYPosition)
    }, 25000)
  })

  describe('counter', () => {
    describe('single tag', () => {
      it('should count zero tags when rendered', async () => {
        const count = await page.evaluate(() => {
          return Number(
            document.querySelector('#counter').innerText
          )
        })

        expect(count).to.equal(0)
      })


      it('should count zero tags when new tags ' +
         'are received but input is still on single line', async () => {
        await page.click('#add-tag')
        await page.click('#add-tag')
        const count = await page.evaluate(() => {
          return Number(
            document.querySelector('#counter').innerText
          )
        })

        expect(count).to.equal(0)
      })


      it('should not update count when typing text', async () => {
        await page.click('.collapsible-tagsinput')
        await page.type('.collapsible-tagsinput', 'abcdefg')

        const count = await page.evaluate(() => {
          return Number(
            document.querySelector('#counter').innerText
          )
        })

        expect(count).to.equal(0)
      })


      it('should NOT update count when tag is added ' +
         'and input is still single line', async () => {
        await page.click('.collapsible-tagsinput')
        await page.type('.collapsible-tagsinput', 'abcdefg')
        await page.keyboard.press('Comma')

        const count = await page.evaluate(() => {
          return Number(
            document.querySelector('#counter').innerText
          )
        })

        expect(count).to.equal(0)
      })
    })

    describe('multiple tags', () => {
      it('should NOT update count when multiple tags ' +
        'are added but input is single line', async () => {
        await page.click('.collapsible-tagsinput')
        await page.type('.collapsible-tagsinput', 'abcdefg')
        await page.keyboard.press('Comma')
        await page.type('.collapsible-tagsinput', 'xoxo')
        await page.keyboard.press('Comma')

        const count = await page.evaluate(() => {
          return Number(
            document.querySelector('#counter').innerText
          )
        })

        expect(count).to.equal(0)
      })


      it('should update count when multiple tags ' +
        'are added and input is on multiple lines', async () => {
        await page.click('.collapsible-tagsinput')
        await typeTwoLines(page)

        const count = await page.evaluate(() => {
          return Number(
            document.querySelector('#counter').innerText
          )
        })

        expect(count).to.equal(3)
      })


      it('should NOT update count when multiple tags ' +
        'are created and user is only typing', async () => {
        await page.click('.collapsible-tagsinput')
        await typeTwoLines(page)
        await page.type('.collapsible-tagsinput', 'abcdefg')
        await page.keyboard.press('Comma')

        const count = await page.evaluate(() => {
          return Number(
            document.querySelector('#counter').innerText
          )
        })

        expect(count).to.equal(3)
      })


      // TODO: Will fix this in other MR
      xit('should update count when tags are added ' +
         'and input is on multiple lines', async () => {
        await page.click('#add-tag')
        await page.click('#add-tag')
        await page.click('#add-tag')
        await page.click('#add-tag')
        const count = await page.evaluate(() => {
          return Number(
            document.querySelector('#counter').innerText
          )
        })

        expect(count).to.equal(3)
      })
    })
  })
})
