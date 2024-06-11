const { test, expect } = require('@jest/globals')
const { normalizeURL, getURLsFromHTML } = require('../crawl.js')

// tests for normalizing URLs
test('normalizeURL strip protocol(http)', () => {
  const input = 'http://blog.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL strip protocol(https)', () => {
  const input = 'https://blog.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
  const input = 'https://blog.boot.dev/path/'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
  const input = 'https://BLOG.BOOT.DEV/path/'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

// tests for getURLsFromHTML
test('getURLsFromHTML absolute', () => {
  const inputHTML = `
  <html>
    <body>
      <a href="https://blog.boot.dev/">
        Boot.dev Blog
      </a>
    </body>
  </html>
  `
  const inputURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(inputHTML,inputURL)
  const expected = ["https://blog.boot.dev/"]
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
  const inputHTML = `
  <html>
    <body>
      <a href="/path/">
        Boot.dev Blog
      </a>
    </body>
  </html>
  `
  const inputURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(inputHTML,inputURL)
  const expected = ["https://blog.boot.dev/path/"]
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative 2', () => {
  const inputHTML = `
  <html>
    <body>
      <a href="/path/">
        Boot.dev Blog
      </a>
    </body>
  </html>
  `
  const inputURL = 'https://blog.boot.dev/path'
  const actual = getURLsFromHTML(inputHTML,inputURL)
  const expected = ["https://blog.boot.dev/path/"]
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative // edge case', () => {
  const inputHTML = `
  <html>
    <body>
      <a href="//blog.boot.dev">
        Boot.dev Blog
      </a>
    </body>
  </html>
  `
  const inputURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(inputHTML,inputURL)
  const expected = ["https://blog.boot.dev/"]
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML invalid', () => {
  const inputHTML = `
  <html>
    <body>
      <a href="invalid">
        Boot.dev Blog
      </a>
    </body>
  </html>
  `
  const inputURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(inputHTML,inputURL)
  const expected = []
  expect(actual).toEqual(expected)
})

