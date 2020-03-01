const formatDate = date => {
    return date.toISOString().replace('T', ' ').replace('Z', '')
}

module.exports = { formatDate }