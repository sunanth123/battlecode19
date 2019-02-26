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


function buildOnEmptyOther(buildvision,fullmap,xcord,ycord,edge)
{
     var returnedArray = [];
     var flag = 0;

     if(xcord-1 <= edge && xcord-1 >= 0 && ycord-1 <= edge && ycord-1 >= 0 && buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === true){
       ycord = - 1;
       xcord = - 1;
     }
     else if(xcord <= edge && xcord >= 0 && ycord-1 <= edge && ycord-1 >= 0 && buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === true){
       xcord = 0;
       ycord = - 1;
     }
     else if(xcord+1 <= edge && xcord+1 >= 0 && ycord-1 <= edge && ycord-1 >= 0 && buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === true){
       xcord = 1;
       ycord = - 1;
     }
     else if(xcord-1 <= edge && xcord-1 >= 0 && ycord <= edge && ycord >= 0 && buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === true){
       xcord = - 1;
       ycord = 0;
     }
     else if(xcord+1 <= edge && xcord+1 >= 0 && ycord <= edge && ycord >= 0 && buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === true){
       xcord = 1;
       ycord = 0;
     }
     else if(xcord-1 <= edge && xcord-1 >= 0 && ycord+1 <= edge && ycord+1 >= 0 && buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === true){
       xcord = - 1;
       ycord = 1;
     }
     else if(xcord <= edge && xcord >= 0 && ycord+1 <= edge && ycord+1 >= 0 && buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === true){
       xcord = 0
       ycord = 1;
     }
     else if(xcord+1 <= edge && xcord+1 >= 0 && ycord+1 <= edge && ycord+1 >= 0 && buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === true){
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
function buildOnEmpty(buildvision,fullmap,xcord,ycord,resource,myself,edge)
{
     var returnedArray = [];
     var flag = 0;
     var resdist = 1000;
     var inside = 0;
     var dx;
     var dy;
     var x = myself.x - 1;
     var y = myself.y - 1;

     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dy = - 1;
       dx = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x;
     y = myself.y - 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === true && square_distance({x,y}, resource) < resdist){
       dx = 0;
       dy = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y - 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === true && square_distance({x,y}, resource) < resdist){
       dx = 1;
       dy = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dx = - 1;
       dy = 0;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === true && square_distance({x,y}, resource) < resdist){
       dx = 1;
       dy = 0;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y + 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dx = - 1;
       dy = 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x;
     y = myself.y + 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === true && square_distance({x,y}, resource) < resdist){
       dx = 0
       dy = 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y + 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === true && square_distance({x,y}, resource) < resdist){
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


function is_horizontal(fullmap) {
    const length = fullmap.length
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
    return check
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


	const hor = is_horizontal(fullmap);
	var enemy_x;
	var enemy_y;
	self.log(hor);
	if (hor){
		enemy_x = self.me.x;
		enemy_y = fullmap.length - self.me.y - 1;
	}
	else{
		enemy_x = fullmap.length - self.me.x - 1;
		enemy_y = self.me.y
	}
	self.log("enemy castle at: " + enemy_x + " " + enemy_y);


//castle talk logic to store location of all friendly castles and their coordinants
			//self.log("MESSAGESEND " + robot.id + " " + robot.castle_talk)
			var flag = 0;
			var count = 0;
			if(!self.friendlycastle){
				self.friendlycastle = [];
				for (let i = 0; i < visiblerobots.length;i++){
					count += 1;
					if (visiblerobots[i].castle_talk !== 0){
						flag = 1;
					}
				}
				//self.log("COUNT IS :" + count);
				if (count === 4){
					flag = 0;
				}
				if (flag === 0){
					for (let x = 0; x < visiblerobots.length;x++){
						self.friendlycastle.push([visiblerobots[x].id,visiblerobots[x].castle_talk,0]);
					}
				}
				else{
					for (let z = 0; z < visiblerobots.length;z++){
						if (visiblerobots[z].castle_talk !== 0){
							self.friendlycastle.push([visiblerobots[z].id,visiblerobots[z].castle_talk,0]);
						}
					}
					self.friendlycastle.push([self.me.id,0,0]);
				}
			}
			else if (self.me.turn < 4){
				for (let i = 0; i < self.friendlycastle.length; i++){
					for (let x = 0; x < visiblerobots.length;x++){
						if (visiblerobots[x].id === self.friendlycastle[i][0] && self.friendlycastle[i][1] === 0){
							self.friendlycastle[i][1] = visiblerobots[x].castle_talk;
						}
						else if (visiblerobots[x].id === self.friendlycastle[i][0] && self.friendlycastle[i][2] === 0){
							self.friendlycastle[i][2] = visiblerobots[x].castle_talk;
						}
					}
				}
			}

	self.log("NUMBER OF CASTLES " + self.friendlycastle.length);
	self.log(self.friendlycastle);
	self.log("TURN COUNT IS: " + self.me.turn);

	if (self.me.turn === 1){
		self.castleTalk(self.me.x);
	}
	if (self.me.turn === 2){
		self.castleTalk(self.me.y);
	}
	if (self.me.turn === 3 && self.friendlycastle.length > 3){
		for (let i = 0; i < self.friendlycastle.length; i++){
			if (self.friendlycastle[i][1] === 0 && self.friendlycastle[i][2] === 0){
				self.friendlycastle.splice(i,1);
			}
		}
	}

	if(self.me.turn > 5 && !self.stop){
		const messagingRobots = visiblerobots.filter(robot => {
				return robot.castle_talk;
		});

		for(let i = 0; i < messagingRobots.length; i++){
			if (hor === true && messagingRobots[i].castle_talk === self.me.x){
				self.stop = true;
			}
			else if (messagingRobots[i].castle_talk === self.me.y){
				self.stop = true;
			}
		}
	}


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

		// if (xcord === edge || xcord === 0 || ycord === edge || ycord === 0)
		// {
		// 			self.log("FKASFLKJASFJLKASJFLKAJSKFJKASFJLKASJFLK");
		// 			var adjacentInfo = buildOnEmptyOther(buildvision,fullmap,xcord,ycord);
		// 	    if (adjacentInfo[2] === 1){
		// 	      self.log("unable to build pilgrim");
		// 	    }
		// 	    else{
		// 	      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
		// 	      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
		// 			}
		// }

    var adjacentInfo = buildOnEmpty(buildvision,fullmap,xcord,ycord,resource,self.me,edge);
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
		var edge = fullmap.length - 1;
    //const fuelMap = self.getFuelMap();
    self.log(xcord + " " + ycord);
    var resource = getClosestRes(self.me, fuelMap);

    var adjacentInfo = buildOnEmpty(buildvision,fullmap,xcord,ycord,resource, self.me, edge);
    if (adjacentInfo[2] === 1){
      self.log("unable to build pilgrim");
    }
    else{
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
    }
  }



	if(visiblerobots.filter(robot => robot.team === self.me.team && robot.unit === 2 && square_distance(self.me, robot) < 25).length === 0){
		var xcord = self.me.x;
    var ycord = self.me.y;
		var edge = fullmap.length - 1;
    self.log(xcord + " " + ycord);
    var resource = getClosestRes(self.me, karboniteMap);

    var adjacentInfo = buildOnEmpty(buildvision,fullmap,xcord,ycord,resource, self.me, edge);
    if (adjacentInfo[2] === 1){
      self.log("unable to build pilgrim");
    }
    else{
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
    }
	}
	else if(visiblerobots.filter(robot => robot.team === self.me.team && robot.unit === 2 && square_distance(self.me, robot) < 25).length === 1){
		var xcord = self.me.x;
    var ycord = self.me.y;
		var edge = fullmap.length - 1;
    self.log(xcord + " " + ycord);
    var resource = getClosestRes(self.me, fuelMap);

    var adjacentInfo = buildOnEmpty(buildvision,fullmap,xcord,ycord,resource, self.me, edge);
    if (adjacentInfo[2] === 1){
      self.log("unable to build pilgrim");
    }
    else{
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
    }
	}



	if(!self.outwardlocal){
		self.outwardlocal = 0;
	}

	const totalmove = //total possible moves
					[[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [2, 0], [-2, 0], [0, 2], [0, -2], [3,0], [-3,0], [0,3], [0,-3], [2,2], [-2,-2], [-2,2], [2,-2], [2,1], [-2,1], [-2,-1], [2,-1], [1,2], [-1,2], [-1,-2], [1,-2]];


	for (let i = 0; i < totalmove.length; i++){
		if (fuelMap[self.me.y + totalmove[i][1]][self.me.x + totalmove[i][0]] === true)
		{
			self.outwardlocal += 1;
		}
		if (karboniteMap[self.me.y + totalmove[i][1]][self.me.x + totalmove[i][0]] === true)
		{
			self.outwardlocal += 1;
		}
	}
	self.log("OUTWARD LOCAL: " + self.outwardlocal);
	if (self.me.turn % 10 === 0 && visiblerobots.filter(robot => robot.team === self.me.team && robot.unit === 2 && square_distance(self.me, robot) < 25).length < self.outwardlocal){
		var xcord = self.me.x;
    var ycord = self.me.y;
		var edge = fullmap.length - 1;
    self.log(xcord + " " + ycord);
    var resource = getClosestRes(self.me, fuelMap);

    var adjacentInfo = buildOnEmpty(buildvision,fullmap,xcord,ycord,resource, self.me, edge);
    if (adjacentInfo[2] === 1){
      self.log("unable to build pilgrim");
    }
    else{
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
    }
	}

	self.outwardlocal = 0;




  //if karbonite is greater than or equal to 60 start making prophets
  if (self.karbonite >= 60 && self.stop != true){
    var xcord = self.me.x;
    var ycord = self.me.y;
		var edge = fullmap.length - 1;
    var adjacentInfo = buildOnEmptyOther(buildvision,fullmap,xcord,ycord,edge);
    if (adjacentInfo[2] === 1){
      self.log("unable to build");
    }
    // else if (self.me.turn < 500){
    //   self.log("Building a prophet at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
    //   return self.buildUnit(SPECS.PROPHET, adjacentInfo[0], adjacentInfo[1]);
    // }
		else{
			self.log("Building a crusader at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]))
      return self.buildUnit(SPECS.CRUSADER, adjacentInfo[0], adjacentInfo[1]);
		}
  }


};

export default castle;
