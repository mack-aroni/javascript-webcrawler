const { JSDOM } = require('jsdom')

// main call function to recursively crawl a website
async function crawlPages(baseURL, currURL, pages) {
  // avoid exterior pages
  if ((new URL(currURL)).hostname !== (new URL(baseURL)).hostname) {
    return pages
  }

  // if a page is visited, increment count
  // else create entr
  const normalizedURL = normalizeURL(currURL)
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

  // recursively crawl pages contained in currURL
  for (const url of urls) {
    pages = await crawlPages(baseURL, url, pages)
  }

  return pages
}

// helper function that obtains URL hrefs from a pages HTML
function getURLsFromHTML(html, url) {
  const urls = []
  const urlObj = new URL(url)

  // selects all link elements
  const dom = new JSDOM(html)
  const elements = dom.window.document.querySelectorAll('a')

  for (const element of elements) {
    let newURL = ''
    // absolute disguised as relative edge case
    if (element.href.slice(0,2) === "//") {
      newURL = `${urlObj.protocol}${element.href}`
    }
    // relative
    else if (element.href.slice(0, 1) === '/') {
      newURL = `${urlObj.protocol}${urlObj.hostname}${element.href}`
    }
    // absolute
    else {
      newURL = element.href
    }

    // check valid url      
    try {
      urls.push(new URL(newURL).href)
    } catch (err) {
      console.log(`INVALID URL: ${newURL} ${element.href}`)
    }
    
  }
  return urls
}

// helper function to normalize urls
// (strip protocol and trailing slashes)
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