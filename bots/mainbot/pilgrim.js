import {BCAbstractRobot, SPECS} from 'battlecode';

const pilgrim = {};

//helper function to get the suqare distance from the current location to the destination
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


pilgrim.makemove = (self) => {
  //add pilgrim logic
  self.log("pilgrim turn");
  
  const karboniteMap = self.getKarboniteMap();
  const fuelMap = self.getFuelMap();
  const fullMap = self.getPassableMap();
  const visibleRobots = self.getVisibleRobots();

  var xcord = self.me.x;
  var ycord = self.me.x;
  
  //mining
  var karbonite_loc = getClosestRes(self.me, karboniteMap);
  var fuel_loc = getClosestRes(self.me, fuelMap);
  var karbonite_dis = square_distance(self.me, karbonite_loc);
  var fuel_dis = square_distance(self.me, fuel_loc);
  var fuel_consume1 = karbonite_dis + 1;
  var fuel_consume2 = fuel_dis + 1;
  if(self.me.karbonite <= 18 && self.me.fule <= 90) {
    if(karbonite_dis <= fuel_dis && fuel_consume1 < 50) {
      dx = karbonite_loc.x - xcord;
      dy = karbonite_loc.y - ycord;
      self.move(dx, dy);
      return self.mine();
    }
    else if(karbonite_dis > fuel_dis && fuel_consume2 < 50) {
      dx = fuel_loc.x - xcord;
      dy = fuel_loc.y - ycord;
      self.move(dx, dy);
      self.log("mining");
      return self.mine();
    }
    else{
      self.log("unable to mine");
    }
  }
  
  //depot
  for(var i=0; i<visibleRobots.length; i++) {
    if(visibleRobots[i].team === self.me.team && square_distance(self.me, visibleRobots[i]) <= 2) {
      return self.give(visibleRobots[i].x-self.me.x, visibleRobots[i].y-self.me.y, self.me.karbonite, self.me.fuel);
    }
  }    
 
};
export default pilgrim;
