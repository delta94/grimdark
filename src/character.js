
////Character
class Character {
  constructor() {
    this.tileFrom = [1,1];
    this.tileTo = [1,1];
    //also affects movement speed 
    this.timeMoved = 0;
    //this is the dimension of the character sprite
    this.dimensions = [48, 48];
    this.position = [49,49]
    //movement speed
    this.delayMove = 150;
    this.facing = "DOWN"
    this.playerSprites = {
      "UP": [{x:96, y:0, w:47, h:47}, {x:96, y:48, w:47, h:47}],
      "DOWN": [{x:48, y:0, w:47, h:47}, {x:48, y:48, w:47, h:47}],
      "LEFT": [{x:144, y:0, w:47, h:47}, {x:144, y:48, w:47, h:47}],
      "RIGHT": [{x:0, y:0, w:47, h:47}, {x:0, y:48, w:47, h:47}],
    }
    this.movementAnimation = "false"
  }
}
//this function is dependent upon globals - maybe do tileW = this.tileW.bind(this)
Character.prototype.placeAt = function(x,y) {
  this.tileFrom = [x, y];
  this.tileTo = [x, y];
  this.position = [
    (
        //multiply row tile value * size of tile
        //add tile width - the xdimension /2 in order to center horizontally
      (tileW * x) + ((tileW - this.dimensions[0])/2)
    ),(
      (tileH * y) + ((tileH - this.dimensions[1])/2)
      )
  ]
}
//this function is dependent upon globals
Character.prototype.processMovement = function(time) {
  if (this.tileFrom[0] === this.tileTo[0] && this.tileFrom[1] === this.tileTo[1]) {
    return false
  } 
  console.log(time - this.timeMoved)
  if((time - this.timeMoved) >= this.delayMove) {
    this.placeAt(this.tileTo[0], this.tileTo[1])
    this.movementAnimation = !this.movementAnimation
    console.log(this)
  } else {
    //below block gives pixel value starting position
    this.position[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0])/2);
    this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1])/2);

    //check if char is moving horizontally
    if(this.tileTo[0] !== this.tileFrom[0]) {
      const diff = (tileW/this.delayMove) * (time - this.timeMoved);
      this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff)

    }
    //check if char is moving vertically
    if(this.tileTo[1] != this.tileFrom[1]){
			var diff = (tileH / this.delayMove) * (time - this.timeMoved);
      this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
		}
    
    this.position[0] = Math.round(this.position[0])
    this.position[1] = Math.round(this.position[1])
  }

  return true
}
//this function is dependent upon globals - needs to go in the map


Character.prototype.move = function(direction, time) {
  this.tileTo[0] += direction.DIRS[0]
  this.tileTo[1] += direction.DIRS[1]
  this.timeMoved = time
  this.facing = direction.FACING
  //console.log("tile to", this.tileTo[0], this.tileTo[1], direction)

}


export default Character
