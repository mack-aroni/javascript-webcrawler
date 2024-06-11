const { crawlPages } = require("./crawl.js");
const { sortPages } = require("./report.js");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

async function main() {
  // input error checking
  if (process.argv.length < 3) {
    console.log("Not Enough Inputs Provided: npm start (url)");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("Too Many Inputs Provided: npm start (url)");
    process.exit(1);
  }

  let baseURL = process.argv[2];
  // remove trailing / if necessary
  if (baseURL.slice(-1) === "/") {
    baseURL = baseURL.slice(0, -1);
  }

  // begin crawl
  console.log(`STARTING CRAWL OF ${baseURL}`);
  const pages = await crawlPages(baseURL, baseURL, {});

  // print output
  for (const page of sortPages(pages)) {
    console.log(page);
  }

  // formats pages for drawGraph
  const graphData = Object.keys(pages).map((url) => ({
    url: url,
    links: pages[url],
  }));
  console.log(graphData);

  // save graphData as a JSON file
  fs.writeFileSync("graphData.json", JSON.stringify(graphData, null, 2));

  console.log(
    "Graph data saved to graphData.json. Open index.html to view the graph."
  );
}

main();
