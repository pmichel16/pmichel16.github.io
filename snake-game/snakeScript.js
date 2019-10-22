function startGame() {
  var head = document.getElementById("snake-head");
  head.style.visibility = "visible";
  moveHead();
}

function getDirection(event) {
  if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
    moveHead(event.keyCode);
  }
}

function moveHead(dirKey = 39) {
  var dir = new String;
  //Convert the keypress value to a string for changing properties later.
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
  const vmin = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
  const head = document.getElementById("snake-head");
  var headEdge = new Object;
  const moveX = (dir == "left" || dir == "right");
  if (moveX) {
    headEdge = getComputedStyle(head).left;
  } else {
    headEdge = getComputedStyle(head).top;
  }
  var pos = parseFloat(headEdge);
  //Each square is 7.5vmin by 7.5vmin, so find when the circle has moved one square.
  const posPlus = pos + vmin * 0.075;
  const posMinus = pos - vmin * 0.075;

  //If right or down, move "forwards", otherwise move "backwards".
  var animate;
  if (dir == "right" || dir == "down") {
    animate = setInterval(framePlus, 10);
  } else {
    animate = setInterval(frameMinus, 10);
  }

  function framePlus() {
    if (pos > posPlus) {
      pos = posPlus;
      clearInterval(animate);
    } else {
      pos += 1.5;
    }
    //Update the position of the head based on pos
    if (moveX) {
      head.style.left = pos + 'px';
    } else {
      head.style.top = pos + 'px';
    }
  }
  function frameMinus() {
    if (pos < posMinus) {
      pos = posMinus;
      clearInterval(animate);
    } else {
      pos -= 1.5;
    }
    //Update the position of the head based on pos
    if (moveX) {
      head.style.left = pos + 'px';
    } else {
      head.style.top = pos + 'px';
    }
  }

};
  
