function startGame() {
  var head = document.getElementById("snake-head");
  head.style.visibility = "visible";
  moveHead();
}

function moveHead() {
  const vmin = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
  const head = document.getElementById("snake-head");
  const headLeft = getComputedStyle(head).left;
  var pos = parseFloat(headLeft);
  //Each square is 7.5vmin by 7.5vmin, so find when the circle has moved one square.
  const posPlus = vmin * 0.075 + pos;
  var id = setInterval(frame, 10);

  function frame( ) {
    if (pos > posPlus) {
      pos = posPlus;
      clearInterval(id);
    } else {
      pos+=1.5;
    }
    head.style.left = pos + 'px';
  }
  
}
