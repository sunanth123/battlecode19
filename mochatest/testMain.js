
function square_distance(start, dest)
{
  var sq_dis = Math.pow(start[0] - dest[0], 2) + Math.pow(start[1] - dest[1], 2);
  return sq_dis;
}

function getClosestRes(current_loc, resource_map)
{
	const map_length = resource_map.length;
	var closest_location = null;
	var closest_dist = 1000;

	for (let x = 0; x < map_length; x++){
          if (resource_map[x] && square_distance(resource_map[x], current_loc) < closest_dist){
	    closest_dist = square_distance(resource_map[x], current_loc);
	    closest_location = resource_map[x];
          }
	}
	return closest_location;
}

function buildOnEmptyOther(buildvision,fullmap,xcord,ycord)
{
     var returnedArray = [];
     var flag = 0;

     if(buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === 0){
       ycord = - 1;
       xcord = - 1;
     }
     else if(buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === 0){
       xcord = 0;
       ycord = - 1;
     }
     else if(buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === 0){
       xcord = 1;
       ycord = - 1;
     }
     else if(buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === 0){
       xcord = - 1;
       ycord = 0;
     }
     else if(buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === 0){
       xcord = 1;
       ycord = 0;
     }
     else if(buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === 0){
       xcord = - 1;
       ycord = 1;
     }
     else if(buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === 0){
       xcord = 0
       ycord = 1;
     }
     else if(buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === 0){
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

function is_horizontal(fullmap) {
    const length = fullmap.length;
    var check = true;
    for (let y = 0; check && length > y; y++) {
        for (let x = 0; check && length > x; x++) {
	  if (fullmap[y][x] === fullmap[length - y -1][x]){
	     check = true;
	  }
	  else{
	    check = false;
	  }
        }
    }
    return check;
}

function getreslist(current_loc, resource_map){
	const map_length = resource_map.length;
	var closest_location = [];
	var closest_dist = 1000;
        for (let x = 0; x < map_length; x++){
		if (resource_map[x] && square_distance(resource_map[x], current_loc) < 25){
			closest_location.push(resource_map[x]);
		}
	}
	
	return closest_location;
}

function onestep(buildvision,fullmap,xcord,ycord,resource,myself,edge)
{
     var returnedArray = [];
     var flag = 0;
     var resdist = 1000;
     var inside = 0;
     var dx;
     var dy;
     var x = myself[0] - 1;
     var y = myself[1]- 1;

     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === 0 && square_distance([x,y], resource) < resdist){
       dy = - 1;
       dx = - 1;
       inside += 1;
       resdist = square_distance([x,y], resource);
     }
     x = myself[0];
     y = myself[1] - 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === 0 && square_distance([x,y], resource) < resdist){
       dx = 0;
       dy = - 1;
       inside += 1;
       resdist = square_distance([x,y], resource);
     }
     x = myself[0] + 1;
     y = myself[1] - 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === 0 && square_distance([x,y], resource) < resdist){
       dx = 1;
       dy = - 1;
       inside += 1;
       resdist = square_distance([x,y], resource);
     }
     x = myself[0] - 1;
     y = myself[1];
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === 0 && square_distance([x,y], resource) < resdist){
       dx = - 1;
       dy = 0;
       inside += 1;
       resdist = square_distance([x,y], resource);
     }
     x = myself[0] + 1;
     y = myself[1];
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === 0 && square_distance([x,y], resource) < resdist){
       dx = 1;
       dy = 0;
       inside += 1;
       resdist = square_distance([x,y], resource);
     }
     x = myself[0] - 1;
     y = myself[1] + 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === 0 && square_distance([x,y], resource) < resdist){
       dx = - 1;
       dy = 1;
       inside += 1;
       resdist = square_distance([x,y], resource);
     }
     x = myself[0];
     y = myself[1] + 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === 0 && square_distance([x,y], resource) < resdist){
       dx = 0
       dy = 1;
       inside += 1;
       resdist = square_distance([x,y], resource);
     }
     x = myself[0] + 1;
     y = myself[1] + 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === 0 && square_distance([x,y], resource) < resdist){
       dx = 1;
       dy = 1;
       inside += 1;
       resdist = square_distance([x,y], resource);
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

module.exports = {
  square_distance: square_distance,
  getClosestRes: getClosestRes,
  buildOnEmptyOther: buildOnEmptyOther,
  is_horizontal: is_horizontal,
  getreslist: getreslist,
  onestep: onestep
}
