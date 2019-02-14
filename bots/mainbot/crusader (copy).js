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
				var focalPoint; // What will be used as a reference for areas to check
				const latticePoint = //Place where a robot can position itself in refrence to the focal point
								[[0,-2], [1, -1], [2, 0], [1, 1], [0, 2], [-1, 1], [-2, 0], [-1, -1]];

        if(inPosition == true) // Don't move if in position
          return self.move(0, 0);

				if(focalPoint == undefined){ // Get focal point for a newly spawned unit
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
				
				visibleTiles = self.getVisibleRobotMap();
				for(var i = 0; i < latticePoint.length; i++){
								var scoutTile = visibleTiles[focalPoint[1]+latticePoint[i][1]][focalPoint[0]+latticePoint[i][0]];
                if(scoutTile == self.me.id){
									inPosition = true;
                  return self.move(0, 0);
								}
                if(false == self.map[focalPoint[1]+latticePoint[i][1]][focalPoint[0]+latticePoint[i][0]])
                  scoutTile = -1;
								if(scoutTile == 0){
												var dx = focalPoint[0]+latticePoint[i][0];
												var dy = focalPoint[1]+latticePoint[i][1];
												desiredPosition = [self.me.x-dx, self.me.y-dy];
												self.log(desiredPosition);
												return self.move(desiredPosition[0],desiredPosition[1]);
								}
				}
        // If unit didn't move, no lattice point availible.
        // Unit should find a new focal point and move towards it.
				focalPoint = focalPoint + latticePoint[Math.floor(math.random() * latticePoint.length)];
        //if(self.me.x = focal
        
};

export default crusader;
