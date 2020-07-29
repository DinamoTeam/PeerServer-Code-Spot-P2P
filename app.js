const PeerServer = require('./').PeerServer;
const PORT = process.env.PORT;
const server = PeerServer({port: PORT, proxied: true});
const https = require('https'); 

function handleConnect(client) {
    console.log('A peer with id ' + client.getId() + ' just connected to peerServer');
}

function handleDisconnect(client) {
    console.log('Handling Peer Disconnect');

    const peerIdToDelete = client.getId();
    const requestContent = JSON.stringify({
        peerId: peerIdToDelete
      })
    const options = {
    hostname: 'code-spot.azurewebsites.net',
    path: '/api/Room/DeletePeer',
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': requestContent.length
    }
    }

    let data = '';
    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', (chunk) => {
            data += chunk;
        });
    });    
    
    req.on('error', (error) => {
        console.error(error)
    });

    req.on('end', () => {
        console.log(data);
        console.log('Deleted peer with id: ' + client.getId() + ' from database');
    });

    req.write(data);
    req.end();
}

server.on('connection', (client) => handleConnect(client));
server.on('disconnect', (client) => handleDisconnect(client));
