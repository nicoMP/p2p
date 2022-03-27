
let net = require('net');
//needed librarys

let singleton = require('./Singleton.js');
let clientsHandler = require('./ClientsHandler.js');
let responseHandler = require('./responseHandler');
//needed modules

let pFlag = process.argv[2];
let connectIP = process.argv[3];
let HOST ='127.0.0.1', PORT = 0;
let DHTKNet = net.createServer();
var peerID, peerName;
var sock;
var DHT = [{ip: "127.0.0.1", port: 4445},{ip: "127.0.0.1", port: 4434}];

//global variables

DHTKNet.listen(PORT,"127.0.0.1");
DHTKNet.on('listening', ()=>{
    PORT =  DHTKNet.address().port;
    peerID = singleton.getPeerID(HOST,PORT);
    peerName = __dirname.split('/');
    peerName = peerName[peerName.length-1];
    console.log('This peer address is ' + HOST + ':' + PORT + ' located at ' +  peerName + ' ' + peerID);
});//gives value to the global variable 
singleton.init();
DHTKNet.on('connection', (sock)=>{
    DHT = clientsHandler.handleClientJoining(sock, peerID, DHT,peerName);//sends it to given module from assignment 1 to hanfdle
})

if (pFlag != undefined){//what to do if there's a pflag
        switch(pFlag){
            case '-p':
                connectTO(connectIP);//function to connect to given ip and port
                break;
            default:
                console.log('not implemented');
                
        }
    }


function connectTO(recAddress){

    var addArray = recAddress.split(':');//splitting port and ip into array
    let ip = addArray[0], port = addArray[1];
    if(validateIPaddress(ip, port)){
            sock = net.connect(port, ip);
            sock.on('data', (data)=>{
                console.log(data);
                responseHandler.parseBuffer(data);
            });
    }
}
function validateIPaddress(ipaddress,port) 
{
    var ip = false, p = false;
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
    {
        ip = true;
    }
    if(port > 1023 && port < 65536){
        p = true;
    }
    if(p&p){
        return true;
    }
    else {
        if((p == false) && (ip ==false)) console.log('Invalid IP address and port number');
        else if((p == false)) console.log('Invalid port number');
        else console.log('Invalid IP address');
        console.log('No Connection Established');
        return false;
    }
}

process.on('uncaughtException', err => {
    console.error('There was an uncaught error:', err.code + '\nProgram Exited');
    DHTKNet.close();
    process.exit(1); //mandatory (as per the Node.js docs)
  })