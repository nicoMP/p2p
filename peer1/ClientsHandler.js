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
    assignClientName(sock, nickNames);
    const chunks = [];
    console.log(
      "\n" +
        nickNames[sock.id] +
        " is connected at timestamp: " +
        startTimestamp[sock.id]
    );
    handleResponse(sock, DHT, peerName);
    sock.on("close", function () {
      handleClientLeaving(sock);
    });
  },
};

function handleResponse(sock, DHT, peerName){
  KADpacket.init(7,1,DHT.length, peerName, DHT)
  sock.write(KADpacket.getBytePacket());//you were here you have to get a packet you can do that by using the kadptp
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

function bytesToString(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

function bytes2number(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result ^= array[array.length - i - 1] << (8 * i);
  }
  return result;
}

// return integer value of a subset bits
function parseBitPacket(packet, offset, length) {
  let number = "";
  for (var i = 0; i < length; i++) {
    // let us get the actual byte position of the offset
    let bytePosition = Math.floor((offset + i) / 8);
    let bitPosition = 7 - ((offset + i) % 8);
    let bit = (packet[bytePosition] >> bitPosition) % 2;
    number = (number << 1) | bit;
  }
  return number;
}
// Prints the entire packet in bits format
function printPacketBit(packet) {
  var bitString = "";

  for (var i = 0; i < packet.length; i++) {
    // To add leading zeros
    var b = "00000000" + packet[i].toString(2);
    // To print 4 bytes per line
    if (i > 0 && i % 4 == 0) bitString += "\n";
    bitString += " " + b.substr(b.length - 8);
  }
  console.log(bitString);
}
