import {BCAbstractRobot, SPECS} from 'battlecode';

const crusader = {};

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




crusader.makemove = (self) => {
				self.log("Crusader: " + self.id + " Beggining turn");
        //self.castleTalk(99);
				var rushbot = true;
				var inPosition; // Set to true when prophet gets to desired location
				if(inPosition == undefined) // Initialize the variable
								inPosition = false;
				var desiredPosition;               // Tile prophet wants to get to.
				var visibleUnits = self.getVisibleRobots(); // Units that can be seen by the prophet
				var visibleTiles = self.getVisibleRobotMap();
        var kmap = self.getKarboniteMap();
        var fmap = self.getFuelMap();
				const moves = //Place where a robot can position itself in refrence to the focal point
								[[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [2, 0], [-2, 0], [0, 2], [0, -2]];

        const fullmap = self.getPassableMap();

if (rushbot){
	self.log("INSIDE rush");
	const totalmove = //total possible moves
					[[0,0],[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [2, 0], [-2, 0], [0, 2], [0, -2], [3,0], [-3,0], [0,3], [0,-3], [2,2], [-2,-2], [-2,2], [2,-2], [2,1], [-2,1], [-2,-1], [2,-1], [1,2], [-1,2], [-1,-2], [1,-2]];

	if(!self.moves_made){
		self.log("STARTING LOG");
		self.moves_made = [[self.me.x,self.me.y]];
	}

	//self.log(self.moves_made[0][0]);

	if (!self.destination && !self.reflect){
		var temp;
		for (var i=0; i<visibleUnits.length; i++) {
	    if (visibleUnits[i].team === self.me.team && visibleUnits[i].unit === 0){
	      temp = visibleUnits[i];
	    }
	  }
		const hor = is_horizontal(fullmap);
		var enemy_x;
		var enemy_y;
		self.log(hor);
		if (hor){
			enemy_x = temp.x;
			enemy_y = fullmap.length - temp.y - 1;
      self.reflect = 1;
		}
		else{
			enemy_x = fullmap.length - temp.x - 1;
			enemy_y = temp.y
      self.reflect = 0;
		}
		self.destination = {enemy_x,enemy_y};
	}
	self.log("GOING TO ATTACK " + self.destination.enemy_x + " " + self.destination.enemy_y);

	// var enemies = visibleUnits.filter((robot) => {
	// 		if(robot.team !== self.me.team){
	// 		return true;
	// 		}
	// 		});
	// if(enemies.length > 0){ // Attacking
	// 	self.log("Crusader: " + self.id + "  Found an enemy");
	// 	var enemyToAttack; // Will contain id of robot to attack
	// 	var distance;      // Used to store how far away an enemy is.
	// 	for(var i = 0; i < 10; i++){
	// 		distance = (enemies[i].x-self.me.x)**2 + (enemies[i].y-self.me.y)**2;
	// 		if(distance >= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[0] && distance <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]){
	// 			if(enemyToAttack == undefined){
	// 				self.log("Phrophet: " + self.id + "  Attacking");
	// 				enemyToAttack = enemies[i];
	// 				var dx = enemyToAttack.x - self.me.x;
	// 				var dy = enemyToAttack.y - self.me.y;
	// 				return self.attack(dx, dy);
	// 			}
	// 		}
	// 	}
	// }

	for (var i=0; i<visibleUnits.length; i++) {
    if (visibleUnits[i].team !== self.me.team){
      const range = (visibleUnits[i].x-self.me.x)**2 + (visibleUnits[i].y-self.me.y)**2;
      if (range <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]){
        self.log('Crusader attack ' + visibleUnits[i] + ' at ' + (visibleUnits[i].x - self.me.x, visibleUnits[i].y - self.me.y));
        return self.attack(visibleUnits[i].x - self.me.x, visibleUnits[i].y - self.me.y);
      }
    }
  }

  if (self.me.x === self.destination.enemy_x && self.me.y === self.destination.enemy_y){
    if(self.reflect === 1){
      self.castleTalk(self.me.x);
    }
    else{
      self.castleTalk(self.me.y);
    }
  }


	var enemies = visibleUnits.filter((robot) => {
			if(robot.team === self.me.team && robot.x === self.destination.enemy_x && robot.y === self.destination.enemy_y){
			return self.move(0,0);
			}
			});

	var least = 50000;
	var counter = 0;
	var flag = 0;



	for (var i = 0; i < totalmove.length; i++){
		if (self.me.x + totalmove[i][0] <= fullmap.length && self.me.x + totalmove[i][0] >= 0 && self.me.y + totalmove[i][1] <= fullmap.length && self.me.y + totalmove[i][1] >= 0){
			for (var z=0; z<self.moves_made.length; z++) {
				if (self.me.x + totalmove[i][0] === self.moves_made[z][0] && self.me.y + totalmove[i][1] === self.moves_made[z][1]){
					flag = 1;
				}
			}
			if (flag === 0){
				//self.log("inside moves made loop");
				if (fullmap[self.me.y + totalmove[i][1]][self.me.x + totalmove[i][0]] === true && visibleTiles[self.me.y + totalmove[i][1]][self.me.x + totalmove[i][0]] === 0){
					//self.log("inside map check");
					var sq_dis = Math.pow((self.me.x + totalmove[i][0]) - self.destination.enemy_x, 2) + Math.pow((self.me.y + totalmove[i][1]) - self.destination.enemy_y, 2);
					//self.log(sq_dis);
					if (least > sq_dis){
						least = sq_dis;
						counter = i;
					}
				}
			}
		}
		flag = 0;
	}
	//self.log("no PROBLEM IN LOOP");
	//self.log(least);
	if (least === 50000){
		self.log("NEED TO BACKTRACK DFKLSDFKLSDMFKLSDMFLKDSMFLKSMDFKLSDMKLFMDSKL:FMSDKLFMKLSD:FMLKDSMFL:KSDMF:LDSMFKLDMFLKDSMFLKSDMFLKSDMFKLSDMFKLDSMFKLDSMFLKSDMFLKDSMFKLMDSLKFMDSLKMFLK");
		var backtrack;
		for (var i = 0; i < self.moves_made.length; i++){
			if (self.moves_made[i][0] === self.me.x && self.moves_made[i][1] === self.me.y){
				backtrack = i - 1;
				if (backtrack === -1){
					backtrack = 0;
				}
			}
		}
		return self.move(self.me.x - self.moves_made[backtrack][0], self.me.y - self.moves_made[backtrack][1]);
	}
	self.moves_made.push([self.me.x + totalmove[counter][0],self.me.y + totalmove[counter][1]]);
	//self.log(self.moves_made);
	return self.move(totalmove[counter][0],totalmove[counter][1]);



}
else{
//*** Check if enemies are within range
	// var enemies = visibleUnits.filter((robot) => {
	// 		if(robot.team !== self.me.team){
	// 		return true;
	// 		}
	// 		});
	// if(enemies.length > 0){ // Attacking
	// 	self.log("Crusader: " + self.id + "  Found an enemy");
	// 	var enemyToAttack; // Will contain id of robot to attack
	// 	var distance;      // Used to store how far away an enemy is.
	// 	for(var i = 0; i < 10; i++){
	// 		distance = (enemies[i].x-self.me.x)**2 + (enemies[i].y-self.me.y)**2;
	// 		if(distance >= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[0] && distance <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]){
	// 			if(enemyToAttack == undefined){
	// 				self.log("Phrophet: " + self.id + "  Attacking");
	// 				enemyToAttack = enemies[i];
	// 				var dx = enemyToAttack.x - self.me.x;
	// 				var dy = enemyToAttack.y - self.me.y;
	// 				return self.attack(dx, dy);
	// 			}
	// 		}
	// 	}
	// }

	for (var i=0; i<visibleUnits.length; i++) {
    if (visibleUnits[i].team !== self.me.team){
      const range = (visibleUnits[i].x-self.me.x)**2 + (visibleUnits[i].y-self.me.y)**2;
      if (range <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]){
        self.log('Crusader attack ' + visibleUnits[i] + ' at ' + (visibleUnits[i].x - self.me.x, visibleUnits[i].y - self.me.y));
        return self.attack(visibleUnits[i].x - self.me.x, visibleUnits[i].y - self.me.y);
      }
    }
  }

	if (!self.castle_loc){
		for (var i=0; i<visibleUnits.length; i++) {
			if (visibleUnits[i].team === self.me.team && visibleUnits[i].unit === 0){
				self.castle_loc = visibleUnits[i];
			}
		}
	}



        if(inPosition == true) // Don't move if in position
					return self.move(0, 0);

				var latticeSum = (self.me.x+self.me.y)
        latticeSum = latticeSum%2;
        if( latticeSum == 0){ // if (x+y)mod2 = 0, unit is on a lattice point.
          var goodLatticePoint = true;

          if(kmap[self.me.y][self.me.x] == true) // Check to see if the unit is standing on karb
						goodLatticePoint = false;

          if(fmap[self.me.y][self.me.x] == true) // Check to see if the unit is standing on fuel
						goodLatticePoint = false;

					//check to see if unit is next to a castle
					var sq_dis = Math.pow(self.me.x - self.castle_loc.x, 2) + Math.pow(self.me.y - self.castle_loc.y, 2);
					if(sq_dis < 3)
						goodLatticePoint = false;

					if(goodLatticePoint == true){
						inPosition = true;
						//return self.move(0,0);
					}

        }

				if(inPosition != true){

				self.log("finding new position");
					var move;
					var validmove = false;
          var newx;
					var newy;
          while(validmove == false){
						move = moves[Math.floor(Math.random()*moves.length)];
						newx = self.me.x + move[0];
						newy = self.me.y + move[1];
						validmove = true;
						if(visibleTiles[newy][newx] != 0)
							validmove = false;
						if(self.map[newy][newx] != true)
              validmove = false;
					}
          self.log("Moving to " + newx + " " + newy);
          return self.move(move[0],move[1]);
				}

  }
};

export default crusader;
