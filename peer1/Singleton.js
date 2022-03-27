
let sequenceNumber;
let timerInterval = 10;
let timer;

function timerRun() {
    timer ++;
    if (timer == 4294967295) {
        timer = Math.floor(1000 * Math.random()); // reset timer to be within 32 bit size
    }
}

module.exports = {
    init: function() {
        timer = Math.floor(1000 * Math.random()); /* any random number */
        setInterval(timerRun, timerInterval);
        sequenceNumber = Math.floor(1000 * Math.random()); /* any random number */
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function() {
        sequenceNumber ++;
        return sequenceNumber;
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: function() {
        return timer;
    },
    
    //--------------------------
    //getPeerID: takes the IP and port number and returns 20 bytes Hex number
    //--------------------------
    getPeerID: function (IP, port) {
        var crypto = require('crypto')
        var sha1 = crypto.createHash('sha1')
        sha1.update(IP + ':' + port)
        return sha1.digest('hex')
    },

}