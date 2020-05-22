import Game from "./game"
import { ASSETURLS } from "./util"

window.tileW = 48
window.tileH = 48;
window.mapW = 64;
window.mapH = 64;

window.tileset = new Image();
window.monsterSet = new Image();
window.fxSet = new Image();
window.spaceImage = new Image();

window.ctx = null
window.tilesetLoaded = false 
window.monsterSetLoaded = false; 
window.fxSetLoaded = false;
window.currentSecond = 0, 
window.frameCount = 0, 
window.framesLastSecond = 0;
window.lastFrameTime = 0;



window.onload = function() {
  
  window.tileset.onerror = function(e) {
    window.ctx = null;
    alert("tileset load error", e.message);
  }
  
  window.monsterSet.onerror = function(e) {
    window.ctx = null;
    alert("monsterset load error", e.message);
  }

  window.fxSet.onerror = function(e) {
    window.ctx = null;
    alert("background image load error", e.message);
  }

  window.spaceImage.onerror = function(e) {
    window.ctx = null;
    alert("background image load error", e.message);
  }
  
  window.tileset.onload = function() { window.tilesetLoaded = true };
  window.monsterSet.onload = function() { window.monsterSetLoaded = true }
  window.fxSet.onload = function() { window.fxSetLoaded = true }
  //revisit 
  window.tileset.src = ASSETURLS.tilesetUrl;
  window.monsterSet.src = ASSETURLS.characterTilesetUrl;
  window.fxSet.src = ASSETURLS.fxSetUrl;
  window.spaceImage.src = ASSETURLS.spaceImageUrl;

};

document.addEventListener("DOMContentLoaded", () => { 
  const start = document.getElementById("start")
  start.addEventListener( "click", () =>{
    document.querySelectorAll(".welcome")[0].setAttribute("class", "hidden")
    document.getElementById("game").setAttribute("class", "show")
    const music = new Audio(ASSETURLS.hootsforce)
    music.play();
  
    const game = document.getElementById("game")
    window.ctx = game.getContext('2d');
    const newGame = new Game([game.width, game.height])
    window.ctx.font = "bold 10pt sans-serif";
    
    window.addEventListener("keydown", (e) => {
      if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 32) {
        newGame.keysDown[e.keyCode] = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 32) {
        newGame.keysDown[e.keyCode] = false;
      }
    });
  
    requestAnimationFrame(newGame.drawGame);
  })
  

});  













// const interiorWalls = {
//   1: {x:144, y:0, w:48, h:48},
//   2: {x:112, y:0, w:16, h:16},
//   3: {x:128, y:0, w:16, h:16},
//   4: {x:144, y:0, w:16, h:16},
//   5: {x:160, y:0, w:16, h:16},
//   6: {x:176, y:0, w:16, h:16},
// }

// const floorTiles = {
//   1: {x:0, y:16, w:48, h:48},
//   2: {x:112, y:16, w:16, h:16},
//   3: {x:128, y:16, w:16, h:16},
//   4: {x:144, y:16, w:16, h:16},
//   5: {x:160, y:16, w:16, h:16},
//   6: {x:176, y:16, w:16, h:16},
// }



  //listeners
  









