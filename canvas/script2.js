var canvas, context, divCanvas;
var testHeight = 511;
var testWidth = 1024;

var baseX = 440;
var baseHeight = 20;
var baseCorner = 10;

var pinX = 20;
var pinY = 59;
var pinWidth = 20;
var pinHeight = 400;
var pinCorner = 10;
var pinScale = 5.5;

var discHeight = 30;
var discWidths = [];
var discCorner = 12;
var discX = [];
var discY = [];
var discStroke = [];
for (var i = 0; i < 10; i++) {
    discWidths[i] = 340 - 30 * i;
    discX[i] = 180 - 15 * i;
    discY[i] = 410 - 30 * i;
    discStroke[i] = false;
}

var mousePos;
var mouseButton;

window.onload = function () {
    console.log('oi....');
    canvas = document.getElementById('responsive');

    canvas.addEventListener('mousemove', function (evt) {
        mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);
    }, false);

    // canvas.addEventListener('mousedown', function (evt) {
    //     mouseButton = evt.button;
    //     var message = 'Mouse button ' + evt.button + ' down at position: ' + mousePos.x + ',' + mousePos.y;
    //     console.log(message);
    // }, false);
};

function getMousePos(canvas, evt) {
    // necessary to take into account CSS boudaries
    var rect = canvas.getBoundingClientRect();
    console.log(rect);
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function init() {
    divCanvas = document.getElementById('responsive');
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    resizeCanvas();
    draw();
    window.addEventListener('resize', resizeCanvas, false);
}

function resizeCanvas() {
    canvas.width = divCanvas.clientWidth;
    canvas.height = divCanvas.clientHeight;
    draw();
}

function draw() {
    
    var scaleH = divCanvas.clientHeight / testHeight;
    var scaleW = divCanvas.clientWidth / testWidth;
    
    context.fillStyle = '#5C1F00';
    
    // base
    roundedRect(context, 0, baseX * scaleH, canvas.width, baseHeight * scaleH, baseCorner, true);
    
    // pinos
    roundedRect(context, (canvas.width / pinScale - pinX * scaleW), pinY * scaleH, pinWidth * scaleW, pinHeight * scaleH, pinCorner, true);
    roundedRect(context, (canvas.width / 2 - pinX * scaleW), pinY * scaleH, pinWidth * scaleW, pinHeight * scaleH, pinCorner, true);
    roundedRect(context, (4.5 * canvas.width / pinScale), pinY * scaleH, pinWidth * scaleW, pinHeight * scaleH, pinCorner, true);

    // discos
    context.fillStyle = "#FF4D4D";
    roundedRect(context, (canvas.width / pinScale - discX[0] * scaleW), discY[0] * scaleH, discWidths[0] * scaleW, discHeight * scaleH, discCorner, true, discStroke[0]);
    context.fillStyle = "#99FF66";
    roundedRect(context, (canvas.width / pinScale - discX[1] * scaleW), discY[1] * scaleH, discWidths[1] * scaleW, discHeight * scaleH, discCorner, true, discStroke[1]);
    context.fillStyle = "#33CCFF";
    roundedRect(context, (canvas.width / pinScale - discX[2] * scaleW), discY[2] * scaleH, discWidths[2] * scaleW, discHeight * scaleH, discCorner, true, discStroke[2]);
    context.fillStyle = "yellow";
    roundedRect(context, (canvas.width / pinScale - discX[3] * scaleW), discY[3] * scaleH, discWidths[3] * scaleW, discHeight * scaleH, discCorner, true, discStroke[3]);
    context.fillStyle = "orange";
    roundedRect(context, (canvas.width / pinScale - discX[4] * scaleW), discY[4] * scaleH, discWidths[4] * scaleW, discHeight * scaleH, discCorner, true, discStroke[4]);
    context.fillStyle = "#99FFCC";
    roundedRect(context, (canvas.width / pinScale - discX[5] * scaleW), discY[5] * scaleH, discWidths[5] * scaleW, discHeight * scaleH, discCorner, true, discStroke[5]);
    context.fillStyle = "violet";
    roundedRect(context, (canvas.width / pinScale - discX[6] * scaleW), discY[6] * scaleH, discWidths[6] * scaleW, discHeight * scaleH, discCorner, true, discStroke[6]);
    context.fillStyle = "#33ADAD";
    roundedRect(context, (canvas.width / pinScale - discX[7] * scaleW), discY[7] * scaleH, discWidths[7] * scaleW, discHeight * scaleH, discCorner, true, discStroke[7]);
    context.fillStyle = "#A37547";
    roundedRect(context, (canvas.width / pinScale - discX[8] * scaleW), discY[8] * scaleH, discWidths[8] * scaleW, discHeight * scaleH, discCorner, true, discStroke[8]);
    context.fillStyle = "#CCCCCC";
    roundedRect(context, (canvas.width / pinScale - discX[9] * scaleW), discY[9] * scaleH, discWidths[9] * scaleW, discHeight * scaleH, discCorner, true, discStroke[9]);

    var startButton = document.getElementById('inicio');
    var endButton = document.getElementById('desiste');
    startButton.style.marginRight = 30 * scaleW + "px";
    endButton.style.marginRight = 30 * scaleW + "px";
}

function roundedRect(ctx, x, y, width, height, radius, fill, stroke) {
   ctx.beginPath();
   // draw top and top right corner
   ctx.moveTo(x+radius,y);
   ctx.arcTo(x+width,y,x+width,y+radius,radius);
   // draw right side and bottom right corner
   ctx.arcTo(x+width,y+height,x+width-radius,y+height,radius);
   // draw bottom and bottom left corner
   ctx.arcTo(x,y+height,x,y+height-radius,radius);
   // draw left and top left corner
   ctx.arcTo(x,y,x+radius,y,radius);
   if(fill) {
      ctx.fill();
   }
   if(stroke){
      ctx.stroke();
   }
}