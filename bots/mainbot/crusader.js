import {BCAbstractRobot, SPECS} from 'battlecode';

const crusader = {};

crusader.makemove = (self) => {
				self.log("Crusader: " + self.id + " Beggining turn");
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

        


//*** Check if enemies are within range
	var enemies = visibleUnits.filter((robot) => {
			if(robot.team !== self.me.team){
			return true;
			}
			});
	if(enemies.length > 0){ // Attacking
		self.log("Crusader: " + self.id + "  Found an enemy");
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

export default crusader;
