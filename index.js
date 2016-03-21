var wpi = require('wiring-pi');
var config = require('./config');
var express = require('express');
var app = express();

wpi.wiringPiSetup();
var pin = config.port;

//pin 9 on WPI
wpi.pinMode(pin, wpi.OUTPUT);

var flashing = false;
app.get('/status', function(req, res){
    res.send(''+ flashing);
});
app.get('/on', function (req, res) {
	
    on();
	flashing = true;
    res.send('on');
});

app.get('/off', function(req, res){
    flashing = false;
    off();
    res.send('off');
});

function on(){
    wpi.digitalWrite(pin, 0);
}
function off(){
    wpi.digitalWrite(pin, 1);
}

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});


function exitHandler(options, err) {
    if (options.cleanup) {
        if(wpi){
            wpi.digitalWrite(pin, 0);
        }
    }
    if (err) {
        console.log(err.stack);
    }
    if (options.exit) {
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

console.log('Press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
