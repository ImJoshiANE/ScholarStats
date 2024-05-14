exports.makeUrl = (gsId) => {
    const url = `https://scholar.google.com/citations?hl=en&user=${gsId}&pagesize=10&view_op=list_works`
    return url;
}