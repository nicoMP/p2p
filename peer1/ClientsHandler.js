var KADpacket = require("./KADPTP"),
singleton = require("./Singleton");
const fs = require("fs");
const { getBytePacket } = require("./KADPTP");

var nickNames = {},
  clientIP = {},
  startTimestamp = {},
  packet;

module.exports = {
  handleClientJoining: function (sock, peerID, DHT, peerName) {
    var hTable;
    assignClientName(sock, nickNames);
    const chunks = [];
    console.log(
      "\n" +
        nickNames[sock.id] +
        " is connected at timestamp: " +
        startTimestamp[sock.id]
    );
    handleConnection(sock, DHT, peerName);
    sock.on("close", function () {
      handleClientLeaving(sock);
    });
  },
};

function handleConnection(sock, DHT, peerName){
  DHT = DHT.filter(n => n)
  try
  {KADpacket.init(7,1,DHT.length, peerName, DHT); }
  catch(e){
    console.log(e)
  }
  //you were here you have to get a packet you can do that by using the kadptp
  try {
    sock.write(KADpacket.getBytePacket())
  } catch (error) {
    console.log(error);
  }
  
}


function handleClientLeaving(sock) {
  console.log(nickNames[sock.id] + " closed the connection");
  
}

function assignClientName(sock, nickNames) {
  sock.id = sock.remoteAddress + ":" + sock.remotePort;
  startTimestamp[sock.id] = singleton.getTimestamp();
  var name = "Client-" + startTimestamp[sock.id];
  nickNames[sock.id] = name;
  clientIP[sock.id] = sock.remoteAddress;
}


