import {BCAbstractRobot, SPECS} from 'battlecode';
// -----------
// | |x| |x| |
// -----------
// |x| |o| |x|
// -----------
// | |x| |x| |
// -----------

// Attack Range 16-64
//code for prophet logic (Includes setting up lattice)
const prophet = {};

prophet.makemove = (self) => {
	self.log("Prophet: " + self.id + " Beggining turn");
	//self.castleTalk(88);
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

	//check to see if any enemy is nearby. If in attack range attack first target.
	for (var i=0; i<visibleUnits.length; i++) {
    if (visibleUnits[i].team !== self.me.team){
      const range = (visibleUnits[i].x-self.me.x)**2 + (visibleUnits[i].y-self.me.y)**2;
      if (range >= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[0] && range <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]){
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
};

export default prophet;
