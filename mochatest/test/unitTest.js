const assert = require('chai').assert;
const square_distance = require('../testMain').square_distance;
const getClosestRes = require('../testMain').getClosestRes;
const buildOnEmptyOther = require('../testMain').buildOnEmptyOther;
const is_horizontal = require('../testMain').is_horizontal;
const getreslist = require('../testMain').getreslist;
const onestep = require('../testMain').onestep;

describe('testMain', function(){
  it('square_distance should return 2', function(){
    var start = [0,0];
    var end = [1,1];
    let result = square_distance(start, end);
    assert.equal(result, 2);
   });

   it('getClosestRes should return [1,1]', function(){
     var resource_map = [[1,1], [2,2]];
     var current_loc = [0,0];
     let result = getClosestRes(current_loc, resource_map);
     assert.deepEqual(result, [1,1]);
   });

   it('getClosestRes should return [2,2]', function(){
     var resource_map = [[1,1], [2,2]];
     var current_loc = [3,3];
     let result = getClosestRes(current_loc, resource_map);
     assert.deepEqual(result, [2,2]);
   });

   it('buildOnEmptyOther should return [-1,-1,0]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[0,0,0],[0,0,0],[0,0,0]];
     var xcord = 1;
     var ycord = 1;
     let result = buildOnEmptyOther(buildvision, fullmap, xcord, ycord);
     assert.deepEqual(result, [-1,-1,0]);
   });

   it('buildOnEmptyOther should return [0,-1,0]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[1,0,0],[0,0,0],[0,0,0]];
     var xcord = 1;
     var ycord = 1;
     let result = buildOnEmptyOther(buildvision, fullmap, xcord, ycord);
     assert.deepEqual(result, [0,-1,0]);
   });

   it('buildOnEmptyOther should return [1,-1,0]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[1,1,0],[0,0,0],[0,0,0]];
     var xcord = 1;
     var ycord = 1;
     let result = buildOnEmptyOther(buildvision, fullmap, xcord, ycord);
     assert.deepEqual(result, [1,-1,0]);
   });

   it('buildOnEmptyOther should return [-1,0,0]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[1,1,1],[0,0,0],[0,0,0]];
     var xcord = 1;
     var ycord = 1;
     let result = buildOnEmptyOther(buildvision, fullmap, xcord, ycord);
     assert.deepEqual(result, [-1,0,0]);
   });

   it('buildOnEmptyOther should return [1,0,0]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[1,1,1],[1,0,0],[0,0,0]];
     var xcord = 1;
     var ycord = 1;
     let result = buildOnEmptyOther(buildvision, fullmap, xcord, ycord);
     assert.deepEqual(result, [1,0,0]);
   });

   it('buildOnEmptyOther should return [-1,1,0]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[1,1,1],[1,0,1],[0,0,0]];
     var xcord = 1;
     var ycord = 1;
     let result = buildOnEmptyOther(buildvision, fullmap, xcord, ycord);
     assert.deepEqual(result, [-1,1,0]);
   });

   it('buildOnEmptyOther should return [0,1,0]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[1,1,1],[1,0,1],[1,0,0]];
     var xcord = 1;
     var ycord = 1;
     let result = buildOnEmptyOther(buildvision, fullmap, xcord, ycord);
     assert.deepEqual(result, [0,1,0]);
   });

   it('buildOnEmptyOther should return [1,1,0]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[1,1,1],[1,0,1],[1,1,0]];
     var xcord = 1;
     var ycord = 1;
     let result = buildOnEmptyOther(buildvision, fullmap, xcord, ycord);
     assert.deepEqual(result, [1,1,0]);
   });

   it('buildOnEmptyOther should return [1,1,1]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[1,1,1],[1,0,1],[1,1,1]];
     var xcord = 1;
     var ycord = 1;
     let result = buildOnEmptyOther(buildvision, fullmap, xcord, ycord);
     assert.deepEqual(result, [1,1,1]);
   });

   it('is_horizontal should return true', function(){
     var fullmap = [[1,2,3],[4,5,6],[1,2,3]];
     let result = is_horizontal(fullmap);
     assert.equal(result, true);
   });

  it('is_horizontal should return false', function(){
     var fullmap = [[1,2,3],[4,5,6],[1,2,3],[7,8,9]];
     let result = is_horizontal(fullmap);
     assert.equal(result, false);
   });

  it('getreslist should return [[1,1],[2,2]]', function(){
     var resource_map = [[1,1], [2,2]];
     var current_loc = [0,0];
     let result = getreslist(current_loc, resource_map);
     assert.deepEqual(result, [[1,1],[2,2]]);
   });

  it('getreslist should return [[1,1],[2,2], [3,3]]', function(){
     var resource_map = [[1,1], [2,2],[3,3],[7,7]];
     var current_loc = [0,0];
     let result = getreslist(current_loc, resource_map);
     assert.deepEqual(result, [[1,1],[2,2], [3,3]]);
   });

   it('onestep should return [-1,-1,8,1]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[0,1,1], [1,1,1], [1,1,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [-1,-1,8,1]);
   });

   it('onestep should return [0,-1,5,2]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[0,0,1], [1,1,1], [1,1,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [0,-1,5,2]);
   });

   it('onestep should return [1,-1,4,3]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[0,0,0], [1,1,1], [1,1,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [1,-1,4,3]);
   });

   it('onestep should still return [1,-1,4,3]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[0,0,0], [0,1,1], [1,1,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [1,-1,4,3]);
   });

   it('onestep should return [1,0,1,4]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[0,0,0], [0,1,0], [1,1,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [1,0,1,4]);
   });

   it('onestep should still return [1,0,1,4]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[0,0,0], [0,1,0], [0,1,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [1,0,1,4]);
   });

   it('onestep should return [1,0,1,4]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[0,0,0], [0,1,0], [0,0,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [1,0,1,4]);
   });

   it('onestep should return [1,1,0,5]', function(){
     var buildvision = [[0,0,0], [0,0,0], [0,0,0]];
     var fullmap = [[0,0,0], [0,1,0], [0,0,0]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [1,1,0,5]);
   });

   it('onestep should return [-1,0,5,1]', function(){
     var buildvision = [[1,1,1], [0,1,1], [1,1,1]];
     var fullmap = [[1,1,1], [0,1,1], [1,1,]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [-1,0,5,1]);
   });

   it('onestep should return [-1,1,4,1]', function(){
     var buildvision = [[1,1,1], [1,1,1], [0,1,1]];
     var fullmap = [[1,1,1], [1,1,1], [0,1,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [-1,1,4,1]);
   });

   it('onestep should return [0,1,1,1]', function(){
     var buildvision = [[1,1,1], [1,1,1], [1,0,1]];
     var fullmap = [[1,1,1], [1,1,1], [1,0,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [1,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [0,1,1,1]);
   });

   it('onestep should return [1,1,1,1]', function(){
     var buildvision = [[1,1,1], [1,1,1], [1,0,1]];
     var fullmap = [[1,1,1], [1,1,1], [1,0,1]];
     var xcord = 0;
     var ycord = 1;
     var resource = [2,2];
     var myself = [0,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [1,1,1,1]);
   });

   // it('onestep should return [undefined,undefined,1000,0]', function(){
   //   var buildvision = [[1,1,1], [1,1,1], [1,0,1]];
   //   var fullmap = [[1,1,1], [1,1,1], [1,0,1]];
   //   var xcord = 1;
   //   var ycord = 0;
   //   var resource = [2,2];
   //   var myself = [1,0];
   //   var edge = fullmap.length - 1;
   //   let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
   //   assert.deepEqual(result, [undefined,undefined,1000,0]);
   // });
   //
   it('onestep should return [1,-1,5,1]', function(){
     var buildvision = [[0,1,0], [1,1,1], [1,1,1]];
     var fullmap = [[0,1,0], [1,1,1], [1,1,1]];
     var xcord = 1;
     var ycord = 1;
     var resource = [2,2];
     var myself = [0,1];
     var edge = fullmap.length - 1;
     let result = onestep(buildvision, fullmap, xcord, ycord, resource, myself, edge);
     assert.deepEqual(result, [1,-1,5,1]);
   });
   it ('lattice check should return 0', function(){
     var result = 0;
     var fullmap = [[0,1,0],[0,1,0],[0,0,0]];
     var width = fullmap.length;
     var prev = -1;
     var flag = 1;
     for (var check in fullmap){
      for (i = 0; i < width; i++) {
        if (prev == check[i]){
          flag = 0;
        }
        prev = check[i];
      }
      prev = -1;
     }
     result = flag;
     assert.deepEqual(result,0);
   });
   it('square_distance should return 0', function(){
     var start = [1,1];
     var end = [1,1];
     let result = square_distance(start, end);
     assert.equal(result, 0);
    });
    it('getClosestRes edgecase should return [0,0]', function(){
      var resource_map = [[0,0], [0,0]];
      var current_loc = [0,0];
      let result = getClosestRes(current_loc, resource_map);
      assert.deepEqual(result, [0,0]);
    });
    it('getreslist edgecase should return [[0,0],[0,0]]', function(){
       var resource_map = [[0,0], [0,0]];
       var current_loc = [0,0];
       let result = getreslist(current_loc, resource_map);
       assert.deepEqual(result, [[0,0],[0,0]]);
     });
     it('is_horizontal edge case #1 should return true', function(){
       var fullmap = [[0,0,0],[0,1,0],[0,0,0]];
       let result = is_horizontal(fullmap);
       assert.equal(result, true);
     });
     it('is_horizontal edge case #2 should return true', function(){
       var fullmap = [[0,0,0],[0,0,0],[0,0,0]];
       let result = is_horizontal(fullmap);
       assert.equal(result, true);
     });

});
