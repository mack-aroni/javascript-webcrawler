const { JSDOM } = require('jsdom')
const { skip } = require('node:test')

// helper function that obtains URL hrefs from HTML
function getURLsFromHTML(html, url) {
  const urls = []
  const dom = new JSDOM(html)
  const elements =  dom.window.document.querySelectorAll('a')

  for (const element of elements) {

    // check for absolute or relative paths
    if (element.href.slice(0, 1) === '/') {
      // relative
      try {
        const validURL = new URL(`${url}${element.href}`)
        urls.push(validURL.href)
      } catch (err) {
        console.log(`Invalid URL: ${err.message}`)
      }
    }
    else {
      // absolute
      try {
        const validURL = new URL(element.href)
        urls.push(validURL.href)
      } catch (err) {
        console.log(`Invalid URL: ${err.message}`)
      }
    }
    
  }

  return urls
}

// helper function to normalize urls (strip protocol and trailing slashes)
function normalizeURL(urlString) {
  const url = new URL(urlString)
  const hostPath = `${url.hostname}${url.pathname}`

  if (hostPath.length > 0 && hostPath.slice(-1)==='/') {
    return hostPath.slice(0,-1)
  }

  return hostPath
}

module.exports = {
  normalizeURL,
  getURLsFromHTML
}