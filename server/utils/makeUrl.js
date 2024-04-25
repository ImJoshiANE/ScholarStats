exports.makeUrl = (gsId) => {
    const url = `https://scholar.google.com/citations?hl=en&user=${gsId}&pagesize=20&view_op=list_works&sortby=pubdate`
    return url;
}