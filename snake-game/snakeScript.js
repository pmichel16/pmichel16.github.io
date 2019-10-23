function Position(xPos,yPos){
  this.xPos = xPos;
  this.yPos = yPos;
}
const sqWidth = 40;
const topStart = 3;
const leftStart = 6;

var keyDown = 39;
var headPos = new Position(0, 0);
var snakeLen = 1;
var startLen = 3;
var bodyPos = [];
var applePos = new Position(0, 0);

/*
 * Upon clicking the start button, resets head position and starts moving the head to the right.
 */
function startGame() {
  var head = document.getElementById("snake-head");
  head.style.visibility = "visible";
  head.style.top = topStart + 'px';
  head.style.left = leftStart + 'px'; 
  headPos.xPos = 0;
  headPos.yPos = 0;
  keyDown = 39;
  snakeLen = 1;
  bodyPos = [];

  //Remove existing body segments
  const body = document.getElementsByClassName("snake-body");
  while(body.length > 0) {
    body[0].remove();
  }

  //Spawn a starting apple
  applePos = spawnApple();
  document.getElementById("apple").style.visibility = "visible";

  //Start moving the snake
  moveHead(keyDown, head.style.top, head.style.left);
}

/*
 * Saves the last key the user pushed in keyDown
 */
function getDirection(event) {
  if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
    keyDown = event.keyCode;
  }
}

/*
 * Converts the ASCII of the keypress to a string
 */
function convertDirToString(dirKey) {
  var dir; 
  switch (dirKey) {
    case 37:
      dir = "left";
      break;
    case 38:
      dir = "up";
      break;
    case 39:
      dir = "right";
      break;
    case 40:
      dir = "down";
      break;
    default:
  }
  return dir;
}

/*
 * Moves the head one unit in the specified direction, then checks to see if moving again will result in 
 * losing the game. If it doesn't, calls self.
 */ 
function moveHead(dirKey, lastTop, lastLeft) {
  //Convert dir to a string for easier use
  var dir = convertDirToString(dirKey);
  const head = document.getElementById("snake-head");
  const moveX = (dir == "left" || dir == "right");

  //Depending which way the head is moving, either the left or top will need to be altered.
  var pos;
  if (moveX) {
    pos = parseFloat(head.style.left);
  } else {
    pos = parseFloat(head.style.top);
  }

  //Each square is sqWidth px by sqWidth px so find when the circle has moved one square.
  const posPlus = pos + sqWidth;
  const posMinus = pos - sqWidth;

  //If right or down, move "forwards", otherwise move "backwards".
  var animate;
  if (dir == "right" || dir == "down") {
    animate = setInterval(framePlus, 10);
  } else {
    animate = setInterval(frameMinus, 10);
  }

  /*
   * Move head "forwards" one unit (down or right)
   */
  function framePlus() {
    if (pos >= posPlus) {
      //If the head is at its final destination, update pos and xPos/yPos
      pos = posPlus;
      if(snakeLen > 1) moveBody(true, lastTop, lastLeft);
      (moveX) ? headPos.xPos++ : headPos.yPos++;
      clearInterval(animate); 

      //Update the position of the head based on pos
      if (moveX) {
        head.style.left = pos + 'px';
      } else {
        head.style.top = pos + 'px';
      }

      //If the snake hasn't reached length startLen yet, spawn another body segment. 
      if(snakeLen < startLen) {
        addBody(dir, head);
      }

      //Check whether the snake ate the apple
      if (headPos.xPos == applePos.xPos && headPos.yPos == applePos.yPos) {
        applePos = spawnApple();
        addBody(dir, head);
      }

      //If the game hasn't been lost, move head again.
      if(!checkGameLost()) moveHead(keyDown, head.style.top, head.style.left); 
    } else {
      pos += 1.5;
      //Update the position of the head based on pos
      if (moveX) {
        head.style.left = pos + 'px';
      } else {
        head.style.top = pos + 'px';
      }

      if(snakeLen > 1) moveBody(false, lastTop, lastLeft)
    }
  }

  /*
   * Move head "backwards" one unit (up or left)
   */
  function frameMinus() {

    if (pos <= posMinus) {
      //If the head is at its final destination, update pos and xPos/yPos
      pos = posMinus;
      if(snakeLen > 1) moveBody(true, lastTop, lastLeft);
      (moveX) ? headPos.xPos--: headPos.yPos--;
      clearInterval(animate);

      //Update the position of the head based on pos
      if (moveX) {
        head.style.left = pos + 'px';
      } else {
        head.style.top = pos + 'px';
      }

      //If the snake hasn't reached length startLen yet, spawn another body segment. 
      if(snakeLen < startLen) {
        addBody(dir, head);
      }

      //Check whether the snake ate the apple
      if (headPos.xPos == applePos.xPos && headPos.yPos == applePos.yPos) {
        applePos = spawnApple();
        addBody(dir, head);
      }

      //If the game hasn't been lost, move head again.
      if(!checkGameLost()) {  
        moveHead(keyDown, head.style.top, head.style.left); 
      }
    } else {
      pos -= 1.5;

      //Update the position of the head based on pos
      if (moveX) {
        head.style.left = pos + 'px';
      } else {
        head.style.top = pos + 'px';
      }

      if(snakeLen > 1) moveBody(false, lastTop, lastLeft)
    }
  }

  /*
   * Move body one unit. Each body segment will move towards the one before it.
   */
  function moveBody(moveDone, headTop, headLeft) {
    const body = document.getElementsByClassName("snake-body");
    for (var i = 0; i < body.length; i++) {
      if(!moveDone) {
        //Determine which direction to move
        var xDir = false;
        var yDir = false;
        var moveDir = "";
        if(i == 0) {
          bodyPos[0].yPos == headPos.yPos ? xDir = true : yDir = true;
          if(xDir) bodyPos[0].xPos < headPos.xPos ? moveDir = "right" : moveDir = "left";
          if(yDir) bodyPos[0].yPos < headPos.yPos ? moveDir = "down" : moveDir = "up"; 
        } else {
          bodyPos[i].yPos == bodyPos[i-1].yPos ? xDir = true : yDir = true;
          if(xDir) bodyPos[i].xPos < bodyPos[i-1].xPos ? moveDir = "right" : moveDir = "left";
          if(yDir) bodyPos[i].yPos < bodyPos[i-1].yPos ? moveDir = "down" : moveDir = "up"; 
        }
        switch(moveDir) {
          case "left":
            body[i].style.left = parseFloat(body[i].style.left) - 1.5 + 'px'
            break;
          case "up":
            body[i].style.top = parseFloat(body[i].style.top) - 1.5 + 'px'
            break;
          case "right":
            body[i].style.left = parseFloat(body[i].style.left) + 1.5 + 'px'
            break;
          case "down":
            body[i].style.top = parseFloat(body[i].style.top) + 1.5 + 'px'
            break;
        }
      } else {
        if (i == 0) {
          for (var j = 1; j < bodyPos.length; j++) {
            bodyPos[j] = bodyPos[j - 1];
          }
          bodyPos[0] = new Position(headPos.xPos, headPos.yPos);
          body[i].style.top = (headPos.yPos) * 40 + topStart + 'px';
          body[i].style.left = headLeft;
        } else {
          body[i].style.top = (bodyPos[i].yPos) * 40 + topStart + 'px';
          body[i].style.left = (bodyPos[i].xPos) * 40 + leftStart + 'px';
        }
      }
    } 
  }

}

/*
 * Checks whether the user has lost the game, based on their position and which key they have last pressed.
 */
function checkGameLost(){
  var lost = false;
  switch(keyDown) {
    //Left
    case 37:
      lost = headPos.xPos <= 0;
      break;
    //Up
    case 38:
      lost = headPos.yPos <= 0;
      break;
    //Right
    case 39:
      lost = headPos.xPos >=9; 
      break;
    //Down
    case 40:
      lost = headPos.yPos >=9;
      break;
  }

  return lost;
}

/*
 * Adds a new body segment to the snake.
 */
function addBody(dir, head) {
  var newBody = document.createElement("div");
  newBody.className = "snake-body";
  var oldBody;

  //If the length is 1, attach the new body after the head. 
  if(snakeLen == 1) {
    oldBody = head;
  } else {
    //Otherwise, find the last body segment, and attach it after that one. 
    const oldBodies = document.getElementsByClassName("snake-body");
    oldBody = oldBodies[oldBodies.length - 1];
  }

  //Attaching the head in the proper place
  switch(dir) {
    case "left":
      newBody.style.top = oldBody.style.top;
      newBody.style.left = parseFloat(oldBody.style.left) + 40 + 'px';
      break;
    case "up":
      newBody.style.top = parseFloat(oldBody.style.top) + 40 + 'px';
      newBody.style.left = oldBody.style.left;
      break;
    case "right":
      newBody.style.top = oldBody.style.top;
      newBody.style.left = parseFloat(oldBody.style.left) - 40 + 'px';
      break;
    case "up":
      newBody.style.top = parseFloat(oldBody.style.top) - 40 + 'px';
      newBody.style.left = oldBody.style.left;
      break;
  }

  //Attach the new div to the field
  const board = document.getElementById("field-background");
  board.appendChild(newBody); 

  //Add the new position to the array and increment snake length
  if (snakeLen < startLen) {
    bodyPos.push(new Position(0, 0));
  } else {
    bodyPos.push(new Position(bodyPos[bodyPos.length - 1].xPos, bodyPos[bodyPos.length - 1].yPos))
  }
  snakeLen++;
}

function spawnApple() {
  var x = Math.floor(Math.random() * 10);
  var y = Math.floor(Math.random() * 10);
  var apple = new Position(x, y);

  //Make sure the apple is not within the body or head, and respawn if it is.
  var respawn = false;
  (apple.xPos == headPos.xPos && apple.yPos == headPos.yPos) ? respawn = true : respawn = false;
  for (var i = 0; i < bodyPos.length; i++) {
    (apple.xPos == bodyPos[i].xPos && apple.yPos == bodyPos[i].yPos) ? respawn = true : respawn = false;
  }
  if (respawn) {
    apple = spawnApple();
  }

  //Make the apple appear in the correct position.
  const appleHtml = document.getElementById("apple");
  appleHtml.style.top = apple.yPos * 40 + topStart + 'px';
  appleHtml.style.left = apple.xPos * 40 + leftStart + 'px';

  return apple;
};
