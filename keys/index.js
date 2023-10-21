if (process.env.NODE_ENV === 'prodaction') {
    module.exports = require('./key.prod')
} else {
    module.exports = require('./key.dev')
}
