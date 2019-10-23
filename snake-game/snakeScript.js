var keyDown = 39;
var posX = 0;
var posY = 0;
var snakeLen = 1;
var bodyPos = [];

/*
 * Upon clicking the start button, resets head position and starts moving the head to the right.
 */
function startGame() {
  var head = document.getElementById("snake-head");
  head.style.visibility = "visible";
  head.style.top = "3px";
  head.style.left = "6px"; 
  posX = 0;  
  posY = 0;
  keyDown = 39;
  snakeLen = 1;

  //Remove existing body segments
  const body = document.getElementsByClassName("snake-body");
  for(var i = 0; i < body.length; i++) {
    body[0].remove();
  }
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

  //Each square is 40px by 40px so find when the circle has moved one square.
  const posPlus = pos + 40;
  const posMinus = pos - 40;

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
    if (pos > posPlus) {
      //If the head is at its final destination, update pos and posX/posY
      pos = posPlus;
      if(snakeLen > 1) moveBody(true, lastTop, lastLeft);
      (moveX) ? posX++ : posY++;
      clearInterval(animate); 

      //Update the position of the head based on pos
      if (moveX) {
        head.style.left = pos + 'px';
      } else {
        head.style.top = pos + 'px';
      }

      //If the snake hasn't reached length 5 yet, spawn another body segment. 
      if(snakeLen< 2) {
        addBody(dir, head);
        snakeLen++;
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

    if (pos < posMinus) {
      //If the head is at its final destination, update pos and posX/posY
      pos = posMinus;
      if(snakeLen > 1) moveBody(true, lastTop, lastLeft);
      (moveX) ? posX--: posY--;
      clearInterval(animate);

      //Update the position of the head based on pos
      if (moveX) {
        head.style.left = pos + 'px';
      } else {
        head.style.top = pos + 'px';
      }

      //If the snake hasn't reached length 5 yet, spawn another body segment. 
      if(snakeLen< 2) {
        addBody(dir, head);
        snakeLen++;
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
        var lastBody;
        if(i == 0) {
          body[i].style.top == headTop ? xDir = true : yDir = true;
          if(xDir) parseFloat(body[i].style.left) < parseFloat(headLeft) ? moveDir = "right" : moveDir = "left";
          if(yDir) parseFloat(body[i].style.top) < parseFloat(headTop) ? moveDir = "down" : moveDir = "up"; 
        } else {
          lastBody = body[i-1];
          body[i].style.top == lastBody.style.top ? xDir =true : yDir = true;
          if(xDir) parseFloat(body[i].style.left) < parseFloat(lastBody.style.left) ? moveDir = "right" : moveDir = "left";
          if(yDir) parseFloat(body[i].style.top) < parseFloat(lastBody.style.top) ? moveDir = "down" : moveDir = "up"; 
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
        if(i==0) {
          body[i].style.top = headTop;
          body[i].style.left = headLeft;
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
      lost = posX <= 0;
      break;
    //Up
    case 38:
      lost = posY <= 0;
      break;
    //Right
    case 39:
      lost = posX >=9; 
      break;
    //Down
    case 40:
      lost = posY >=9;
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
};
