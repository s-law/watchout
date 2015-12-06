// start slingin' some d3 here.
var gameOptions = {
  height: 450, 
  width: 700,
  nEnemies: 5,
  padding: 20
};
var gameStats = {
  current: 0, 
  highscore: 0,
  collisions: 0
};
var gameBoardAxes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};
var rToV = {
  x: d3.scale.linear().domain([0,gameOptions.width]).range([0,100]),
  y: d3.scale.linear().domain([0,gameOptions.height]).range([0,100])
};

var gameBoard = d3.select('.board')
  .append('svg')
  .attr("class", "gameBoard")
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
  var randLoc;
  for (var i=0; i<gameOptions.nEnemies; i++) {
    randLoc = randomCoor();
    arrEne.push({id: i,
      x: randLoc[0],
      y: randLoc[1],
      r: 10
    });
  }
  return arrEne;
};


var render = function(arr, player) {
  // debugger;
  var allEne = d3.select('svg.enemy').selectAll("circle.enemies")
    .data(arr, function(d) {
      return d.id;
    });
  //console.log(JSON.stringify(allEne));

  allEne.enter()
    .append("svg:circle")
    .attr("class", "enemies")
    .attr("cx", function(d) {return d.x})
    .attr("cy", function(d) {return d.y})
    .attr("r", function(d) {return d.r});

  var crashCheck = function(enemy) {
    console.log("cC: ", enemy);
    var crashDist = player.r + parseInt(enemy.attr('r'));
    
    var playerRealX = gameBoardAxes.x(player.xPos);
    var playerRealY = gameBoardAxes.y(player.yPos);

    var locDistance = Math.pow((playerRealX - parseFloat(enemy.attr('cx'))), 2) + Math.pow((playerRealY - parseFloat(enemy.attr('cy'))), 2);

    if (locDistance < Math.pow(crashDist, 2) ) {
      // console.log(crashDist, Math.pow(collisionDist, 2));
      gameStats.current = 0;
      gameStats.collisions++;
      changeStats();
      changeStats('collisions');
      changeBestScore();
    }
  };

  var stepAndCrashCheck = function(endPos) {
    enemy = d3.select(this);
    //console.log("sACC :", this);
    
    var oldPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    }
    var newPos = {
      x: gameBoardAxes.x(endPos.x),
      y: gameBoardAxes.y(endPos.y)
    }

    return function(t) {
      crashCheck(enemy);

      newPosStep = {
        x: oldPos.x + (newPos.x - oldPos.x)*t,
        y: oldPos.y + (newPos.y - oldPos.y)*t
      } 

      enemy.attr('cx', newPosStep.x)
        .attr('cy', newPosStep.y);
    } 
  }  

  allEne.transition().duration(1000).tween('custom', stepAndCrashCheck);
  
};

var runGame = function() {
  //debugger;
  var player = new Player();
  d3.select("svg.gameBoard")
    .append('svg')
    .attr("class", "enemy");

  var gameStep = function() {
    var arr = createEnemies();
    render(arr, player);
  }

  gameStep();
  setInterval(gameStep, 1000);

  
  // setInterval(function() {
  //   render(arr, player);
  //   console.log("Player: ", player.xPos, player.yPos);
  // }, 2000);

};

var randomCoor = function() {
  var x = gameBoardAxes.x(Math.random()*100);
  var y = gameBoardAxes.y(Math.random()*100);
  return [x, y];
};

