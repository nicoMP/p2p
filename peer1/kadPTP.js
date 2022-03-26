//size of the response packet header:
var HEADER_SIZE = 4;

//Fields that compose the header
var version, responseType, peerNumber, timeStamp;

module.exports = {
  responseHeader: "", //Bitstream of the PTP header
  payloadSize: 0, //size of the PTP payload
  payload: "", //Bitstream of the PTP payload

  init: function (
    ver, // PTP version
    resType, // response type
    peerNum, // number of peers
    senderName, // sender name
    DHT //hash table of server
  ) {
    //fill by default packet fields:
    var version = ver;
    var byteName = stringToBytes(senderName);
    var nameLength = byteName.length;
    console.log(bytesToString(byteName));
    HEADER_SIZE += Math.ceil(nameLength/2);
    //build the header bistream:
    //--------------------------
    this.responseHeader = new Buffer.alloc(HEADER_SIZE);

    //fill out the header array of byte with PTP header fields
    // V
    storeBitPacket(this.responseHeader, version, 0, 4);
    // Response type
    storeBitPacket(this.responseHeader, resType, 4, 8);
    // num of peer
    storeBitPacket(this.responseHeader, peerNum, 12, 8);
    // length name
    storeBitPacket(this.responseHeader, nameLength, 20,12);
    //sender name
    storeBitPacket(this.responseHeader, byteName, 32, nameLength*4);

    //fill the payload bitstream:
    //--------------------------
    this.payload = new Buffer.alloc(peerNum*6);
    var offset = 0;
    if(peerNum>0){
      DHT.forEach((element)=>{
      storeBitPacket(this.payload, element.IP, offset, 32);
      offset += 32;
      storeBitPacket(this.payload, element.port, offset, 16);
      offset += 16;
    });}
  },

  //--------------------------
  //getBytePacket: returns the entire packet in bytes
  //--------------------------
  getBytePacket: function () {
    let packet = new Buffer.alloc(this.payload.length + HEADER_SIZE);
    //construct the packet = header + payload
    for (var Hi = 0; Hi < HEADER_SIZE; Hi++)
      packet[Hi] = this.responseHeader[Hi];
    for (var Pi = 0; Pi < this.payload.length; Pi++)
      packet[Pi + HEADER_SIZE] = this.payload[Pi];

    return packet;
  },
};

// Store integer value into the packet bit stream
function storeBitPacket(packet, value, offset, length) {
  // let us get the actual byte position of the offset
  let lastBitPosition = offset + length - 1;
  let number = value.toString(2);
  let j = number.length - 1;
  for (var i = 0; i < number.length; i++) {
    let bytePosition = Math.floor(lastBitPosition / 8);
    let bitPosition = 7 - (lastBitPosition % 8);
    if (number.charAt(j--) == "0") {
      packet[bytePosition] &= ~(1 << bitPosition);
    } else {
      packet[bytePosition] |= 1 << bitPosition;
    }
    lastBitPosition--;
  }
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

function stringToBytes(str) {
  var ch,
    st,
    re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    st = []; // set up "stack"
    do {
      st.push(ch & 0xff); // push byte to stack
      ch = ch >> 8; // shift value down by 1 byte
    } while (ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  // return an array of bytes
  return re;
}

// Not used in this assignment
function setPacketBit(packet, position, value) {
  // let us get the actual byte position and the bit position
  // within this byte
  let bytePosition = Math.floor(position / 8);
  let bitPosition = 7 - (position % 8);
  if (value == 0) {
    packet[bytePosition] &= ~(1 << bitPosition);
  } else {
    packet[bytePosition] |= 1 << bitPosition;
  }
}
function bytesToString(array) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}