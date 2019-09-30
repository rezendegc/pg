const formatDate = date => {
    return date.toISOString().replace('T', ' ').replace('Z', '')
}
