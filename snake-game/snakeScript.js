function startGame() {
  if (confirm('Press OK to begin!')) {
    var head = document.getElementById("snake-head");
    head.style.visibility = "visible";
    moveHead();
  }
}

function moveHead() {
  const head = document.getElementById("snake-head");
  const headStyle = getComputedStyle(head);
  const headLeft = headStyle.left;
  var pos = parseFloat(headStyle.left);
  var id = setInterval(frame,5);

  alert(head.style.left);

  function frame( ) {
    if (pos > 40) {
      clearInterval(id);
    } else {
      pos+=0.5;
      head.style.left = pos + 'px';
    }
  }

  alert(head.style.left);
  
}
