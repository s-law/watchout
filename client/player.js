var Player = function() {
  this.xPos = 50;
  this.yPos = 50;
  this.r = 20;
  // draw intial position
  this.setPosition(gameBoardAxes.x(50), gameBoardAxes.y(50));
}

Player.prototype.setPosition = function(x, y) {
  var positioning = d3.select('svg')
    .select('circle')
    .data([x, y]);
  // if player is already on board, update position
  positioning.attr('cx', function(d) { return d[0]};)
    .attr('cy', function(d) { return d[1]};);


  // if starting game, set player into position in live game
  positioning.attr('cx', function(d) { return d[0]};)
    .attr('cy', function(d) { return d[1]};)
    .attr('r', this.r);  
};

Player.prototype.keepInBoard = function(x, y) {
  if (x < 0) {
    this.xPos = 0;
  } else if (x > 100) {
    this.xPos = 100;
  } else {
    this.xPos = x;
  }

  if (y < 0) {
    this.yPos = 0;
  } else if (y > 100) {
    this.yPos = 100;
  } else {
    this.yPos = y;
  }
};