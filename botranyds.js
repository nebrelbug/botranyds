window.onload = function () {
var c = document.getElementById("mycanvas");
function setup() {
  c.width = c.parentElement.clientWidth;
  //console.log("parent height: " + parentHeight(c))
  c.height = document.documentElement.clientHeight - 30;
  //console.log("c.height: " + c.height);
}
var ctx = c.getContext("2d");
setup()

function drawCircle(x, y, radius, fillcolor, strokecolor) {
  ctx.beginPath();
  if (fillcolor !== 0) {
    ctx.fillStyle = fillcolor;
  }
  if (strokecolor !== 0) {
    ctx.strokeStyle = strokecolor;
  }
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = fillcolor;
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, strokecolor) {
  ctx.beginPath();
  if (strokecolor !== 0) {
    ctx.strokeStyle = strokecolor;
  }
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function Coordinate(x, y, name) {
  this.x = x;
  this.y = y;
  this.name = name;
  this.draw = function (x, y) {
    ctx.lineWidth = 3;
    drawCircle(this.x, this.y, 6, "red", "black");
    ctx.strokeStyle = "red";
    ctx.font = '15px Arial';
    ctx.fillText(this.name, this.x - 10, this.y - 10);
  }
  this.set = function (x, y) {
    this.x = x;
    this.y = y;
  }
  this.dispCoordinates = function (textx, texty) {
    ctx.fillText(this.name + ": (" + this.x + " " + this.y + ")", textx, texty);
  };
  this.supposedCoordinates = {
    X: 0,
    Y: 0
  }
};

function dist(one, two) {
  return Math.sqrt(Math.pow(two.x - one.x, 2) + Math.pow(two.y - one.y, 2))
}


var triangulatorBots = {
  A: new Coordinate(80, 300, "A"),
  B: new Coordinate(200, 100, "B"),
  C: new Coordinate(480, 270, "C"),
  D: new Coordinate(240, 80, "D")

}

var botranyds = [new Coordinate(200, 200, "E"), new Coordinate(260, 200, "F")];//You could add infinite here

c.onmousemove = function (e) {
  var x = e.pageX - this.offsetLeft;
  var y = e.pageY - this.offsetTop;
}

var mouseisdown = false;
var currentCoordinate = 0;

c.addEventListener("mousedown", function (e) {
  mouseisdown = true;
  currentCoordinate = 0;
  var x = e.pageX - this.offsetLeft;
  var y = e.pageY - this.offsetTop;
  for (var coord in triangulatorBots) {
    var coordinate = triangulatorBots[coord]
    if (dist(coordinate, { x: x, y: y }) < 7) {
      currentCoordinate = coordinate;
    }
  }
  for (var i = 0; i < botranyds.length; i++) {
    var coordinate = botranyds[i];
    if (dist(coordinate, { x: x, y: y }) < 7) {
      currentCoordinate = coordinate;
    }
  }
});

c.addEventListener("mousemove", function (e) {
  var x = e.pageX - this.offsetLeft;
  var y = e.pageY - this.offsetTop;
  if (mouseisdown) {
    onDrag(x, y)
  }
  draw()
});

c.addEventListener("mouseup", function (e) {
  mouseisdown = false;
  currentCoordinate = 0;
});


window.onresize = function (event) {
  setup()
  draw()
};

function onDrag(x, y) {
  if (currentCoordinate !== 0) {
    currentCoordinate.set(x, y);
  }
}

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);
  setup();
  ctx.strokeStyle = "red";
  for (var coord in triangulatorBots) {//For each triangulator bot,
    var coordinate = triangulatorBots[coord];
    for (var coord2 in triangulatorBots) {//Draw lines between it and each of the other triangulator bots
      var secondcoord = triangulatorBots[coord2]
      if (secondcoord !== coordinate) {
        ctx.lineWidth = 5;
        drawLine(coordinate.x, coordinate.y, secondcoord.x, secondcoord.y)
        ctx.lineWidth = .3;
      }
    }
    for (var j = 0; j < botranyds.length; j++) {//and it and each of the botranyds
      var secondcoord = botranyds[j]
      drawLine(coordinate.x, coordinate.y, secondcoord.x, secondcoord.y)
    }
  }
  var msgShown = []
  for (var i = 0; i < botranyds.length; i++) {//Draw lines between each of the botranyds and each other
    var coordinate = botranyds[i];
    coordinate.draw();
    for (var j = 0; j < botranyds.length; j++) {
      var secondcoord = botranyds[j]
      var botcoords = getRelativeCoordinates(secondcoord, triangulatorBots, 3, 2);
      if (msgShown[j] !== "true") {
      ctx.fillText(secondcoord.name + "'s coordinates are: (" + botcoords.X + ", " + botcoords.Y + ")", 10, 380 + 30*j);
      msgShown[j] = "true"
      }
      //ctx.fillText("It took: " + timeToComplete + "ms to calculate coordinates", 10, 20 + 30*j);
      if (secondcoord !== coordinate) {
        ctx.lineWidth = .3;

        drawLine(coordinate.x, coordinate.y, secondcoord.x, secondcoord.y)
      }
    }
  }
  //After drawing all the lines, draw all the circles, to make it look nice
  for (var coord in triangulatorBots) {
    var coordinate = triangulatorBots[coord];
    coordinate.draw()
  }
  for (var i = 0; i < botranyds.length; i++) {
    var coordinate = botranyds[i];
    coordinate.draw();
  }
}

var timeToComplete;

draw();

function acos(num) {
  return Math.acos(num)
}
function sq(num) {
  return Math.pow(num, 2)
}
function sqrt(num) {
  return Math.pow(num, .5)
}
function tan(num) {
  return Math.tan(num)
}
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getRelativeCoordinates(point, triangulatorBots, numTriBots, rand) {
  var percent = .01 * rand;
  var start = window.performance.now();
  console.time("getRelativeCoordinates")
  var tb = triangulatorBots;
  var ab = dist(tb.A, tb.B) + getRandom(-percent, percent)
  //console.log("ab: " + ab)
  var ac = dist(tb.A, tb.C) + getRandom(-percent, percent)
  var bc = dist(tb.B, tb.C) + getRandom(-percent, percent)
  var pa = dist(point, tb.A) + getRandom(-percent, percent)
  var pb = dist(point, tb.B) + getRandom(-percent, percent)
  var pc = dist(point, tb.C) + getRandom(-percent, percent)
  //You can test with uncertain distances, use more than 3 bots
  var angleA = acos((sq(bc) - sq(ab) - sq(ac)) / (-2 * ab * ac));
  //We don't need angleB
  var angleC = acos((sq(ab) - sq(bc) - sq(ac)) / (-2 * bc * ac));
  var angleACP = acos((sq(pa) - sq(pc) - sq(ac)) / (-2 * pc * ac));
  var angleCAP = acos((sq(pc) - sq(ac) - sq(pa)) / (-2 * ac * pa));
  var angleBCP = acos((sq(pb) - sq(pc) - sq(bc)) / (-2 * bc * pc));
  var angleBAP = acos((sq(pb) - sq(ab) - sq(pa)) / (-2 * ab * pa));
  var altitude = ac / ((1 / tan(angleACP)) + (1 / tan(angleCAP)));
  var heightoftriangle = ac / ((1 / tan(angleA)) + (1 / tan(angleC)));
  var X;
  var Y;
  //Get sign of Y:
  if (angleBCP > angleC && angleBAP > angleA) {
    Y = altitude * -1;
  } else {
    Y = altitude;
  }
  //x^2 + y^2 = da, so da - y^2 = x^2
  //named sideways because we don't have the sign
  var sideways = sqrt(sq(pa) - sq(Y));
  //Get sign of X:
  //console.log("angleCAP: " + angleCAP)
  //console.log("angleA: " + angleA)
  if (angleCAP * 180 / Math.PI > 90) {
    var X = sideways * -1;
  } else {
    var X = sideways;
  }
  if (isNaN(X)) {//X is undefined at 0
    X = 0;
  }
  var firstX = X;
  var firstY = Y;
  if (triangulatorBots === 4) {
    var ab = dist(tb.A, tb.D) + getRandom(-percent, percent)
    bc = dist(tb.D, tb.C) + getRandom(-percent, percent)
    pb = dist(point, tb.D) + getRandom(-percent, percent)
    angleA = acos((sq(bc) - sq(ab) - sq(ac)) / (-2 * ab * ac));
    //We don't need angleB
    angleC = acos((sq(ab) - sq(bc) - sq(ac)) / (-2 * bc * ac));
    angleBCP = acos((sq(pb) - sq(pc) - sq(bc)) / (-2 * bc * pc));
    angleBAP = acos((sq(pb) - sq(ab) - sq(pa)) / (-2 * ab * pa));
    altitude = ac / ((1 / tan(angleACP)) + (1 / tan(angleCAP)));
    heightoftriangle = ac / ((1 / tan(angleA)) + (1 / tan(angleC)));

    if (angleBCP > angleC && angleBAP > angleA) {
      Y = altitude * -1;
    } else {
      Y = altitude;
    }
    //x^2 + y^2 = da, so da - y^2 = x^2
    //named sideways because we don't have the sign
    var sideways = sqrt(sq(pa) - sq(Y));
    //Get sign of X:
    //console.log("angleCAP: " + angleCAP)
    //console.log("angleA: " + angleA)
    if (angleCAP * 180 / Math.PI > 90) {
      var X = sideways * -1;
    } else {
      var X = sideways;
    }
    if (isNaN(X)) {//X is undefined at 0
      X = 0;
    }
    X = (X + firstX) / 2;
    Y = (Y + firstY) / 2;
  }
  var end = window.performance.now();
  timeToComplete = end - start;
  console.timeEnd("getRelativeCoordinates")
  return { X: X, Y: Y };
}
}
