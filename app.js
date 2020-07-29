const PeerServer = require('./').PeerServer;
const PORT = process.env.PORT;
const server = PeerServer({port: PORT, proxied: true});
const baseUrl = 'https://code-spot.azurewebsites.net/api/Room/';
const https = require('https');

function handleDisconnect(client) {
    // Delete peer from Db
    console.log('Handling Peer Disconnect');
    const url = baseUrl + "DeletePeer?peerId=" + client.getId();
    https.delete(url, response => {
        let data = '';
        response.on('data', chunk => {
            data += chunk;
        })
        response.on('end', () => {
            console.log(data);
            console.log('Deleted peer with id: ' + client.getId() + ' from database');
        })
    })
    .on('error', err => {
        console.log('Error: ' + err.message);
    });
}

server.on('connection', (client) => {/* Do nothing */});
server.on('disconnect', (client) => handleDisconnect(client));
