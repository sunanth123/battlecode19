import {BCAbstractRobot, SPECS} from 'battlecode';

const castle = {};

function square_distance(start, dest)
{
	var sq_dis = Math.pow(start.x - dest.x, 2) + Math.pow(start.y - dest.y, 2);
	return sq_dis;
};

//helper function to get the closest location of resource
function getClosestRes(current_loc, resource_map)
{
	const map_length = resource_map.length;
	var closest_location = null;
	var closest_dist = 1000;

	for (let y = 0; y < map_length; y++){
	  for (let x = 0; x < map_length; x++){
            if (resource_map[y][x] && square_distance({x,y}, current_loc) < closest_dist){
	      closest_dist = square_distance({x,y}, current_loc);
	      closest_location = {x, y};
            }
	  }
	}
	return closest_location;
};


function buildOnEmptyOther(buildvision,fullmap,xcord,ycord)
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

//helper function to see if unit can be built in adjacent tile
function buildOnEmpty(buildvision,fullmap,xcord,ycord,resource,myself)
{
     var returnedArray = [];
     var flag = 0;
     var resdist = 1000;
     var inside = 0;
     var dx;
     var dy;
     var x = myself.x - 1;
     var y = myself.y - 1;

     if(buildvision[ycord-1][xcord-1] != undefined && buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dy = - 1;
       dx = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x;
     y = myself.y - 1;
     if(buildvision[ycord-1][xcord] != undefined && buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === true && square_distance({x,y}, resource) < resdist){
       dx = 0;
       dy = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y - 1;
     if(buildvision[ycord-1][xcord+1] != undefined && buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === true && square_distance({x,y}, resource) < resdist){
       dx = 1;
       dy = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y;
     if(buildvision[ycord][xcord-1] != undefined && buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dx = - 1;
       dy = 0;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y;
     if(buildvision[ycord][xcord+1] != undefined && buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === true && square_distance({x,y}, resource) < resdist){
       dx = 1;
       dy = 0;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y + 1;
     if(buildvision[ycord+1][xcord-1] != undefined && buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dx = - 1;
       dy = 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x;
     y = myself.y + 1;
     if(buildvision[ycord+1][xcord] != undefined &&	buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === true && square_distance({x,y}, resource) < resdist){
       dx = 0
       dy = 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y + 1;
     if(buildvision[ycord+1][xcord+1] != undefined && buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === true && square_distance({x,y}, resource) < resdist){
       dx = 1;
       dy = 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     if (inside === 0){
       flag = 1;
     }
     returnedArray.push(dx);
     returnedArray.push(dy);
     returnedArray.push(flag);
     returnedArray.push(inside);
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
  const karboniteMap = self.getKarboniteMap();
  const fuelMap = self.getFuelMap();

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
  if (self.me.turn === 1){
    var xcord = self.me.x;
    var ycord = self.me.y;
		var edge = fullmap.length - 1;
    //const karboniteMap = self.getKarboniteMap();
    self.log(xcord + " " + ycord);
    var resource = getClosestRes(self.me, karboniteMap);
    self.log(resource);
    self.log(resource.x);

		if (xcord === edge || xcord === 0 || ycord === edge || ycord === 0)
		{
			self.log("FKASFLKJASFJLKASJFLKAJSKFJKASFJLKASJFLK");
			var adjacentInfo = buildOnEmptyOther(buildvision,fullmap,xcord,ycord);
	    if (adjacentInfo[2] === 1){
	      self.log("unable to build pilgrim");
	    }
	    else{
	      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
	      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
			}
		}

    var adjacentInfo = buildOnEmpty(buildvision,fullmap,xcord,ycord,resource,self.me);
    self.log(adjacentInfo[3]);
    if (adjacentInfo[2] === 1){
      self.log("unable to build pilgrim");
    }
    else{
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
    }
  }

  else if (self.me.turn === 2){
    var xcord = self.me.x;
    var ycord = self.me.y;
    //const fuelMap = self.getFuelMap();
    self.log(xcord + " " + ycord);
    var resource = getClosestRes(self.me, fuelMap);

		if (xcord === edge || xcord === 0 || ycord === edge || ycord === 0)
		{
			var adjacentInfo = buildOnEmptyOther(buildvision,fullmap,xcord,ycord);
			if (adjacentInfo[2] === 1){
				self.log("unable to build pilgrim");
			}
			else{
				self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
				return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
			}
		}

    var adjacentInfo = buildOnEmpty(buildvision,fullmap,xcord,ycord,resource, self.me);
    if (adjacentInfo[2] === 1){
      self.log("unable to build pilgrim");
    }
    else{
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
    }
  }


  //if karbonite is greater than or equal to 60 start making crusaders
  if (self.karbonite >= 60){
    var xcord = self.me.x;
    var ycord = self.me.y;
    var adjacentInfo = buildOnEmptyOther(buildvision,fullmap,xcord,ycord);
    if (adjacentInfo[2] === 1){
      self.log("unable to build crusader");
    }
    else{
      self.log("Building a crusader at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.CRUSADER, adjacentInfo[0], adjacentInfo[1]);
    }
  }


};

export default castle;
