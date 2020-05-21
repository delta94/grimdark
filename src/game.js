import Viewport from "./view";
import Character from "./character";
import Map from "./map";
import { levelOne } from "./levels"
import { FLOORTYPES, TILETYPES, DIRECTIONS } from "./util"
import Monster from "./monsters"

class Game {
  constructor(viewportDimensions) {
    this.gameMap = new Map(levelOne)
    this.player = new Character()
    this.viewport = new Viewport(viewportDimensions)
    this.keysDown = {
      37: false, //left arrow
      39: false, //right arrow
      38: false, //up arrow
      40: false, //down arrow
    }
    this.monsters = {}
    this.spawnRate = 6
    this.maxSpawns = 50
    this.currentSpawns = 0
    this.drawGame = () => {

    if(window.ctx === null) return;
    if(!window.tilesetLoaded || !window.monsterSetLoaded) {
      requestAnimationFrame(this.drawGame)
      console.log(monsterSetLoaded)
      return
    }
    
    const currentFrameTime = Date.now()
    const timeElapsed = currentFrameTime - lastFrameTime

    let sec = Math.floor(Date.now()/1000);
    if (sec !== currentSecond) {
      currentSecond = sec;
      framesLastSecond = frameCount;
      frameCount = 1
    } else {
      frameCount ++
    }
  
    //Player movement//////////////////////////////////////////////////////
    if (!this.player.processMovement(currentFrameTime)) {
      if((this.keysDown[37] && this.keysDown[39]) || (this.keysDown[38] && this.keysDown[40])) {
        //do nothing
        //prevent screen stuttering
      }
      //Left + up arrow
      else if ((this.keysDown[37] && this.keysDown[38]) && this.isValidMove(DIRECTIONS.UPLEFT, TILETYPES, FLOORTYPES)) {
        this.player.move(DIRECTIONS.UPLEFT, currentFrameTime)
      }
      //Left + down arrow
      else if ((this.keysDown[37] && this.keysDown[40]) && this.isValidMove(DIRECTIONS.DOWNLEFT, TILETYPES, FLOORTYPES)) {
        this.player.move(DIRECTIONS.DOWNLEFT, currentFrameTime)
      }
      //right + up arrow
      else if ((this.keysDown[39] && this.keysDown[38]) && this.isValidMove(DIRECTIONS.UPRIGHT, TILETYPES, FLOORTYPES)) {
        this.player.move(DIRECTIONS.UPRIGHT, currentFrameTime)
      }
      //right + down arrow
      else if ((this.keysDown[39] && this.keysDown[40]) && this.isValidMove(DIRECTIONS.DOWNRIGHT, TILETYPES, FLOORTYPES)) {
        this.player.move(DIRECTIONS.DOWNRIGHT, currentFrameTime)
      }
      //up arrow
      else if (this.keysDown[38] && this.isValidMove(DIRECTIONS.UP, TILETYPES, FLOORTYPES)) {
        this.player.move(DIRECTIONS.UP, currentFrameTime)  
      }
      //Down arrow
      else if (this.keysDown[40] && this.isValidMove(DIRECTIONS.DOWN, TILETYPES, FLOORTYPES)) {
        this.player.move(DIRECTIONS.DOWN, currentFrameTime)  
      }
      //Left arrow
      else if (this.keysDown[37] && this.isValidMove(DIRECTIONS.LEFT, TILETYPES, FLOORTYPES)) {
        this.player.move(DIRECTIONS.LEFT, currentFrameTime)  
      }
      //right arrow
      else if (this.keysDown[39] && this.isValidMove(DIRECTIONS.RIGHT, TILETYPES, FLOORTYPES)) {
        this.player.move(DIRECTIONS.RIGHT, currentFrameTime)
      }
      //check to see if player is moving
      if((this.player.tileFrom[0] !== this.player.tileTo[0]) || (this.player.tileFrom[1] !== this.player.tileTo[1])){
        this.player.timeMoved = currentFrameTime
      }
    }
    ////////////////////////////////////////////////////////////////
    this.viewport.update(this.player.position[0] + (this.player.dimensions[0]/2), 
    this.player.position[1] + (this.player.dimensions[1]/2))
    this.renderViewportImage()
    this.renderMap()
    //monsters
    if (!(sec%6) && this.currentSpawns < this.maxSpawns) this.placeMonster(TILETYPES,FLOORTYPES)
    let monsterMap = {}
    for(let monster in this.monsters) {
      monster = this.monsters[monster]
      
      let direction = DIRECTIONS[monster.determineDirection(this.player.position)]
      while(!this.isValidMonsterMove(monster, direction, TILETYPES, FLOORTYPES)) {
        direction = DIRECTIONS[Monster.resolveCollision(direction)]
        console.log(direction)
      }
      if(!monster.processMovement(currentFrameTime)) {
        monster.move(direction, currentFrameTime)
      }
      this.renderMonster(monster);
      monsterMap[this.toIndex(...monster.position)] = monster;
    }
    this.monsters = monsterMap
    this.renderPlayer()
    this.renderFPSCounter(framesLastSecond)
    lastFrameTime = currentFrameTime;
    requestAnimationFrame(this.drawGame)
   }
  }

  renderPlayer() {
    let spriteIndex = (this.player.movementAnimation) ? 0 : 1
    window.ctx.drawImage(window.monsterSet, this.player.playerSprites[this.player.facing][spriteIndex].x, this.player.playerSprites[this.player.facing][spriteIndex].y, this.player.playerSprites[this.player.facing][spriteIndex].w, this.player.playerSprites[this.player.facing][spriteIndex].h,  (this.viewport.offset[0] + this.player.position[0]), (this.viewport.offset[1] + this.player.position[1]), this.player.dimensions[0], this.player.dimensions[1]);
  }
  renderMonster(monster) {
    let spriteIndex = (monster.movementAnimation) ? 0 : 1

    
    // window.ctx.drawImage(window.monsterSet, 48, 0, 47, 47,  monster.position[0], monster.position[1], monster.dimensions[0], monster.dimensions[1]);

    window.ctx.drawImage(window.monsterSet, monster.monsterSprites[monster.facing][spriteIndex].x, monster.monsterSprites[monster.facing][spriteIndex].y, monster.monsterSprites[monster.facing][spriteIndex].w, monster.monsterSprites[monster.facing][spriteIndex].h, (this.viewport.offset[0] + monster.position[0]), (this.viewport.offset[1]+ monster.position[1]), monster.dimensions[0], monster.dimensions[1]);
  }


  renderViewportImage() {
     window.ctx.drawImage(window.spaceImage, 0, 0, 800, 800,  0, 0, this.viewport.screen[0], this.viewport.screen[1]);
  }

  toIndex(x,y) {
    return ((y*mapW) + x);
  }

  //This function should be moved into the map
  isValidMove(direction, TILETYPES, FLOORTYPES) {
    const x = this.player.tileFrom[0] + direction.DIRS[0];
    const y = this.player.tileFrom[1] + direction.DIRS[1]
    if(x < 0 || x > (mapW-1) || y < 0 || y > mapH-1) return false;
    if(TILETYPES[this.gameMap.map[this.toIndex(x,y)]].floor !== FLOORTYPES.open) return false;
    return true;
  }

  isValidMonsterMove(monster, direction, TILETYPES, FLOORTYPES) {
    const x = monster.tileFrom[0] + direction.DIRS[0];
    const y = monster.tileFrom[1] + direction.DIRS[1];
    if(x < 0 || x > (mapW-1) || y < 0 || y > mapH-1) return false;
    if(TILETYPES[this.gameMap.map[this.toIndex(x,y)]].floor !== FLOORTYPES.open) return false;
    if (this.monsters[this.gameMap.map[this.toIndex(x,y)]]) return false;
    return true;
  }
  

   renderMap() {
     for(let y = this.viewport.startTile[1]; y <= this.viewport.endTile[1]; y++) {
      for(let x = this.viewport.startTile[0]; x <= this.viewport.endTile[0]; x++) {
        const tile = TILETYPES[this.gameMap.map[this.toIndex(x,y)]];
            window.ctx.drawImage(window.tileset, tile.sprite[0].x, tile.sprite[0].y, tile.sprite[0].w, tile.sprite[0].h, 
            (this.viewport.offset[0] + (x * tileW)), (this.viewport.offset[1] + (y*tileH)), tileW, tileH);
      }
    }
  }

  renderFPSCounter(framesLastSecond) {
    window.ctx.fillStyle = "ff0000";
    window.ctx.fillText("FPS: " + framesLastSecond, 10, 20)
  }
  placeMonster(TILETYPES,FLOORTYPES) {
    const playerPosition = this.player.position
    const newMonsterPosition = () => [Math.floor(Math.random() * mapH - 1) + 1, Math.floor(Math.random() * mapW - 1) + 1]
    const validateMonsterPlacement = (position) => {
      if (Math.abs(position[0] - playerPosition[0]) <= 3 || Math.abs(position[1] - playerPosition[1]) <= 3) return false
      if(TILETYPES[this.gameMap.map[this.toIndex(...position)]].floor !== FLOORTYPES.open) return false
      return true
    }
    let monsterPosition = newMonsterPosition()
    while (!validateMonsterPlacement(monsterPosition)) {
      monsterPosition = newMonsterPosition()
    }
    const monster = new Monster()
    monster.placeAt(...monsterPosition)
    this.monsters[this.toIndex(...monsterPosition)] = monster
    this.currentSpawns += 1
    console.log("monster created")
  }
  
}
  

export default Game;


