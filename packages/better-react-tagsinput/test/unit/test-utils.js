const testAsync = (testCallback, testBlock, timeout = 10) => {
  setTimeout(() => {
    try {
      testBlock()
      testCallback()
    } catch (e) {
      testCallback.fail(e)
    }
  }, timeout)
}

export { testAsync }
