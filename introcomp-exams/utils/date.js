const formatDate = date => {
    // return date.format('YYYY-MM-DD HH:mm:ss')
    return date.toISOString().replace('T', ' ').replace('Z', '')
}

module.exports = { formatDate }