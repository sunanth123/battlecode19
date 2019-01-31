import {BCAbstractRobot, SPECS} from 'battlecode';

// Attack Range 16-64
const prophet = {};

prophet.makemove = (self) => {
  self.log("Phrophet: " + self.id + " Beggining turn");
  var inPosition = false;            // Set to true when prophet gets to desired location
  var desiredPosition;               // Tile prophet wants to get to.
  var visibleUnits = self.getVisibleRobots(); // Units that can be seen by the prophet

  //*** Set Direction to move in.
  const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  var choice;
  if(choice == undefined)
    choice = choices[Math.floor(Math.random()*choices.length)];

  //*** Check if enemies are within range
  var enemies = visibleUnits.filter((robot) => {
    if(robot.team !== self.me.team){
      return true;
    }
  });
  if(enemies.length > 0){
    self.log("Phrophet: " + self.id + "  Found an enemy");
    var enemyToAttack; // Will contain id of robot to attack
    var distance;      // Used to store how far away an enemy is.
    for(var i = 0; i < 10; i++){
      distance = (enemies[i].x-self.me.x)**2 + (enemies[i].y-self.me.y)**2;
      if(distance >= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[0] && distance <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]){
        if(enemyToAttack == undefined){
          self.log("Phrophet: " + self.id + "  Attacking");
          enemyToAttack = enemies[i];
          var dx = enemyToAttack.x - self.me.x;
          var dy = enemyToAttack.y - self.me.y;
          return self.attack(dx, dy);
        }
      }
    }
  }

  else{
     self.log("Phrophet: " + self.id + " Moving");
     return self.move(choice[0],choice[1]);
     if(self.map[self.me.y+choice[1]][self.me.x+choice[0]] == true)
     return self.move(choice[0],choice[1]);
     else{
       const choice = choices[Math.floor(Math.random()*choices.length)];
       return self.move(choice[0],choice[1]);
     }
  }


};

export default prophet;
