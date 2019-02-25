'use strict';

var SPECS = {"COMMUNICATION_BITS":16,"CASTLE_TALK_BITS":8,"MAX_ROUNDS":1000,"TRICKLE_FUEL":25,"INITIAL_KARBONITE":100,"INITIAL_FUEL":500,"MINE_FUEL_COST":1,"KARBONITE_YIELD":2,"FUEL_YIELD":10,"MAX_TRADE":1024,"MAX_BOARD_SIZE":64,"MAX_ID":4096,"CASTLE":0,"CHURCH":1,"PILGRIM":2,"CRUSADER":3,"PROPHET":4,"PREACHER":5,"RED":0,"BLUE":1,"CHESS_INITIAL":100,"CHESS_EXTRA":20,"TURN_MAX_TIME":200,"MAX_MEMORY":50000000,"UNITS":[{"CONSTRUCTION_KARBONITE":null,"CONSTRUCTION_FUEL":null,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":200,"VISION_RADIUS":100,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,64],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":50,"CONSTRUCTION_FUEL":200,"KARBONITE_CAPACITY":null,"FUEL_CAPACITY":null,"SPEED":0,"FUEL_PER_MOVE":null,"STARTING_HP":100,"VISION_RADIUS":100,"ATTACK_DAMAGE":0,"ATTACK_RADIUS":0,"ATTACK_FUEL_COST":0,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":10,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":1,"STARTING_HP":10,"VISION_RADIUS":100,"ATTACK_DAMAGE":null,"ATTACK_RADIUS":null,"ATTACK_FUEL_COST":null,"DAMAGE_SPREAD":null},{"CONSTRUCTION_KARBONITE":15,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":9,"FUEL_PER_MOVE":1,"STARTING_HP":40,"VISION_RADIUS":49,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":10,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":25,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":2,"STARTING_HP":20,"VISION_RADIUS":64,"ATTACK_DAMAGE":10,"ATTACK_RADIUS":[16,64],"ATTACK_FUEL_COST":25,"DAMAGE_SPREAD":0},{"CONSTRUCTION_KARBONITE":30,"CONSTRUCTION_FUEL":50,"KARBONITE_CAPACITY":20,"FUEL_CAPACITY":100,"SPEED":4,"FUEL_PER_MOVE":3,"STARTING_HP":60,"VISION_RADIUS":16,"ATTACK_DAMAGE":20,"ATTACK_RADIUS":[1,16],"ATTACK_FUEL_COST":15,"DAMAGE_SPREAD":3}]};

function insulate(content) {
    return JSON.parse(JSON.stringify(content));
}

class BCAbstractRobot {
    constructor() {
        this._bc_reset_state();
    }

    // Hook called by runtime, sets state and calls turn.
    _do_turn(game_state) {
        this._bc_game_state = game_state;
        this.id = game_state.id;
        this.karbonite = game_state.karbonite;
        this.fuel = game_state.fuel;
        this.last_offer = game_state.last_offer;

        this.me = this.getRobot(this.id);

        if (this.me.turn === 1) {
            this.map = game_state.map;
            this.karbonite_map = game_state.karbonite_map;
            this.fuel_map = game_state.fuel_map;
        }

        try {
            var t = this.turn();
        } catch (e) {
            t = this._bc_error_action(e);
        }

        if (!t) t = this._bc_null_action();

        t.signal = this._bc_signal;
        t.signal_radius = this._bc_signal_radius;
        t.logs = this._bc_logs;
        t.castle_talk = this._bc_castle_talk;

        this._bc_reset_state();

        return t;
    }

    _bc_reset_state() {
        // Internal robot state representation
        this._bc_logs = [];
        this._bc_signal = 0;
        this._bc_signal_radius = 0;
        this._bc_game_state = null;
        this._bc_castle_talk = 0;
        this.me = null;
        this.id = null;
        this.fuel = null;
        this.karbonite = null;
        this.last_offer = null;
    }

    // Action template
    _bc_null_action() {
        return {
            'signal': this._bc_signal,
            'signal_radius': this._bc_signal_radius,
            'logs': this._bc_logs,
            'castle_talk': this._bc_castle_talk
        };
    }

    _bc_error_action(e) {
        var a = this._bc_null_action();
        
        if (e.stack) a.error = e.stack;
        else a.error = e.toString();

        return a;
    }

    _bc_action(action, properties) {
        var a = this._bc_null_action();
        if (properties) for (var key in properties) { a[key] = properties[key]; }
        a['action'] = action;
        return a;
    }

    _bc_check_on_map(x, y) {
        return x >= 0 && x < this._bc_game_state.shadow[0].length && y >= 0 && y < this._bc_game_state.shadow.length;
    }
    
    log(message) {
        this._bc_logs.push(JSON.stringify(message));
    }

    // Set signal value.
    signal(value, radius) {
        // Check if enough fuel to signal, and that valid value.
        
        var fuelNeeded = Math.ceil(Math.sqrt(radius));
        if (this.fuel < fuelNeeded) throw "Not enough fuel to signal given radius.";
        if (!Number.isInteger(value) || value < 0 || value >= Math.pow(2,SPECS.COMMUNICATION_BITS)) throw "Invalid signal, must be int within bit range.";
        if (radius > 2*Math.pow(SPECS.MAX_BOARD_SIZE-1,2)) throw "Signal radius is too big.";

        this._bc_signal = value;
        this._bc_signal_radius = radius;

        this.fuel -= fuelNeeded;
    }

    // Set castle talk value.
    castleTalk(value) {
        // Check if enough fuel to signal, and that valid value.

        if (!Number.isInteger(value) || value < 0 || value >= Math.pow(2,SPECS.CASTLE_TALK_BITS)) throw "Invalid castle talk, must be between 0 and 2^8.";

        this._bc_castle_talk = value;
    }

    proposeTrade(karbonite, fuel) {
        if (this.me.unit !== SPECS.CASTLE) throw "Only castles can trade.";
        if (!Number.isInteger(karbonite) || !Number.isInteger(fuel)) throw "Must propose integer valued trade."
        if (Math.abs(karbonite) >= SPECS.MAX_TRADE || Math.abs(fuel) >= SPECS.MAX_TRADE) throw "Cannot trade over " + SPECS.MAX_TRADE + " in a given turn.";

        return this._bc_action('trade', {
            trade_fuel: fuel,
            trade_karbonite: karbonite
        });
    }

    buildUnit(unit, dx, dy) {
        if (this.me.unit !== SPECS.PILGRIM && this.me.unit !== SPECS.CASTLE && this.me.unit !== SPECS.CHURCH) throw "This unit type cannot build.";
        if (this.me.unit === SPECS.PILGRIM && unit !== SPECS.CHURCH) throw "Pilgrims can only build churches.";
        if (this.me.unit !== SPECS.PILGRIM && unit === SPECS.CHURCH) throw "Only pilgrims can build churches.";
        
        if (!Number.isInteger(dx) || !Number.isInteger(dx) || dx < -1 || dy < -1 || dx > 1 || dy > 1) throw "Can only build in adjacent squares.";
        if (!this._bc_check_on_map(this.me.x+dx,this.me.y+dy)) throw "Can't build units off of map.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] > 0) throw "Cannot build on occupied tile.";
        if (!this.map[this.me.y+dy][this.me.x+dx]) throw "Cannot build onto impassable terrain.";
        if (this.karbonite < SPECS.UNITS[unit].CONSTRUCTION_KARBONITE || this.fuel < SPECS.UNITS[unit].CONSTRUCTION_FUEL) throw "Cannot afford to build specified unit.";

        return this._bc_action('build', {
            dx: dx, dy: dy,
            build_unit: unit
        });
    }

    move(dx, dy) {
        if (this.me.unit === SPECS.CASTLE || this.me.unit === SPECS.CHURCH) throw "Churches and Castles cannot move.";
        if (!this._bc_check_on_map(this.me.x+dx,this.me.y+dy)) throw "Can't move off of map.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] === -1) throw "Cannot move outside of vision range.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] !== 0) throw "Cannot move onto occupied tile.";
        if (!this.map[this.me.y+dy][this.me.x+dx]) throw "Cannot move onto impassable terrain.";

        var r = Math.pow(dx,2) + Math.pow(dy,2);  // Squared radius
        if (r > SPECS.UNITS[this.me.unit]['SPEED']) throw "Slow down, cowboy.  Tried to move faster than unit can.";
        if (this.fuel < r*SPECS.UNITS[this.me.unit]['FUEL_PER_MOVE']) throw "Not enough fuel to move at given speed.";

        return this._bc_action('move', {
            dx: dx, dy: dy
        });
    }

    mine() {
        if (this.me.unit !== SPECS.PILGRIM) throw "Only Pilgrims can mine.";
        if (this.fuel < SPECS.MINE_FUEL_COST) throw "Not enough fuel to mine.";
        
        if (this.karbonite_map[this.me.y][this.me.x]) {
            if (this.me.karbonite >= SPECS.UNITS[SPECS.PILGRIM].KARBONITE_CAPACITY) throw "Cannot mine, as at karbonite capacity.";
        } else if (this.fuel_map[this.me.y][this.me.x]) {
            if (this.me.fuel >= SPECS.UNITS[SPECS.PILGRIM].FUEL_CAPACITY) throw "Cannot mine, as at fuel capacity.";
        } else throw "Cannot mine square without fuel or karbonite.";

        return this._bc_action('mine');
    }

    give(dx, dy, karbonite, fuel) {
        if (dx > 1 || dx < -1 || dy > 1 || dy < -1 || (dx === 0 && dy === 0)) throw "Can only give to adjacent squares.";
        if (!this._bc_check_on_map(this.me.x+dx,this.me.y+dy)) throw "Can't give off of map.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] <= 0) throw "Cannot give to empty square.";
        if (karbonite < 0 || fuel < 0 || this.me.karbonite < karbonite || this.me.fuel < fuel) throw "Do not have specified amount to give.";

        return this._bc_action('give', {
            dx:dx, dy:dy,
            give_karbonite:karbonite,
            give_fuel:fuel
        });
    }

    attack(dx, dy) {
        if (this.me.unit === SPECS.CHURCH) throw "Churches cannot attack.";
        if (this.fuel < SPECS.UNITS[this.me.unit].ATTACK_FUEL_COST) throw "Not enough fuel to attack.";
        if (!this._bc_check_on_map(this.me.x+dx,this.me.y+dy)) throw "Can't attack off of map.";
        if (this._bc_game_state.shadow[this.me.y+dy][this.me.x+dx] === -1) throw "Cannot attack outside of vision range.";

        var r = Math.pow(dx,2) + Math.pow(dy,2);
        if (r > SPECS.UNITS[this.me.unit]['ATTACK_RADIUS'][1] || r < SPECS.UNITS[this.me.unit]['ATTACK_RADIUS'][0]) throw "Cannot attack outside of attack range.";

        return this._bc_action('attack', {
            dx:dx, dy:dy
        });
        
    }


    // Get robot of a given ID
    getRobot(id) {
        if (id <= 0) return null;
        for (var i=0; i<this._bc_game_state.visible.length; i++) {
            if (this._bc_game_state.visible[i].id === id) {
                return insulate(this._bc_game_state.visible[i]);
            }
        } return null;
    }

    // Check if a given robot is visible.
    isVisible(robot) {
        return ('unit' in robot);
    }

    // Check if a given robot is sending you radio.
    isRadioing(robot) {
        return robot.signal >= 0;
    }

    // Get map of visible robot IDs.
    getVisibleRobotMap() {
        return this._bc_game_state.shadow;
    }

    // Get boolean map of passable terrain.
    getPassableMap() {
        return this.map;
    }

    // Get boolean map of karbonite points.
    getKarboniteMap() {
        return this.karbonite_map;
    }

    // Get boolean map of impassable terrain.
    getFuelMap() {
        return this.fuel_map;
    }

    // Get a list of robots visible to you.
    getVisibleRobots() {
        return this._bc_game_state.visible;
    }

    turn() {
        return null;
    }
}

const castle = {};

function square_distance(start, dest)
{
	var sq_dis = Math.pow(start.x - dest.x, 2) + Math.pow(start.y - dest.y, 2);
	return sq_dis;
}
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
}

function buildOnEmptyOther(buildvision,fullmap,xcord,ycord)
{
     var returnedArray = [];
     var flag = 0;

     if(buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === true){
       ycord = - 1;
       xcord = - 1;
     }
     else if(buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === true){
       xcord = 0;
       ycord = - 1;
     }
     else if(buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === true){
       xcord = 1;
       ycord = - 1;
     }
     else if(buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === true){
       xcord = - 1;
       ycord = 0;
     }
     else if(buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === true){
       xcord = 1;
       ycord = 0;
     }
     else if(buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === true){
       xcord = - 1;
       ycord = 1;
     }
     else if(buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === true){
       xcord = 0;
       ycord = 1;
     }
     else if(buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === true){
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

     if(x < edge && x > 0 && y < edge && y > 0 && buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dy = - 1;
       dx = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x;
     y = myself.y - 1;
     if(x < edge && x > 0 && y < edge && y > 0 && buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === true && square_distance({x,y}, resource) < resdist){
       dx = 0;
       dy = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y - 1;
     if(x < edge && x > 0 && y < edge && y > 0 && buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === true && square_distance({x,y}, resource) < resdist){
       dx = 1;
       dy = - 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y;
     if(x < edge && x > 0 && y < edge && y > 0 && buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dx = - 1;
       dy = 0;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y;
     if(x < edge && x > 0 && y < edge && y > 0 && buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === true && square_distance({x,y}, resource) < resdist){
       dx = 1;
       dy = 0;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y + 1;
     if(x < edge && x > 0 && y < edge && y > 0 && buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === true && square_distance({x,y}, resource) < resdist){
       dx = - 1;
       dy = 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x;
     y = myself.y + 1;
     if(x < edge && x > 0 && y < edge && y > 0 && buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === true && square_distance({x,y}, resource) < resdist){
       dx = 0;
       dy = 1;
       inside += 1;
       resdist = square_distance({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y + 1;
     if(x < edge && x > 0 && y < edge && y > 0 && buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === true && square_distance({x,y}, resource) < resdist){
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
		enemy_y = self.me.y;
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
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
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
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
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
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
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
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
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
      self.log("Building a pilgrim at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
      return self.buildUnit(SPECS.PILGRIM, adjacentInfo[0], adjacentInfo[1]);
    }
	}

	self.outwardlocal = 0;




  //if karbonite is greater than or equal to 60 start making prophets
  if (self.karbonite >= 60){
    var xcord = self.me.x;
    var ycord = self.me.y;
    var adjacentInfo = buildOnEmptyOther(buildvision,fullmap,xcord,ycord);
    if (adjacentInfo[2] === 1){
      self.log("unable to build");
    }
    else if (self.me.turn < 500){
      self.log("Building a prophet at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
      return self.buildUnit(SPECS.PROPHET, adjacentInfo[0], adjacentInfo[1]);
    }
		else{
			self.log("Building a crusader at " + (xcord + adjacentInfo[0]) + ", " + (ycord + adjacentInfo[1]));
      return self.buildUnit(SPECS.CRUSADER, adjacentInfo[0], adjacentInfo[1]);
		}
  }


};

const church = {};

church.makemove = (self) => {
  //add church logic

};

const pilgrim = {};

//helper function to get the square distance from the current location to the destination
function square_distance$1(start, dest)
{
	var sq_dis = Math.pow(start.x - dest.x, 2) + Math.pow(start.y - dest.y, 2);
	return sq_dis;
}
//helper function to get the closest location of resource
function getClosestRes$1(current_loc, resource_map)
{
	const map_length = resource_map.length;
	var closest_location = null;
	var closest_dist = 1000;

	for (let y = 0; y < map_length; y++){
	  for (let x = 0; x < map_length; x++){
            if (resource_map[y][x] && square_distance$1({x,y}, current_loc) < closest_dist){
	      closest_dist = square_distance$1({x,y}, current_loc);
	      closest_location = {x, y};
            }
	  }
	}
	return closest_location;
}

function getreslist(current_loc, resource_map){
	const map_length = resource_map.length;
	var closest_location = [];

	for (let y = 0; y < map_length; y++){
		for (let x = 0; x < map_length; x++){
			if (resource_map[y][x] && square_distance$1({x,y}, current_loc) < 25){
				closest_location.push([x,y]);
			}
		}
	}
	return closest_location;
}

function onestep(buildvision,fullmap,xcord,ycord,resource,myself,edge)
{
     var returnedArray = [];
     var resdist = 1000;
     var inside = 0;
     var dx;
     var dy;
     var x = myself.x - 1;
     var y = myself.y - 1;

     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord-1][xcord-1] === 0 && fullmap[ycord-1][xcord-1] === true && square_distance$1({x,y}, resource) < resdist){
       dy = - 1;
       dx = - 1;
       inside += 1;
       resdist = square_distance$1({x,y}, resource);
     }
     x = myself.x;
     y = myself.y - 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord-1][xcord] === 0 && fullmap[ycord-1][xcord] === true && square_distance$1({x,y}, resource) < resdist){
       dx = 0;
       dy = - 1;
       inside += 1;
       resdist = square_distance$1({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y - 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord-1][xcord+1] === 0 && fullmap[ycord-1][xcord+1] === true && square_distance$1({x,y}, resource) < resdist){
       dx = 1;
       dy = - 1;
       inside += 1;
       resdist = square_distance$1({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord][xcord-1] === 0 && fullmap[ycord][xcord-1] === true && square_distance$1({x,y}, resource) < resdist){
       dx = - 1;
       dy = 0;
       inside += 1;
       resdist = square_distance$1({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord][xcord+1] === 0 && fullmap[ycord][xcord+1] === true && square_distance$1({x,y}, resource) < resdist){
       dx = 1;
       dy = 0;
       inside += 1;
       resdist = square_distance$1({x,y}, resource);
     }
     x = myself.x - 1;
     y = myself.y + 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord+1][xcord-1] === 0 && fullmap[ycord+1][xcord-1] === true && square_distance$1({x,y}, resource) < resdist){
       dx = - 1;
       dy = 1;
       inside += 1;
       resdist = square_distance$1({x,y}, resource);
     }
     x = myself.x;
     y = myself.y + 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord+1][xcord] === 0 && fullmap[ycord+1][xcord] === true && square_distance$1({x,y}, resource) < resdist){
       dx = 0;
       dy = 1;
       inside += 1;
       resdist = square_distance$1({x,y}, resource);
     }
     x = myself.x + 1;
     y = myself.y + 1;
     if(x <= edge && x >= 0 && y <= edge && y >= 0 && buildvision[ycord+1][xcord+1] === 0 && fullmap[ycord+1][xcord+1] === true && square_distance$1({x,y}, resource) < resdist){
       dx = 1;
       dy = 1;
       inside += 1;
       resdist = square_distance$1({x,y}, resource);
     }
     returnedArray.push(dx);
     returnedArray.push(dy);
     returnedArray.push(resdist);
     returnedArray.push(inside);
     return returnedArray;
}

pilgrim.makemove = (self) => {
  //add pilgrim logic
  self.log("pilgrim turn");
	//self.castleTalk(77);

  const karboniteMap = self.getKarboniteMap();
  const fuelMap = self.getFuelMap();
  const visibleRobots = self.getVisibleRobots();
	const buildvision = self.getVisibleRobotMap();
  const fullmap = self.getPassableMap();
	var edge = fullmap.length - 1;

  var xcord = self.me.x;
  var ycord = self.me.y;
  var dx = 0;
  var dy = 0;
  //var fuel_loc = self.me;
  //var karbonite_loc = self.me;

	// var karblist = getreslist(self.me, karboniteMap)
	// self.log("karblist " + karblist);
	// self.log(karblist[0][1]);

  //check if there's another pilgrim nearby
if (!self.location && !self.typed)
{
		var flag = 0;
		if(visibleRobots.filter(robot => robot.team === self.me.team && robot.unit === 2 && square_distance$1(self.me, robot) < 25).length % 2 === 0){
      self.log("fuel pilgrim");
      self.location = getClosestRes$1(self.me, fuelMap);
			if (square_distance$1(self.me, self.location) !== 0 && buildvision[self.location.y][self.location.x] !== 0){
				var fuellist = getreslist(self.me, fuelMap);
				self.log("fuellist " + fuellist);
				for (let i = 0; i < fuellist.length;i++){
					if (buildvision[fuellist[i][1]][fuellist[i][0]] === 0){
						self.location = {x: fuellist[i][0], y: fuellist[i][1]};
						self.log("ULTIMA TEST fuel switch: " + self.location.x + " " + self.location.y);
					}
				}
			}
			if(square_distance$1(self.me, self.location) !== 0 && buildvision[self.location.y][self.location.x] !== 0){
					var karblist = getreslist(self.me, karboniteMap);
					for (let i = 0; i < karblist.length;i++){
						if (buildvision[karblist[i][1]][karblist[i][0]] === 0){
							flag = 1;
							self.location = {x: karblist[i][0], y: karblist[i][1]};
							self.log("ULTIMA TEST fuel to karb: " + self.location.x + " " + self.location.y);
						}
					}
			}
			if (flag === 0){
				self.typed = 0;
			}
			else {
				self.typed = 1;
			}
    }
    else{
      self.log("karb pilgrim");
      self.location  = getClosestRes$1(self.me, karboniteMap);
			if (square_distance$1(self.me, self.location) !== 0 && buildvision[self.location.y][self.location.x] !== 0){
				var karblist = getreslist(self.me, karboniteMap);
			//	self.log("karblist " + karblist);
				for (let i = 0; i < karblist.length;i++){
					if (buildvision[karblist[i][1]][karblist[i][0]] === 0){
						self.location = {x: karblist[i][0], y: karblist[i][1]};
						self.log("ULTIMA TEST another karb: " + self.location.x + " " + self.location.y);
					}
				}
			}
			if(square_distance$1(self.me, self.location) !== 0 && buildvision[self.location.y][self.location.x] !== 0){
					var fuellist = getreslist(self.me, fuelMap);
					for (let i = 0; i < fuellist.length;i++){
						if (buildvision[fuellist[i][1]][fuellist[i][0]] === 0){
							flag = 1;
							self.location = {x: fuellist[i][0], y: fuellist[i][1]};
							self.log("ULTIMA TEST karb to fuel: " + self.location.x + " " + self.location.y);
						}
					}
			}
			if (flag === 0){
				self.typed = 1;
			}
			else {
				self.typed = 0;
			}
    }
}
  //mine or depot
  if(self.me.karbonite <= 18 && self.typed === 1 && square_distance$1 (self.me, self.location) === 0){
    self.log("mining karbonite");
    return self.mine();
  }
  else if(self.me.fuel <= 90 && self.typed === 0 && square_distance$1(self.me, self.location) === 0){
    self.log("mining fuel");
    return self.mine();
  }
  else{
    if(self.me.karbonite === 20 || self.me.fuel === 100){
      self.log("resources full");
      //if castle is in the adjacent position, depot
      for(var i=0; i<visibleRobots.length; i++){
        if(square_distance$1(self.me, visibleRobots[i]) <= 2 && visibleRobots[i].team === self.me.team && visibleRobots[i].unit === 0){
          dx = visibleRobots[i].x - xcord;
          dy = visibleRobots[i].y - ycord;
	  self.log("pilgrim depoting resource");
          return self.give(dx, dy, self.me.karbonite, self.me.fuel);
        }
      }
    }
  }

  if(self.me.fuel <= 90 && self.typed === 0){
		self.log("test: moving to fuel");
    dx = self.location.x - xcord;
    dy = self.location.y - ycord;
		if (square_distance$1(self.me, self.location) > 4){
			var adjacent = onestep(buildvision,fullmap,xcord,ycord,self.location,self.me,edge);
			dx = adjacent[0];
			dy = adjacent[1];
		}
  }
  else if(self.me.karbonite <= 18 && self.typed === 1){
		self.log("test: moving to karb");
    dx = self.location.x - xcord;
    dy = self.location.y - ycord;
		if (square_distance$1(self.me, self.location) > 4){
			var adjacent = onestep(buildvision,fullmap,xcord,ycord,self.location,self.me,edge);
			dx = adjacent[0];
			dy = adjacent[1];
		}
  }
  else if (self.typed === 0 || self.typed ===1){
     for(var i=0; i<visibleRobots.length; i++){
       if(visibleRobots[i].team === self.me.team){
         if(visibleRobots[i].unit === 0){
	   // dx = visibleRobots[i].x - xcord;
	   // dy = visibleRobots[i].y - ycord;
		 			var adjacent = onestep(buildvision,fullmap,xcord,ycord,visibleRobots[i],self.me,edge);
					dx = adjacent[0];
					dy = adjacent[1];
					var outward = adjacent[2];

					var x = self.me.x + 2;
					var y = self.me.y;
					if (outward > 2 && square_distance$1({x,y},visibleRobots[i]) == 1 || square_distance$1({x,y},visibleRobots[i]) == 2){
						if (buildvision[y][x] === 0 && fullmap[y][x] === true){
							dx = adjacent[0];
							dy = adjacent[1];
						}
					}
					x = self.me.x - 2;
					y = self.me.y;
					if (outward > 2 && square_distance$1({x,y},visibleRobots[i]) == 1 || square_distance$1({x,y},visibleRobots[i]) == 2){
						if (buildvision[y][x] === 0 && fullmap[y][x] === true){
							dx = adjacent[0];
							dy = adjacent[1];
						}
					}
					x = self.me.x;
					y = self.me.y + 2;
					if (outward > 2 && square_distance$1({x,y},visibleRobots[i]) == 1 || square_distance$1({x,y},visibleRobots[i]) == 2){
						if (buildvision[y][x] === 0 && fullmap[y][x] === true){
							dx = adjacent[0];
							dy = adjacent[1];
						}
					}
					x = self.me.x;
					y = self.me.y - 2;
					if (outward > 2 && square_distance$1({x,y},visibleRobots[i]) == 1 || square_distance$1({x,y},visibleRobots[i]) == 2){
						if (buildvision[y][x] === 0 && fullmap[y][x] === true){
							dx = adjacent[0];
							dy = adjacent[1];
						}
					}

					self.log("test: moving back to castle");
         }
       }
     }
  }
  self.log("pilgrim moving");
  return self.move(dx, dy);


};

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
	// self.log("Phrophet: " + self.id + " Beggining turn");
	// var inPosition; // Set to true when prophet gets to desired location
  // if(inPosition == undefined) // Initialize the variable
	// 	inPosition = false;
	// var desiredPosition;               // Tile prophet wants to get to.
	// var visibleUnits = self.getVisibleRobots(); // Units that can be seen by the prophet
  // var visibleTiles = self.getVisibleRobotMap();
	// var focalPoint; // What will be used as a reference for areas to check
	// const latticePoint = //Place where a robot can position itself in refrence to the focal point
	// 	[[0,-2], [1, -1], [2, 0], [1, 1], [0, 2], [-1, 1], [-2, 0], [-1, -1]];
	//
	//
	//
	// //*** Check if enemies are within range
	// var enemies = visibleUnits.filter((robot) => {
	// 		if(robot.team !== self.me.team){
	// 		return true;
	// 		}
	// 		});
	// if(enemies.length > 0){ // Attacking
	// 	self.log("Phrophet: " + self.id + "  Found an enemy");
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
	// else{ // Movement
	// 	if(focalPoint == undefined){ // Set a new units focal point.
	// 		var Castles = self.getVisibleRobots();
	// 		Castles = Castles.filter((robot) => {
	// 			if(robot.unit !== 0)
	// 				return false;
	// 		  else
	// 				return true;
	// 		});
	// 		if(Castles.length > 0){ // Find the castle where you spawned from.
	// 			focalPoint = [Castles[0].x, Castles[0].y]; // Castles Y position
	// 		}
	// 	}
  //   for(var i = 0; i < latticePoint.length; i++){
	// 		var scoutTile = visibleTiles[focalPoint[0]+latticePoint[i][0]][focalPoint[1]+latticePoint[i][1]];
  //     if(scoutTile == 0){
	// 		var dx = focalPoint[0]+latticePoint[i][0];
  //     var dy = focalPoint[1]+latticePoint[i][1];
  //       desiredPosition = [self.me.x-dx, self.me.y-dy];
  //       self.log(desiredPosition);
	// 			return self.move(desiredPosition[0],desiredPosition[1]);
	// 		}
  //   }
	// }
	self.log("Prophet: " + self.id + " Beggining turn");
	//self.castleTalk(88);
	var inPosition; // Set to true when prophet gets to desired location
	if(inPosition == undefined) // Initialize the variable
					inPosition = false;
	var visibleUnits = self.getVisibleRobots(); // Units that can be seen by the prophet
	var visibleTiles = self.getVisibleRobotMap();
	var kmap = self.getKarboniteMap();
	var fmap = self.getFuelMap();
	const moves = //Place where a robot can position itself in refrence to the focal point
					[[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [2, 0], [-2, 0], [0, 2], [0, -2]];




	//*** Check if enemies are within range
	// var enemies = visibleUnits.filter((robot) => {
	// if(robot.team !== self.me.team){
	// return true;
	// }
	// });
	// if(enemies.length > 0){ // Attacking
	// self.log("Crusader: " + self.id + "  Found an enemy");
	// var enemyToAttack; // Will contain id of robot to attack
	// var distance;      // Used to store how far away an enemy is.
	// for(var i = 0; i < 10; i++){
	// distance = (enemies[i].x-self.me.x)**2 + (enemies[i].y-self.me.y)**2;
	// if(distance >= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[0] && distance <= SPECS.UNITS[self.me.unit].ATTACK_RADIUS[1]){
	// if(enemyToAttack == undefined){
	// 	self.log("Phrophet: " + self.id + "  Attacking");
	// 	enemyToAttack = enemies[i];
	// 	var dx = enemyToAttack.x - self.me.x;
	// 	var dy = enemyToAttack.y - self.me.y;
	// 	return self.attack(dx, dy);
	// }
	// }
	// }
	// }

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

	var latticeSum = (self.me.x+self.me.y);
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

const preacher = {};

preacher.makemove = (self) => {
  //add preacher logic

};

const crusader = {};




crusader.makemove = (self) => {
				self.log("Crusader: " + self.id + " Beggining turn");
				var inPosition; // Set to true when prophet gets to desired location
				if(inPosition == undefined) // Initialize the variable
								inPosition = false;
				var visibleUnits = self.getVisibleRobots(); // Units that can be seen by the prophet
				var visibleTiles = self.getVisibleRobotMap();
        var kmap = self.getKarboniteMap();
        var fmap = self.getFuelMap();
				const moves = //Place where a robot can position itself in refrence to the focal point
								[[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [2, 0], [-2, 0], [0, 2], [0, -2]];

        const fullmap = self.getPassableMap();

if (false){

	//self.log(self.moves_made[0][0]);

	{
		for (var i; i<visibleUnits.length; i++) {
	  }
	}

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

	for (var i; i<visibleUnits.length; i++) {
  }



	for (var i; i < totalmove.length; i++){
		{
			{
				//self.log("inside moves made loop");
				{
					//self.log("inside map check");
					var sq_dis;
				}
			}
		}
	}
	//self.log("no PROBLEM IN LOOP");
	//self.log(least);
	{
		for (var i; i < self.moves_made.length; i++){
		}
	}



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

				var latticeSum = (self.me.x+self.me.y);
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

// eslint-disable-next-line no-unused-vars
class MyRobot extends BCAbstractRobot {
    constructor() {
        super();
        this.unit_type = undefined;

        //can store other map information and message info as fields here
    }

    turn() {
        if (this.me.turn === 1) ;
        if (this.unit_type === undefined){
            if (this.me.unit === SPECS.CASTLE){
              this.unit_type = castle;
            }
            else if (this.me.unit === SPECS.CHURCH){
              this.unit_type = church;
            }
            else if (this.me.unit === SPECS.CRUSADER){
              this.unit_type = crusader;
            }
            else if (this.me.unit === SPECS.PILGRIM){
              this.unit_type = pilgrim;
            }
            else if (this.me.unit === SPECS.PREACHER){
              this.unit_type = preacher;
            }
            else if (this.me.unit === SPECS.PROPHET){
              this.unit_type = prophet;
            }
        }
        return this.unit_type.makemove(this);
  }
}

var robot = new MyRobot();
