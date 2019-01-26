import {BCAbstractRobot, SPECS} from 'battlecode';

const castle = {};

//helper function to see if unit can be built in adjacent tile
function buildOnEmpty(buildvision,fullmap,xcord,ycord)
{
     var returnedArray = [];
     var flag = 0;

     if(buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === true){
       ycord = - 1;
       xcord = - 1;
     }
     else if(buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === true){
       xcord = 0;
       ycord = - 1;
     }
     else if(buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === true){
       xcord = 1;
       ycord = - 1;
     }
     else if(buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === true){
       xcord = - 1;
       ycord = 0;
     }
     else if(buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === true){
       xcord = 1;
       ycord = 0;
     }
     else if(buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === true){
       xcord = - 1;
       ycord = 1;
     }
     else if(buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === true){
       xcord = 0
       ycord = 1;
     }
     else if(buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === true){
       xcord = 1;
       ycord = 1;
     }
     else{
       flag = 1;
     }
     returnedArray.push(xcord);
     returnedArray.push(ycord);
     returnedArray.push(flag);
     return returnedArray;
}

castle.makemove = (self) => {
  //add castle logic
  self.log("castle turn");
  // self.log(SPECS.UNITS[self.me.unit].ATTACK_RADIUS[0]);
  // self.log(SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]);

  const buildvision = self.getVisibleRobotMap();
  const fullmap = self.getPassableMap();
  const visiblerobots = self.getVisibleRobots();

  //check if enemy unit is in attack range and attack if in range
  for (var i=0; i<visiblerobots.length; i++) {
    if (visiblerobots[i].team !== self.me.team){
      const range = (visiblerobots[i].x-self.me.x)**2 + (visiblerobots[i].y-self.me.y)**2;
      if (range <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]){
        self.log('Castle attack ' + visiblerobots[i] + ' at ' + (visiblerobots[i].x - self.me.x, visiblerobots[i].y - self.me.y));
        return self.attack(visiblerobots[i].x - self.me.x, visiblerobots[i].y - self.me.y);
      }
    }
  }


  //make pilgrims on the first two turns
  if (self.me.turn === 1 || self.me.turn === 2){
    var xcord = self.me.x;
    var ycord = self.me.y;
    self.log(xcord + " " + ycord);
    var adjacentInfo = buildOnEmpty(buildvision,fullmap,xcord,ycord);
    if (adjacentInfo[2] === 1){
      self.log("unable to build pilgrim");
    }
    else{
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
    }
  }

  //if karbonite is greater than or equal to 60 start making prophets
  if (self.karbonite >= 60){
    var xcord = self.me.x;
    var ycord = self.me.y;
    var adjacentInfo = buildOnEmpty(buildvision,fullmap,xcord,ycord);
    if (adjacentInfo[2] === 1){
      self.log("unable to build prophet");
    }
    else{
      self.log("Building a prophet at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.PROPHET, adjacentInfo[0], adjacentInfo[1]);
    }
  }


};

export default castle;
