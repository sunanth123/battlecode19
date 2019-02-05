import {BCAbstractRobot, SPECS} from 'battlecode';

const pilgrim = {};

//helper function to get the square distance from the current location to the destination
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

function onestep(buildvision,fullmap,xcord,ycord,resource,myself)
{
     var returnedArray = [];
     var flag = 0;
     var resdist = 1000;
     var inside = 0;
     var dx;
     var dy;
     var x = myself.x - 1;
     var y = myself.y - 1;

     if(buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dy = - 1;
       dx = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x;
     y = myself.y - 1;
     if(buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === true && square_distance({x,y}, resource) < resdist){
       dx = 0;
       dy = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y - 1;
     if(buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === true && square_distance({x,y}, resource) < resdist){
       dx = 1;
       dy = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y;
     if(buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dx = - 1;
       dy = 0;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y;
     if(buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === true && square_distance({x,y}, resource) < resdist){
       dx = 1;
       dy = 0;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y + 1;
     if(buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dx = - 1;
       dy = 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x;
     y = myself.y + 1;
     if(buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === true && square_distance({x,y}, resource) < resdist){
       dx = 0
       dy = 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y + 1;
     if(buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === true && square_distance({x,y}, resource) < resdist){
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
     returnedArray.push(resdist);
     returnedArray.push(inside);
     return returnedArray;
}

pilgrim.makemove = (self) => {
  //add pilgrim logic
  self.log("pilgrim turn");

  const karboniteMap = self.getKarboniteMap();
  const fuelMap = self.getFuelMap();
  const visibleRobots = self.getVisibleRobots();
	const buildvision = self.getVisibleRobotMap();
  const fullmap = self.getPassableMap();


  var xcord = self.me.x;
  var ycord = self.me.y;
  var dx = 0;
  var dy = 0;
  //var fuel_loc = self.me;
  //var karbonite_loc = self.me;



  //check if there's another pilgrim nearby
if (!self.location && !self.typed)
{
		if(visibleRobots.filter(robot => robot.team === self.me.team && robot.unit === 2).length % 2 === 0){
      self.log("fuel pilgrim");
      self.location = getClosestRes(self.me, fuelMap);
      self.typed = 0;
    }
    else{
      self.log("karb pilgrim");
      self.location  = getClosestRes(self.me, karboniteMap);
      self.typed = 1;
    }
}
  //mine or depot
  if(self.me.karbonite <= 18 && self.typed === 1 && square_distance (self.me, self.location) === 0){
    self.log("mining karbonite");
    return self.mine();
  }
  else if(self.me.fuel <= 90 && self.typed === 0 && square_distance(self.me, self.location) === 0){
    self.log("mining fuel");
    return self.mine();
  }
  else{
    if(self.me.karbonite === 20 || self.me.fuel === 100){
      self.log("resources full");
      //if castle is in the adjacent position, depot
      for(var i=0; i<visibleRobots.length; i++){
        if(square_distance(self.me, visibleRobots[i]) <= 2 && visibleRobots[i].team === self.me.team && visibleRobots[i].unit === 0){
          dx = visibleRobots[i].x - xcord;
          dy = visibleRobots[i].y - ycord;
	  self.log("pilgrim depoting resource");
          return self.give(dx, dy, self.me.karbonite, self.me.fuel);
        }
      }
    }
  }

  if(self.me.fuel <= 90 && self.typed === 0){
		self.log("test: moving to fuel");
    dx = self.location.x - xcord;
    dy = self.location.y - ycord;
		if (square_distance(self.me, self.location) > 4){
			var adjacent = onestep(buildvision,fullmap,xcord,ycord,location,self.me);
			dx = adjacent[0];
			dy = adjacent[1];
		}
  }
  else if(self.me.karbonite <= 18 && self.typed === 1){
		self.log("test: moving to karb");
    dx = self.location.x - xcord;
    dy = self.location.y - ycord;
		if (square_distance(self.me, self.location) > 4){
			var adjacent = onestep(buildvision,fullmap,xcord,ycord,location,self.me);
			dx = adjacent[0];
			dy = adjacent[1];
		}
  }
  else if (self.typed === 0 || self.typed ===1){
     for(var i=0; i<visibleRobots.length; i++){
       if(visibleRobots[i].team === self.me.team){
         if(visibleRobots[i].unit === 0){
	   // dx = visibleRobots[i].x - xcord;
	   // dy = visibleRobots[i].y - ycord;
		 			var adjacent = onestep(buildvision,fullmap,xcord,ycord,visibleRobots[i],self.me);
					dx = adjacent[0];
					dy = adjacent[1];
					var outward = adjacent[2]

					var x = self.me.x + 2;
					var y = self.me.y;
					if (outward > 2 && square_distance({x,y},visibleRobots[i]) == 1 || square_distance({x,y},visibleRobots[i]) == 2){
						if (buildvision[y][x] === 0 && fullmap[y][x] === true){
							dx = adjacent[0];
							dy = adjacent[1];
						}
					}
					x = self.me.x - 2;
					y = self.me.y;
					if (outward > 2 && square_distance({x,y},visibleRobots[i]) == 1 || square_distance({x,y},visibleRobots[i]) == 2){
						if (buildvision[y][x] === 0 && fullmap[y][x] === true){
							dx = adjacent[0];
							dy = adjacent[1];
						}
					}
					x = self.me.x;
					y = self.me.y + 2;
					if (outward > 2 && square_distance({x,y},visibleRobots[i]) == 1 || square_distance({x,y},visibleRobots[i]) == 2){
						if (buildvision[y][x] === 0 && fullmap[y][x] === true){
							dx = adjacent[0];
							dy = adjacent[1];
						}
					}
					x = self.me.x;
					y = self.me.y - 2;
					if (outward > 2 && square_distance({x,y},visibleRobots[i]) == 1 || square_distance({x,y},visibleRobots[i]) == 2){
						if (buildvision[y][x] === 0 && fullmap[y][x] === true){
							dx = adjacent[0];
							dy = adjacent[1];
						}
					}

					self.log("test: moving back to castle");
         }
       }
     }
  }
  self.log("pilgrim moving");
  return self.move(dx, dy);


}

export default pilgrim;
