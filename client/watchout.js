// start slingin' some d3 here.
var gameOptions = {
  height: 450, 
  width: 700,
  nEnemies: 30,
  padding: 20
};
var gameStats = {
  current: 1, 
  highscore: 0,
  collisions: 0
};
var gameBoardAxes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.board')
  .append('svg')
  .attr("height", gameOptions.height)
  .attr("width", gameOptions.width)

var changeStats = function(whatStats) {
  whatStats = whatStats || "current";
  d3.select('.'+whatStats).select('span')
    .data([gameStats[whatStats]])
    .text(function(d){return d});
};

var changeBestScore = function() {
  if (gameStats.current > gameStats.highscore) {
    gameStats.highscore = gameStats.current;
    changeStats("highscore");
  }
};

var createEnemies = function() {
  var arrEne = [];
  for (var i=0; i<gameOptions.nEnemies; i++) {
    arrEne.push({id: i,
      x: gameBoardAxes.x(Math.random()*100),
      y: gameBoardAxes.y(Math.random()*100)});
  }
  return arrEne;
};

var render = function(arr) {
  var allEne = d3.select('svg').selectAll("circle.enemies")
    .data(arr, function(d) {
      return d.id;
    });
  
  allEne.enter()
    .append("svg:circle")
    .attr("class", "enemies")
    .attr("cx", function(d) {return d.x})
    .attr("cy", function(d) {return d.y})
    .attr("r", 10);
};



