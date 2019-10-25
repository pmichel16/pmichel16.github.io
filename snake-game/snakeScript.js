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
var startLen = 5;
var speed = 1.5;
var bodyPos = [];
var applePos = new Position(0, 0);
var playing = false;

/*
 * Upon clicking the start button, resets head position and starts moving the head to the right.
 */
function startGame() {
  if (!playing) {
    var head = document.getElementById("snake-head");
    head.style.visibility = "visible";
    head.style.top = topStart + 'px';
    head.style.left = leftStart + 'px';
    headPos.xPos = 0;
    headPos.yPos = 0;
    document.getElementById("error-message").innerText = "";
    keyDown = 39;
    snakeLen = 1;
    startLen = getLength();
    speed = getSpeed();
    bodyPos = [];
    playing = true;

    //Remove existing body segments
    const body = document.getElementsByClassName("snake-body");
    while (body.length > 0) {
      body[0].remove();
    }

    //Spawn a starting apple
    applePos = spawnApple();
    document.getElementById("apple").style.visibility = "visible";

    //Start moving the snake
    moveHead(keyDown, new Position(0, 0));
  }
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
 * Returns a value for speed based on which radio button is selected.
 */
function getSpeed() {
  var speed = 0;
  if (document.getElementById("rSlow").checked) {
    speed = 0.75;
  } else if (document.getElementById("rMed").checked) {
    speed = 1.5;
  } else if (document.getElementById("rFast").checked) {
    speed = 3;
  } else if (document.getElementById("rLight").checked) {
    speed = 8;
  }
  return speed;
}

/*
 * If a positive number was typed in lenBox, returns the number; otherwise returns 5 (default length).
 */
function getLength() {
  var len = 5;
  const inputLen = (document.getElementById("lenBox").value);
  //Number between 1 and 99.
  if (inputLen.match(/^[1-9][0-9]{0,1}$/)) {
    len = Number(inputLen);
    document.getElementById("error-message").innerText = "";
  } else if (inputLen === "") {
    document.getElementById("error-message").innerText = "";
  } else {
    document.getElementById("error-message").innerText = "Error - invalid entry for length. Using default length 5."
  }
  return len;
}

/*
 * Moves the head one unit in the specified direction, then checks to see if moving again will result in 
 * losing the game. If it doesn't, calls self.
 */ 
function moveHead(dirKey, prevBodyEnd) {
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
      //Update pos to the final destination
      pos = posPlus;

      //Update the CSS position of the head
      updateHeadCSS(head,pos,moveX);

      //Update snake position and move body
      updateSnake(true);

    } else {
      pos += speed;
      //Update the CSS position of the head based on pos
      updateHeadCSS(head,pos,moveX);

      //Move the rest of the body, if it exists.
      if(snakeLen > 1) moveBody(false);
    }
  }

  /*
   * Move head "backwards" one unit (up or left)
   */
  function frameMinus() {

    if (pos <= posMinus) {
      //Update pos to the final destination
      pos = posMinus;
      
      //Update the CSS position of the head
      updateHeadCSS(head,pos,moveX);

      //Update snake length and move body
      updateSnake(false);

    } else {
      pos -= speed;
      //Update the position of the head based on pos
      updateHeadCSS(head,pos,moveX);

      //Move the body, if it exists.
      if(snakeLen > 1) moveBody(false);
    }
  }
  
  /*
   * After the snake has moved one unit, updates information about position of the head and body.
   */
  function updateSnake(moveForward) {
      
      //Update head position and move body
      prevBodyEnd = bodyPos[bodyPos.length-1];
      if(snakeLen > 1) moveBody(true);
      if(moveForward) {
        (moveX) ? headPos.xPos++ : headPos.yPos++;
      } else {
        (moveX) ? headPos.xPos-- : headPos.yPos--;
      }
      clearInterval(animate); 
      
      //If the snake hasn't reached length startLen yet, spawn another body segment. 
      if(snakeLen < startLen) {
        addBody(dir, head);
      }

      //Check whether the snake ate the apple
      if (headPos.xPos == applePos.xPos && headPos.yPos == applePos.yPos) {
        applePos = spawnApple();
        //If the body hasn't reached startLen yet, increment startLen. Otherwise, add another body.
        (snakeLen >= startLen) ? addBody(dir, head, prevBodyEnd) : startLen++;
      }

      //Check whether the game has been won
    if (snakeLen === 100) {
      document.getElementById("error-message").innerText="Congratulations, you win! Click options to try a faster speed."
    }
      //If the game hasn't been lost, move head again.
      if(!checkGameLost()) moveHead(keyDown, prevBodyEnd); 
  }

}

/*
 * Updates CSS position of head based on pos
 */
function updateHeadCSS(head,pos, moveX) {
  if (moveX) {
    head.style.left = pos + 'px';
  } else {
    head.style.top = pos + 'px';
  } 
}

/*
 * Move body one unit. Each body segment will move towards the one before it.
 */
function moveBody(moveDone) {
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
          body[i].style.left = parseFloat(body[i].style.left) - speed + 'px'
          break;
        case "up":
          body[i].style.top = parseFloat(body[i].style.top) - speed + 'px'
          break;
        case "right":
          body[i].style.left = parseFloat(body[i].style.left) + speed + 'px'
          break;
        case "down":
          body[i].style.top = parseFloat(body[i].style.top) + speed + 'px'
          break;
      }
    } else {
      if (i == 0) {
        for (var j = bodyPos.length - 1; j > 0; j--) {
          bodyPos[j] = new Position(bodyPos[j - 1].xPos, bodyPos[j - 1].yPos);
        }
        bodyPos[0] = new Position(headPos.xPos, headPos.yPos);
        body[i].style.top = (headPos.yPos) * 40 + topStart + 'px';
        body[i].style.left = (headPos.xPos) * 40 + leftStart + 'px';
      } else {
        body[i].style.top = (bodyPos[i].yPos) * 40 + topStart + 'px';
        body[i].style.left = (bodyPos[i].xPos) * 40 + leftStart + 'px';
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
      //Check for out of bounds
      lost = headPos.xPos <= 0;
      //Check for body collisions
      var i = 0;
      while (i < bodyPos.length && !lost) {
        if ((bodyPos[i].xPos === headPos.xPos - 1) && (bodyPos[i].yPos === headPos.yPos)) {
          lost = true;
        }
        i++;
      }
      break;
    //Up
    case 38:
      lost = headPos.yPos <= 0;
      var i = 0;
      while (i < bodyPos.length && !lost) {
        if ((bodyPos[i].xPos === headPos.xPos) && (bodyPos[i].yPos === headPos.yPos - 1)) {
          lost = true;
        }
        i++;
      }
      break;
    //Right
    case 39:
      lost = headPos.xPos >= 9;
      var i = 0;
      while (i < bodyPos.length && !lost) {
        if ((bodyPos[i].xPos === headPos.xPos+1) && (bodyPos[i].yPos === headPos.yPos)) {
          lost = true;
        }
        i++;
      }
      break;
    //Down
    case 40:
      lost = headPos.yPos >= 9;
      var i = 0;
      while (i < bodyPos.length && !lost) {
        if ((bodyPos[i].xPos === headPos.xPos) && (bodyPos[i].yPos === headPos.yPos+1)) {
          lost = true;
        }
        i++;
      }
      break;
  }
  playing = !lost;
  if (lost) {
    document.getElementById("error-message").innerText = "You lose! Score: " + snakeLen.toString();
  }
  return lost;
}

/*
 * Adds a new body segment to the snake.
 */
function addBody(dir, head, pos = new Position(0,0)) {
  var newBody = document.createElement("div");
  newBody.className = "snake-body";

  //Attaching the head in the proper place
  newBody.style.top = (pos.yPos) * 40 + topStart + 'px';
  newBody.style.left = (pos.xPos) * 40 + leftStart + 'px';
 
  //Attach the new div to the field
  const board = document.getElementById("field-background");
  board.appendChild(newBody); 

  //Add the new position to the array and increment snake length
  bodyPos.push(pos);
  snakeLen++;
}

/*
 * Spawns a new apple and makes sure it is not within the snake body or head.
 */
function spawnApple() {
  var x = Math.floor(Math.random() * 10);
  var y = Math.floor(Math.random() * 10);
  var apple = new Position(x, y);

  //Make sure the apple is not within the body or head, and respawn if it is.
  var respawn = false;
  if (apple.xPos == headPos.xPos && apple.yPos == headPos.yPos) respawn = true;
  for (var i = 0; i < bodyPos.length; i++) {
    if (apple.xPos == bodyPos[i].xPos && apple.yPos == bodyPos[i].yPos) respawn = true;
  }
  if (respawn) {
    apple = spawnApple();
  }

  //Make the apple appear in the correct position.
  const appleHtml = document.getElementById("apple");
  appleHtml.style.top = apple.yPos * 40 + topStart + 'px';
  appleHtml.style.left = apple.xPos * 40 + leftStart + 'px';

  return apple;
}

/*
 * Show options screen.
 */
function showOptions() {
  if (!playing) {
    var opScreen = document.getElementById("option-screen");
    opScreen.style.visibility === "visible" ? opScreen.style.visibility = "hidden" : opScreen.style.visibility = "visible";
  }
}
