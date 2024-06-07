const { crawlPage } = require('./crawl.js')

function main() {
  // input error checking
  if (process.argv.length < 3) {
    console.log("Not Enough Inputs Provided: npm start (url)")
    process.exit(1)
  }
  if (process.argv.length > 3) {
    console.log("Too Many Inputs Provided: npm start (url)")
    process.exit(1)
  }

  const baseURL = process.argv[2]
  console.log(`STARTING CRAWL OF ${baseURL}`)
  crawlPage(baseURL)
}

main()