const myWebSocket = require('ws')
const express = require('express')
const path = require('path')

const app = express()
// Serve static (not dynamic) files from the '../client' directory - details below
app.use('/', express.static(path.resolve(__dirname, '../client')))
// Start the Express server on port 9876 - usual HTTP server
const server = app.listen(9876)

// Create a WebSocket server using the existing Express server - details below
const wss = new myWebSocket.Server({
  noServer: true,
  // instead of listening to the server directly here, it's noServer.**
  // Means, manual invocation of handleUpgrade()
  // verify client not needed when handleUpgrade() - alternative
  // verifyClient: (info) => {
  // console.log(info). "info" = origin + req**. + secure
  // return true
  // },
  // port: 9876, // required config, rest optional. Has to be a port where server listens
})

// **the code below is what we want instead of "verifyClient: sever"
// request param below is the same as the "info.req" above = HTTP (before upgrade)
// request allows us to verifyClient here, hence verifyClient not needed above
server.on('upgrade', async function upgrade(request, socket, head) {
  // 3 params of fn. upgrade
  if (Math.random() > 0.5) {
    // half of the times, "ws" connection requests will be rejected
    return socket.end('HTTP/1.1 401 Unauthorized\r\n', 'ascii')
  }
  // Do what you normally do in `verifyClient()` here and then use
  // `WebSocketServer.prototype.handleUpgrade()`.
  // test for auth here
  // if this succeeds, delegate the control to the WSS, below ****
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request) // WSS emits 'connection' event. we also have the 'request' and 'ws' that made the 'request'
  })
})

// on getting a conn. estd., access that very "ws"
// **** this comes in power when handleUPgrade() succeeds
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
SUMMARY of combining 2 servers -> 1:
In summary, this code sets up an Express server to serve static files from the '../client' directory and then creates a WebSocket server using the ws library on the same server. 
This pattern is commonly used to integrate WebSocket functionality into a web application built with Express. 
The WebSocket server and Express server can coexist, allowing you to handle both HTTP and WebSocket communication within the same application.
*/

/*
server.handleUpgrade(request, socket, head, callback)
request {http.IncomingMessage} The client HTTP GET request.
socket {stream.Duplex} The network socket between the server and client.
head {Buffer} The first packet of the upgraded stream.
callback {Function}.
Handle a HTTP upgrade request. When the HTTP server is created internally or when the HTTP server is passed via the server option, this method is called automatically. When operating in "noServer" mode, this method must be called manually.

If the upgrade is successful, the callback is called with two arguments:

websocket {WebSocket} A WebSocket object.
request {http.IncomingMessage} The client HTTP GET request.
*/

/*
Use of verifyClient is discouraged. Rather handle client authentication in the 'upgrade' event of the HTTP server. See examples for more details.

If verifyClient is not set then the handshake is automatically accepted. If it has a single parameter then ws will invoke it with the following argument:

info {Object}
    origin {String} The value in the Origin header indicated by the client.
    req {http.IncomingMessage} The client HTTP GET request.
    secure {Boolean} true if req.socket.authorized or req.socket.encrypted is set.
The return value (Boolean) of the function determines whether or not to accept the handshake.

If verifyClient has two parameters then ws will invoke it with the following arguments:

info {Object} Same as above.
    cb {Function} A callback that must be called by the user upon inspection of the info fields. Arguments in this callback are:
    result {Boolean} Whether or not to accept the handshake.
    code {Number} When result is false this field determines the HTTP error status code to be sent to the client.
    name {String} When result is false this field determines the HTTP reason phrase.
    headers {Object} When result is false this field determines additional HTTP headers to be sent to the client. For example, { 'Retry-After': 120 }.
*/

/*
Configures the Express app to serve static files from the '../client' directory. 
This line sets up a middleware using express.static to handle requests for static files like HTML, CSS, or JavaScript. 
The path.resolve is used to get the absolute path to the '../client' directory.

Creates a WebSocket server using the ws library (myWebSocket is assumed to be the ws library) and associates it with the existing Express server. 
This is achieved by passing the server object as a configuration option when creating the WebSocket server. 
This allows both the Express server and WebSocket server to share the same underlying network infrastructure.
*/

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
