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
  var ycord = self.me.y;
  var dx = 0;
  var dy = 0;
  var fuel_loc = self.me;
  var karbonite_loc = self.me;

  //the flag to check the resource category
  var flag = 0; 

  //check if there's another pilgrim nearby
  for(var i=0; i<visibleRobots.length; i++){
    if(visibleRobots[i].team === self.me.team && visibleRobots[i].unit == 2 && square_distance(self.me, visibleRobots[i]) > 1){
      fuel_loc = getClosestRes(self.me, fuelMap);
    }
    else{
      flag = 1
      karbonite_loc  = getClosestRes(self.me, karboniteMap);
    }
  }
  
  //mine or depot
  if(self.me.karbonite <= 18 && flag === 1 && square_distance (self.me, karbonite_loc) === 0){
    self.log("mining karbonite");
    return self.mine();
  }
  else if(self.me.fuel <= 90 && flag === 0 && square_distance(self.me, fuel_loc) === 0){
    self.log("mining fuel");
    return self.mine();
  }
  else{
    if(self.me.karbonite === 20 || self.me.fuel === 100){
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
  
  if(self.me.fuel <= 90 && flag === 0){
    dx = fuel_loc.x - xcord;
    dy = fuel_loc.y - ycord;
  }
  else if(self.me.karbonite <= 18 && flag === 1){
    dx = karbonite_loc.x - xcord;
    dy = karbonite_loc.y - ycord;
  }
  else{
     for(var i=0; i<visibleRobots.length; i++){
       if(visibleRobots[i].team = self.me.team){
         if(visibleRobots[i].unit = 0){
	   dx = visibleRobots[i].x - xcord;
	   dy = visibleRobots[i].y - ycord;
         }
       } 
     }
  }
  self.log("pilgrim moving");
  return self.move(dx, dy);
  
  
}
 
export default pilgrim;
