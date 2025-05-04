const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Set up the WebSocket server
const wss = new WebSocket.Server({ port: 8081 }, () => {
  console.log('WebSocket server started on ws://localhost:8081');
});

// Create a new SerialPort instance (for reading data from Arduino)
const portName = 'COM3'; // Replace with your port
const port = new SerialPort({
  path: portName,
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Broadcast incoming data to all connected WebSocket clients
parser.on('data', (data) => {
  console.log('Data from Arduino:', data);

  // Broadcast data to all clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
});

// Handle WebSocket client connection
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Send a message to the client when connected
  ws.send('Connected to WebSocket server');
});
