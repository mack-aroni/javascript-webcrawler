const { crawlPages } = require('./crawl.js')
const { sortPages } = require('./report.js')

async function main() {
  // input error checking
  if (process.argv.length < 3) {
    console.log("Not Enough Inputs Provided: npm start (url)")
    process.exit(1)
  }
  if (process.argv.length > 3) {
    console.log("Too Many Inputs Provided: npm start (url)")
    process.exit(1)
  }

  let baseURL = process.argv[2]
  // remove trailing /
  if (baseURL.slice(-1) === '/') {
    baseURL = baseURL.slice(0,-1)
  }
  console.log(`STARTING CRAWL OF ${baseURL}`)
  const pages = await crawlPages(baseURL, baseURL, {})

  for (const page of sortPages(pages)) {
    console.log(page)
  }
}

main()