
let net = require('net');
let singleton = require('./Singleton.js');
let pFlag = process.argv[2];
let connectIP = process.argv[3];

let HOST ='127.0.0.1', PORT = 0;
let DHTKNet = net.createServer();
var peerID;
DHTKNet.listen(PORT,"127.0.0.1");
DHTKNet.on('listening', ()=>{
    PORT =  DHTKNet.address().port;
    peerID = singleton.getPeerID(HOST,PORT);
    console.log('This peer address is ' + HOST + ':' + PORT + ' located at ' + peerID);
});
singleton.init();
DHTKNet.on('connection', ()=>{

})
if (pFlag != undefined){
    switch(pFlag){
        case '-p':
            connectToPeer();
            break;
        default:
            console.log('not implemented');
            
    }
}

let connectToPeer = () =>{
    
}


