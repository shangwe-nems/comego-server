const mongoose = require('mongoose')
const config = require('config')
const logger = require('./logger')

async function connect() {
    const dbUri = config.get('dbUri')

    try {
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        logger.info("DB connected")
    } catch (error) {
        logger.error("Could not connect to the db")
        process.exit(1)
    }
}

module.exports = connect