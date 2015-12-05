// start slingin' some d3 here.
var gameOptions = {
  height: 450, 
  width: 700,
  nEnemies: 30,
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

var enemiesStepPosition = function(enemyObj, timestep) {
  var startX = enemyObj.x;
  var startY = enemyObj.y;
  var randLocEnd = randomCoor();
  var endX = randLocEnd[0];
  var endY = randLocEnd[1];
  var enemiesNextLocX = startX + (endX-startX)*timestep;
  var enemiesNextLocY = startY + (endY-startY)*timestep;
  enemyObj.x = enemiesNextLocX;
  enemyObj.y = enemiesNextLocY;
  return [enemiesNextLocX, enemiesNextLocY];  
}

var render = function(arr, player) {

  var allEne = d3.select('svg.enemy').selectAll("circle.enemies")
    .data(arr, function(d) {
      return d.id;
    });

  allEne.enter()
    .append("svg:circle")
    .attr("class", "enemies")
    .attr("cx", function(d) {return d.x})
    .attr("cy", function(d) {return d.y})
    .attr("r", function(d) {return d.r});

  allEne.transition().duration(1000).tween('custom', function() {
    return function(t) {
      updateEnemiesAndCollisionCheck(t);
    }
  })
    .attr("cx", function(d) {return d.x})
    .attr("cy", function(d) {return d.y});

  var updateEnemiesAndCollisionCheck = function(t) {
    var newPos = [];
    for (var i = 0; i < arr.length; i++) {
      newPos.push(enemiesStepPosition(arr[i], t))
      if (i === 10 && t % 4 === 0) {
        console.log(newPos[i][0], newPos[i][1]);
      }
    }

    // check collision on these positions
    for (var i = 0; i < arr.length; i++) {
      var collisionDist = player.r + arr[i].r;

      if ( Math.pow((player.xPos - arr[i].x), 2) + Math.pow((player.yPos - arr[i].y), 2) < Math.pow(collisionDist, 2)) {
        gameStats.current = 0;
        gameStats.collisions++;
        changeStats();
        changeStats('collisions');
        changeBestScore();
      }
    };
  };
};

var runGame = function() {
  var player = new Player();
  var arr = createEnemies();
  d3.select("svg.gameBoard")
    .append('svg')
    .attr("class", "enemy");
  
  setInterval(function() {
    render(arr, player);
    console.log("Player: ", player.xPos, player.yPos);
  }, 1000);

};

var randomCoor = function() {
  var x = gameBoardAxes.x(Math.random()*100);
  var y = gameBoardAxes.y(Math.random()*100);
  return [x, y];
};

// var collCheck = function() {

//   //for (var i=0; i)
// };


