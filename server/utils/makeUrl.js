exports.makeUrl = (gsId) => {
    const url = `https://scholar.google.com/citations?hl=en&user=${gsId}&pagesize=5&view_op=list_works`
    return url;
}