import {BCAbstractRobot, SPECS} from 'battlecode';
// -----------
// | |x| |x| |
// -----------
// |x| |o| |x|
// -----------
// | |x| |x| |
// -----------

// Attack Range 16-64
const prophet = {};

prophet.makemove = (self) => {
	self.log("Phrophet: " + self.id + " Beggining turn");
	var inPosition; // Set to true when prophet gets to desired location
  if(inPosition == undefined) // Initialize the variable
		inPosition = false;
	var desiredPosition;               // Tile prophet wants to get to.
	var visibleUnits = self.getVisibleRobots(); // Units that can be seen by the prophet
  var visibleTiles = self.getVisibleRobotMap();
	var focalPoint; // What will be used as a reference for areas to check
	const latticePoint = //Place where a robot can position itself in refrence to the focal point
		[[0,-2], [1, -1], [2, 0], [1, 1], [0, 2], [-1, 1], [-2, 0], [-1, -1]];



	//*** Check if enemies are within range
	var enemies = visibleUnits.filter((robot) => {
			if(robot.team !== self.me.team){
			return true;
			}
			});
	if(enemies.length > 0){ // Attacking
		self.log("Phrophet: " + self.id + "  Found an enemy");
		var enemyToAttack; // Will contain id of robot to attack
		var distance;      // Used to store how far away an enemy is.
		for(var i = 0; i < 10; i++){
			distance = (enemies[i].x-self.me.x)**2 + (enemies[i].y-self.me.y)**2;
			if(distance >= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[0] && distance <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]){
				if(enemyToAttack == undefined){
					self.log("Phrophet: " + self.id + "  Attacking");
					enemyToAttack = enemies[i];
					var dx = enemyToAttack.x - self.me.x;
					var dy = enemyToAttack.y - self.me.y;
					return self.attack(dx, dy);
				}
			}
		}
	}
	else{ // Movement
		if(focalPoint == undefined){ // Set a new units focal point.
			var Castles = self.getVisibleRobots();
			Castles = Castles.filter((robot) => {
				if(robot.unit !== 0)
					return false;
			  else
					return true;
			});
			if(Castles.length > 0){ // Find the castle where you spawned from.
				focalPoint = [Castles[0].x, Castles[0].y]; // Castles Y position
			}
		}
    for(var i = 0; i < latticePoint.length; i++){
			var scoutTile = visibleTiles[focalPoint[0]+latticePoint[i][0]][focalPoint[1]+latticePoint[i][1]];
      if(scoutTile == 0){
			var dx = focalPoint[0]+latticePoint[i][0];
      var dy = focalPoint[1]+latticePoint[i][1];
        desiredPosition = [self.me.x-dx, self.me.y-dy];
        self.log(desiredPosition);
				return self.move(desiredPosition[0],desiredPosition[1]);
			}
    }
	}
};

export default prophet;
