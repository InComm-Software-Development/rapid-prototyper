const express = require('express')
const exphbs = require('express-handlebars')
const Twilio = require('twilio')
require('dotenv').config()

const app = express()
const port = 3000

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
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
