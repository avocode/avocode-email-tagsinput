import puppeteer from 'puppeteer'
import { expect } from 'chai'
import {
  URLRoot,
  tagsInputFieldSelector,
  getAnchorAndFocus,
  addEmailTag,
  getTagNodes, getInputText,
} from './test-utils'

describe('Avocode Email Tags Input', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions)
  })

  afterEach(async () => {
    await page.close()
  })

  afterAll(async () => {
    await browser.close()
  })

  describe('Basic Email Tags Input', () => {
    beforeEach(async () => {
      page = await browser.newPage()
      await page.goto(URLRoot)
    })

    it('should render editor', async () => {
      const editor = await page.waitForSelector(tagsInputFieldSelector)

      expect(editor).to.exist
    })

    describe('user typing', () => {
      it('should insert text', async () => {
        await page.click(tagsInputFieldSelector)
        await page.type(tagsInputFieldSelector, 'abcd')
        const text = await getInputText(page)

        expect(text).to.equal('abcd')
      })

      it('should delete text with backspace', async () => {
        await page.click(tagsInputFieldSelector)
        await page.type(tagsInputFieldSelector, 'abcd')
        await page.keyboard.press('Backspace')
        const text = await getInputText(page)

        expect(text).to.equal('abc')
      })

      it('should delete text with delete', async () => {
        await page.click(tagsInputFieldSelector)
        await page.type(tagsInputFieldSelector, 'abcd')
        await page.keyboard.press('ArrowLeft')
        await page.keyboard.press('Delete')
        const text = await getInputText(page)

        expect(text).to.equal('abc')
      })

      it('should navigate one char left', async () => {
        await page.click(tagsInputFieldSelector)
        await page.type(tagsInputFieldSelector, 'abcd')
        await page.keyboard.press('ArrowLeft')
        const [ anchorOffset ] = await getAnchorAndFocus(page)

        expect(anchorOffset).to.equal(3)
      })
    })

    it('should not be allowed to add invalid email as a tag', async () => {
      await addEmailTag(page, 'testemail@ex.11')
      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(0)
    })

    it('should be allowed to add valid email as a tag', async () => {
      await addEmailTag(page, 'testEmail@example.com')
      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(1)
    })

    describe('user can add new tag typing valid email and hitting comma, enter or space', () => {
      const validEmailTag = 'test@ex.com'

      it('should be possible to add an email tag hitting Comma key', async () => {
        await addEmailTag(page, validEmailTag, 'Comma')
        const tagNodes = await getTagNodes(page)

        expect(tagNodes).to.have.length(1)
      })

      it('should be possible to add an email tag hitting Enter key', async () => {
        await addEmailTag(page, validEmailTag, 'Enter')
        const tagNodes = await getTagNodes(page)

        expect(tagNodes).to.have.length(1)
      })

      it('should be possible to add an email tag hitting Space key', async () => {
        await addEmailTag(page, validEmailTag, 'Space')
        const tagNodes = await getTagNodes(page)

        expect(tagNodes).to.have.length(1)
      })
    })
  })

  describe('Unique Email Tags Input', () => {
    beforeEach(async () => {
      page = await browser.newPage()
      await page.goto(`${URLRoot}/unique`)
    })

    it('should be allowed to add unique email tags', async () => {
      await addEmailTag(page, 'foo@example.com')
      await addEmailTag(page, 'bar@example.com')
      const tagNodes = await getTagNodes(page)

      expect(tagNodes).to.have.length(2)
    })

    it('should not be allowed to add same email tag again', async () => {
      await addEmailTag(page, 'foo@example.com')
      await addEmailTag(page, 'foo@example.com')
      const tagNodes = await getTagNodes(page)
      
      expect(tagNodes).to.have.length(1)
    })
  })
})
