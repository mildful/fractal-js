/**
 * A point object
 * @param {int} x coordinates
 * @param {int} y coordinates
 * @returns {Point}
 */
function Point(x, y) {
  this.x = x;
  this.y = y;
}

/**
 * Square a number
 * @param {int} number a number
 * @returns {int}
 */
function square(number) {
  return number * number;
}

/**
 * A point object
 * @param {int} x1 start x coodrinates
 * @param {int} y1 start y coordinates
 * @param {int} x2 end x coodrinates
 * @param {int} y2 end y coordinates
 * @returns {Line}
 */
function Line(x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.length = Math.sqrt(square(x2 - x1) + square(y2 - y1));
  this.angleFromHorizon = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

/**
 * Get 4 'kocherized' lines given a line
 * @returns {Array<Line>}
 */
Line.prototype.getKochLines = function () {
  const subLength = this.length / 3;
  let lines = [];

  /*
               /\
             /   \
           l2    l3
  ___l1___/       \___l4___
  */
  const l1p2 = getNextPointFromAngle(this.x1, this.y1, this.angleFromHorizon, subLength);
  const l1 = new Line(
    this.x1, this.y1,
    l1p2.x, l1p2.y
  );
  const l2p2 = getNextPointFromAngle(l1.x2, l1.y2, this.angleFromHorizon - 60, subLength);
  const l2 = new Line(
    l1.x2, l1.y2,
    l2p2.x, l2p2.y
  );
  const l3p2 = getNextPointFromAngle(l2.x2, l2.y2, this.angleFromHorizon + 60, subLength);
  const l3 = new Line(
    l2.x2, l2.y2,
    l3p2.x, l3p2.y
  );
  const l4p2 = getNextPointFromAngle(l3.x2, l3.y2, this.angleFromHorizon, subLength);
  const l4 = new Line(
    l3.x2, l3.y2,
    l4p2.x, l4p2.y
  );

  lines.push(...[l1, l2, l3, l4]);
  return lines;
};

function getNextPointFromAngle(x, y, angle, length, clockwise = true) {
  angle = clockwise ? angle : 360 - angle;
  angle = deg2rad(angle);
  return new Point(
    x + length * Math.cos(angle),
    y + length * Math.sin(angle)
  );
}

function renderLines(ctx, lines) {
  lines.forEach(function(line) {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
  });
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

window.onload = function() {
  const drawButton = document.getElementById('draw-button');
  const input = document.getElementById('iterations-input');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const CANVAS_WIDTH = canvas.width;
  const CANVAS_HEIGHT = canvas.height;


  drawButton.addEventListener('click', function() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const iterations = +input.value;

    const OUTER_OFFSET = 100;
    const outerBase = new Line(
      CANVAS_WIDTH - OUTER_OFFSET, CANVAS_HEIGHT - OUTER_OFFSET,
      OUTER_OFFSET, CANVAS_HEIGHT - OUTER_OFFSET
    );
    const outerRight = new Line(
      CANVAS_WIDTH / 2,  OUTER_OFFSET,
      CANVAS_WIDTH - OUTER_OFFSET, CANVAS_HEIGHT - OUTER_OFFSET
    );
    const outerLeft = new Line(
      OUTER_OFFSET, CANVAS_HEIGHT - OUTER_OFFSET,
      CANVAS_WIDTH / 2,  OUTER_OFFSET
    );

    const baseLine = new Line(
      0, CANVAS_HEIGHT - 20,
      CANVAS_WIDTH, CANVAS_HEIGHT - 20
    );

    let lines = [ baseLine ];

    for (let i = 0; i < iterations; i++) {
      const linesBackup = [ ...lines ];
      lines = [];
      linesBackup.forEach(function (line) {
        lines.push(...line.getKochLines());
      });
    }

    renderLines(ctx, lines);
  });
}
