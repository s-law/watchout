var Player = function() {
  this.xPos = 50;
  this.yPos = 50;
  this.r = 20;

  d3.select('svg')
    .append('svg')
    .attr('class', 'player');
  // draw intial position

  this.setPosition(this.xPos, this.yPos);
}

Player.prototype.setPosition = function(virtualX, virtualY) {
  this.xPos = this.keepInBoardX(virtualX);
  this.yPos = this.keepInBoardY(virtualY);

  x = gameBoardAxes.x(this.xPos);
  y = gameBoardAxes.y(this.yPos);

  var positioning = d3.select('.player')
    .data([[x,y]]);
  // if player is already on board, update position
  // positioning.select('circle')
  //   .attr('cx', function(d) { 
  //     return d[0];
  //   })
  //   .attr('cy', function(d) {
  //     return d[1];
  //   });


  // if starting game, set player into position in live game
  positioning.append('circle')
    .attr('cx', function(d) {
      return d[0];
    })
    .attr('cy', function(d) {
     return d[1];
    })
    .attr('r', this.r)
    .style('fill', 'orange')
    .style('stroke', 'blue');  
};

Player.prototype.keepInBoardX = function(x) {
  if (x < 0) {
    x = 0;
  } else if (x > 100) {
    x = 100;
  } 

  return x;
}

Player.prototype.keepInBoardY = function(y) {
  if (y < 0) {
    y = 0;
  } else if (y > 100) {
    y = 100;
  } 

  return y;
};

Player.prototype.dragPlayer = function () {
  var player = d3.select('.player').select('circle');
  var dragBehavior = d3.behavior.drag()
    .on('drag', function() { player.attr('cx', d3.event.x)
      .attr('cy', d3.event.y) })
  player.call(dragBehavior);
}