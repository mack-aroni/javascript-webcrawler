const { test, expect } = require('@jest/globals')
const { sortPages } = require('./report.js')

// tests for sortPages
test('sortPages test 1', () => {
  const input =  {
    "blog.boot.dev/path": 3,
    "blog.boot.dev": 5
  }
  const actual = sortPages(input)
  const expected =  [
    ["blog.boot.dev", 5],
    ["blog.boot.dev/path", 3]
  ]
  expect(actual).toEqual(expected)
})

test('sortPages test 2', () => {
  const input =  {
    "blog.boot.dev/path": 3,
    "blog.boot.dev": 5,
    "blog.boot.dev/about": 1,
    "blog.boot.dev/tags": 9,
    "blog.boot.dev/help": 6
  }
  const actual = sortPages(input)
  const expected =  [
    ["blog.boot.dev/tags", 9],
    ["blog.boot.dev/help", 6],
    ["blog.boot.dev", 5],
    ["blog.boot.dev/path", 3],
    ["blog.boot.dev/about", 1]
  ]
  expect(actual).toEqual(expected)
})