import _ from 'lodash'
import Trianglify from 'trianglify'

import io from 'socket.io-client'
import Pogario_Loadbar from './pogario_logo'

import context, {
    updateCanvasSize
}
from './canvas'

import Manager from './manager'

let socket = io()

var logo = new Pogario_Loadbar();
var manager = new Manager(socket);

window.addEventListener('resize', updateCanvasSize, false);
window.addEventListener('keyup', keyUp, false);
window.addEventListener('keydown', keyDown, false);

socket.on('time sync', function (time) {
    let myTime = new Date().getTime()
    console.log(`got a time sync from server, it's ${time}. Mine is ${myTime}!`);
});

let me = Math.ceil(Math.random() * 10)

socket.emit('start', me)

let time = new Date().getTime()

console.log(`sending ${time}`)
socket.emit('time sync', time)

updateCanvasSize();

var thisTime = new Date().getTime();
var delta = 0;
var lastTime = thisTime;
var interval = 0;
var targetInterval = 1000 / 60;

//https://github.com/joebain/uprok/blob/master/scripts/flyrock.js#L1098
function loop() {
    thisTime = new Date().getTime();
    delta = thisTime - lastTime;
    lastTime = thisTime;

    update(delta);
    draw();

    interval = targetInterval - (new Date().getTime() - thisTime);
    interval = interval < 1 ? 1 : interval;
    setTimeout(loop, interval);
}

loop();

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    logo.draw(context);
    manager.draw(context);
}

function update(delta) {
    logo.update(delta);
}

function keyDown(event) {
    switch (event.keyCode) {
    case 65:
    case 37:
        socket.emit('move left');
        break;
    case 68:
    case 39:
        socket.emit('move right');
        break;
    }
}

function keyUp(event) {
    switch (event.keyCode) {
    case 65:
    case 68:
    case 39:
    case 37:
        socket.emit('move stop');
        break;
    }
}