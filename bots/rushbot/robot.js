import {BCAbstractRobot, SPECS} from 'battlecode';
import castle from './castle.js';
import church from './church.js';
import pilgrim from './pilgrim.js';
import prophet from './prophet.js';
import preacher from './preacher.js';
import crusader from './crusader.js';


// eslint-disable-next-line no-unused-vars
class MyRobot extends BCAbstractRobot {
    constructor() {
        super();
        this.unit_type = undefined;

        //can store other map information and message info as fields here
    }

    turn() {
        if (this.me.turn === 1) {
          //get some information on the first turn of unit.
        }
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
