const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors())

const zmq = require('zeromq')
const sock = zmq.socket('req')
const storeURL = 'tcp://127.0.0.1:2000'
sock.connect(storeURL)

app.get('/', async(req, res) => {
  console.log('Susanin-rest: got request: ', req)

  let r
  const fetched = new Promise((resolve, reject) => {
    r = resolve
  })

  const message = {
    action: 'read',
    payload: {}
  }
  sock.send(JSON.stringify(message))
  sock.on('message', (message) => {
    r(JSON.parse(message))
  })

  const reply = await fetched
  res.send(reply)
})

app.post('/', async(req, res) => {
  console.log('Susanin-rest: got request: ', req.body)

  let r
  const created = new Promise((resolve, reject) => {
    r = resolve
  })

  const message = {
    action: 'create',
    payload: req.body
  }
  sock.send(JSON.stringify(message))

  sock.on('message', (message) => {
    r(JSON.parse(message))
  })

  const reply = await created
  res.send(reply)
})

app.delete('/:id', async(req, res) => {
  console.log('Susanin-rest: got delete request: id=', req.params.id)

  let r
  const deleted = new Promise((resolve, reject) => {
    r = resolve
  })

  const message = {
    action: 'delete',
    payload: req.params.id
  }
  sock.send(JSON.stringify(message))

  sock.on('message', (message) => {
    r(JSON.parse(message))
  })

  const reply = await deleted
  res.send(reply)
})

app.listen(port, () => console.log(`Susanin-rest is listening at http://localhost:${port}`))
