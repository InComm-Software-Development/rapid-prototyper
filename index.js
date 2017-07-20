const express = require('express')
const exphbs = require('express-handlebars')
const Twilio = require('twilio')
require('dotenv').config()

const app = express()
const port = 3000

const ACCOUNT_SID = 'AC623bc71d4f94223602f23580f5f3e2c3'
const AUTH_TOKEN = '1178a4bc9924c486f57f2a553c425a42'
const client = new Twilio(ACCOUNT_SID, AUTH_TOKEN)

// App config
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Serve static files from ./assets
app.use(express.static('assets'))

// Top level route
app.get('/', async (request, response) => {
  const twilioMessages = await client.messages.list()
  console.log(twilioMessages)
  const messageBodies = twilioMessages.filter(fullMessage => fullMessage.direction === 'inbound').map(fullMessage => {
    return {body: fullMessage.body, from: fullMessage.from, to: fullMessage.to}
  })
  response.render('view', {messages: messageBodies})
})

// Server listener
app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
