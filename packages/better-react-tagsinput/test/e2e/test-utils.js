const getInputText = async (page, selector = '.tagsinput') => {
  const text = await page.evaluate((selector) => {
    const editor = document.querySelector(selector)

    return editor.textContent
  }, selector)

  return text.trim()
}

const getTagNodes = async (page, selector = '.tagsinput') => {
  const nodes = await page.evaluate((selector) => {
    const editor = document.querySelector(selector)
    const tagNodes = editor.querySelectorAll('.tag')

    return Array.from(tagNodes).map((node) => {
      return {
        text: node.textContent.trim(),
        className: node.className,
        html: node.innerHTML,
      }
    })
  }, selector)

  return nodes
}


const getAnchorAndFocus = async (page) => {
  const anchorAndFocus = await page.evaluate(() => {
    const selection = window.getSelection()

    return [ selection.anchorOffset, selection.focusOffset ]
  })

  return anchorAndFocus
}

export {
  getInputText,
  getTagNodes,
  getAnchorAndFocus,
}

