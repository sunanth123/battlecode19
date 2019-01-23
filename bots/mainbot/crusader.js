import {BCAbstractRobot, SPECS} from 'battlecode';

const crusader = {};

crusader.makemove = (self) => {
  //add crusader logic
  const choices = [[0,-1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  const choice = choices[Math.floor(Math.random()*choices.length)];
  self.log("Crusader moving");
  return self.move(...choice);
};

export default crusader;
