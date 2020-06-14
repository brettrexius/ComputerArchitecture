let express = require('express')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)
let socket = require('./socket/newsocket')(io)
app.use(express.json())
let cors = require('cors')
app.use(cors())
let morgan = require('morgan')
app.use(morgan('tiny'))

// Routes
app.use('/signin', require('./routes/signin'))
app.use('/signup', require('./routes/signup'))
app.use('/dashboard', require('./routes/dashboard'))
//app.use('/testquery', require('./routes/testquery'))

const port = process.env.port || 3000
//app.listen(port, () => console.log(`Listening on port ${port}...`))
server.listen(port, () => console.log(`Listening on port ${port}...`))