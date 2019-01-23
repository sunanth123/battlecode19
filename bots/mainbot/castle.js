import {BCAbstractRobot, SPECS} from 'battlecode';

const castle = {};

castle.makemove = (self) => {
  //add castle logic
  self.log("castle turn");
  if (self.me.turn % 10 === 0) {
    self.log("Building a crusader at " + (self.me.x+1) + ", " + (self.me.y+1));
    return self.buildUnit(SPECS.CRUSADER, 1, 1);
  }

};

export default castle;
