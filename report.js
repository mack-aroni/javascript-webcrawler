// main call function that sorts pages object
// by highest occurences first returning an arr
function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((a, b) => {
    return b[1].length - a[1].length;
  });
  return pagesArr;
}

module.exports = {
  sortPages,
};
