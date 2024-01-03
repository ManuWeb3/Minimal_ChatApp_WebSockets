const myWebSocket = require('ws')

console.log(myWebSocket)

const wss = new myWebSocket.Server({
  port: 9876, // required config, rest optional. Has to be a port where server listens
})

// on getting a conn. estd., access that very "ws"
wss.on('connection', function (ws) {
  ws.on('message', function (data) {
    // on getting a msg, access that very msg as "data"
    wss.clients.forEach((client) => {
      // .clients is a built-in prop of wss object. "client = ws"
      if (client.readyState === myWebSocket.OPEN) {
        client.send(data) // echo to all = broadcast
      }
    })
  })
})

/*
const clients = [] // for broadcast to all clients
// connection event gets fired upon getting a connection estd. on WebSocket Server = wss (not ws)
// ws = WebSocket connection's instance for the WebSocket conn. that got estd. b/w C and S
// basically, wss eventually gives rise to creation of a ws
// "wss => ws"
wss.on('connection', function (ws) {
  // ws.send('Han client veer, kiven connection est. kita fir') - sent to client upon ws getting estd.
  clients.push(ws) // added to clients/ws array upon getting a conn. estd.
  // message event gets fired upon getting a msg from client - meaningful to be kept inside connection only
  ws.on('message', function (data) {
    clients.forEach((client) => client.send(data)) // clients[] contains just ws only (ws.send = client.send)
    // ws.send(data) // echoing to a single connection - not needed when we added a broadcast feature above
  })
})
*/

/*
new WebSocketServer(options[, callback])
(This class represents a WebSocket server. It extends the EventEmitter)

options {Object}
  port {Number} The port where to bind the server.
  callback {Function}

  callback will be added as a listener for the 'listening' event on the HTTP server when the port option is set/when not operating in "noServer" mode.
*/
