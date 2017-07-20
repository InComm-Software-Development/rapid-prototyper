const express = require('express')
const exphbs = require('express-handlebars')
const Twilio = require('twilio')
require('dotenv').config()

const app = express()
const port = 3000

const ACCOUNT_SID = 'ACe66fe0391cb57ba6d05e8abfb9c25975'
const AUTH_TOKEN = 'cf25c41475f1273ae90afd1a7a39d826'
const client = new Twilio(ACCOUNT_SID, AUTH_TOKEN)

// App config
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Serve static files from ./assets
app.use(express.static('assets'))

// Top level route
app.get('/', async (request, response) => {
  const twilioMessages = await client.messages.list()
  const messageBodies = twilioMessages.filter(
    fullMessage => fullMessage.body.includes('Artist'))
    .map(fullMessage => {return {
      body: fullMessage.body, 
      to: fullMessage.to, 
      from: fullMessage.from
  }});
  response.render('view', {messages: messageBodies})
})

// Server listener
app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
