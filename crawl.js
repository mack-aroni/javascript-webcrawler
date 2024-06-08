const { JSDOM } = require('jsdom')

// main call function to crawl a page
async function crawlPages(baseURL, currURL, pages) {

  const baseURLObj = new URL(baseURL)
  const currURLObj = new URL(currURL)
  // avoid exterior pages
  if (currURLObj.hostname !== baseURLObj.hostname) {
    return pages
  }

  const normalizedURL = normalizeURL(currURL)
  // if a page is visited, increment count
  // else create entr
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++
    return pages
  }
  pages[normalizedURL] = 1

  console.log(`CRAWLING: ${currURL}`)
  let html = ''
  try {
    const resp = await fetch(currURL)
    // check valid fetch
    if (resp.status > 399) {
      console.log(`ERROR IN FETCH: status code ${resp.status} on ${currURL}`)
      return pages
    }

    // check valid content type
    const contentType = resp.headers.get("content-type")
    if (!contentType.includes("text/html")) {
      console.log(`NON HTML RESPONSE: content type ${contentType} on ${currURL}`)
      return pages
    }

    // obtain html from resp
    html = await resp.text()
    
  } catch (err) {
    console.log(`ERROR IN FETCH: ${err.message} on ${currURL}`)
  }

  // obatin urls from html
  const urls = getURLsFromHTML(html, currURL)
  //console.log(urls)

  // recursively crawl pages
  for (const url of urls) {
    pages = await crawlPages(baseURL, url, pages)
  }

  return pages
}

// helper function that obtains URL hrefs from HTML
function getURLsFromHTML(html, url) {
  const urls = []
  const urlObj = new URL(url)
  // selects all link elements
  const dom = new JSDOM(html)
  const elements = dom.window.document.querySelectorAll('a')

  for (const element of elements) {
    //console.log(element.href, new URL(url).pathname)
    let newURL = ''
    // check for absolute or relative paths
    if (element.href.slice(0, 1) === '/') {
      // relative
      newURL = `${urlObj.protocol}${urlObj.hostname}${element.href}`
    }
    else {
      // absolute
      newURL = element.href
    }

    try {
      urls.push(new URL(newURL).href)
    } catch (err) {
      console.log(`INVALID URL: ${newURL}`)
    }
  }
  return urls
}

// helper function to normalize urls (strip protocol and trailing slashes)
function normalizeURL(url) {
  const urlObj = new URL(url)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`

  if (hostPath.length > 0 && hostPath.slice(-1)==='/') {
    return hostPath.slice(0,-1)
  }

  return hostPath
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPages
}