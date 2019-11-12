function pressKey(keyLetter) {
  $("#key"+keyLetter).css("background-color","grey");
}

function releaseKey(keyLetter) {
  $("#key"+keyLetter).css("background-color","white");
}
