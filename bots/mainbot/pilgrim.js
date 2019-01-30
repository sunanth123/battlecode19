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


pilgrim.makemove = (self) => {
  //add pilgrim logic
  self.log("pilgrim turn");
  
  const karboniteMap = self.getKarboniteMap();
  const fuelMap = self.getFuelMap();
  const visibleRobots = self.getVisibleRobots();

  var xcord = self.me.x;
  var ycord = self.me.x;
 
  var resource_loc = self.me;

  //the flag to check the resource category
  //var flag = 0; 

  //check if there's another pilgrim nearby
  for(var i=0; i<visibleRobots.length; i++){
    if(visibleRobots[i].team === self.me.team && visibleRobots[i].unit == 2 && square_distance(self.me, visibleRobots[i]) > 1){
      resource_loc = getClosestRes(self.me, fuelMap);
    }
    else{
//      flag = 1
      resource_loc  = getClosestRes(self.me, karboniteMap);
    }
  }
  
  //mine or depot
  if(self.me.karbonite < 20 || self.me.fuel < 100) {
    if(square_distance(self.me, resource_loc) === 0){
      self.log("mining");
      return self.mine();
    }
    else{
      dx = resource_loc.x - xcord;
      dy = resource_loc.y - ycord;
      self.log("pilgrim moving");
      return self.move(dx, dy);
    }
  }
  else{
    //if castle is in the adjacent position, depot   
    for(var i=0; i<visibleRobots.length; i++){
      if(square_distance(self.me, visibleRobots[i]) <= 2 && visibleRobots[i].team === self.me.team && visibleRobots[i].unit === 0){
        dx = visibleRobots[i].x - self.me.x;
        dy = visibleRobots[i].y -self.me.x;
	self.log("pilgrim depoting resource");
        return self.give(dx, dy, self.me.karbonite, self.me.fuel);
      }
    }
  }	  

  //otherwise, just move to castles
  for(var i=0; i<visibleRobots.length; i++){
    if(visibleRobots[i].team = self.me.team){
      if(visibleRobots[i].unit = 0){
	dx = visibleRobots[i].x - self.me.x;
	dy = visibleRobots[i].y - self.me.y;
	self.log("pilgrim moving");
	return self.move(dx,dy);
      }
    } 
  }
  

}
 
export default pilgrim;
