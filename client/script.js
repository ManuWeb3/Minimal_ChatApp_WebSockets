const url = 'ws://localhost:9876'
const ws = new WebSocket(url) // ws = "connecting"

// ws.send('han Server bai')
// will throw an error if this command is exec. right away after setting up above WS connection
// while we were doing it on Browser-console, there was an implicit lag in writing/exec next cmd

const messages = document.getElementById('messages')
const input = document.getElementById('message')
const button = document.getElementById('send')

// this syntax is used to register an event handler
// ws = "open"
// Until it's open, the flow transfers to set of instructions below
ws.onopen = function () {
  button.disabled = false // gets enabled right at ws = open (after a second, connecting -> open)
  //   console.log('Hello bro!!') - it's a prt of the browser's console, NOT VS Code server-script
  //   ws.send('Kar bai echo')
}

button.disabled = true // enabled when WS connection is Open (not at "connecting")
button.addEventListener('click', sendMessage, false) // clickable only when the button is enabled
function sendMessage() {
  const text = input.value // returns the actual text entered in the input-field
  generateMessageEntry(text, 'Client')
  ws.send(text)
}

// Upon receipt of message from the server -> client
ws.onmessage = function (event) {
  const { data } = event
  generateMessageEntry(data, 'Server')
}

function generateMessageEntry(message, type) {
  const newMessage = document.createElement('div')
  newMessage.innerText = `${type} says: ${message}`
  messages.appendChild(newMessage)
}

// this whole js script is a part of index.html, which in turn is a prt of browser/client (that's why we DON'T use node/nodemon to run the script)
// justt hat we're not writing JS scripts any more in the browser's console, rather in VS code editor likewise server's script though server script runs OUTSIDE of the browser (that's why node/nodemon is used to exec. the code)
