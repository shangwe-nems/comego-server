const express = require('express')
const config = require('config')
const morgan = require('morgan')
const cors = require('cors')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const connect = require('./utils/connect')
const logger = require('./utils/logger')
const routes = require('./routes')
const deserializeUser = require('./middlewares/deserializeUser')
const { version } = require('../package.json')

const port = config.get('port')

const app = express()

app.use(cors({
    origin: config.get('origin'),
    credentials: true
}))

app.use(cookieParser())

app.use(deserializeUser)

app.use(morgan('dev'))

app.use(express.json({ limit: '100mb'}))

app.use(bodyParser.urlencoded({ extended: true}))

app.use(bodyParser.json())

app.listen(port, async () => {
    logger.info(`COMEGO App v${version} running at http://localhost:${port}`)
    await connect()
    routes(app)
})
