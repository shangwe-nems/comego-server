const logger = require('pino')
const dayjs = require('dayjs')

const log = logger({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        }
    },
    timestamp: () => `,"time":"${dayjs().format()}"`
})

module.exports = log