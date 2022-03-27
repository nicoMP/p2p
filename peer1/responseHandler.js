
function parseBuffer(buffer){
    var version = parseBitPacket(buffer, 0,4);
    var mType = parseBitPacket(buffer, 4,8);
    var nPeer = parseBitPacket(buffer,12,8);
    var nameLength = parseBitPacket(buffer,20,12);
    var name = bytesToString(buffer.slice(4,4+nameLength));
    console.log(name);//you left off here it sends and recieves the header properly we are not too sure about dht table
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

function bytesToString(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
    result += String.fromCharCode(array[i]);
    }
    return result;
}
module.exports = {parseBuffer};