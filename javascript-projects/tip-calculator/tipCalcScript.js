function calculateTip() {
  const bill = document.getElementById("bill").value;
  const percent = document.getElementById("percent").value;
  const billWarning = document.getElementById("billWarning");
  const percentWarning = document.getElementById("percentWarning");
  var printTip = true;
  
  if (isNaN(bill)) {
    billWarning.innerText = "Please enter a valid number";
    printTip = false;
  } else {
    billWarning.innerText = "";
  }
  if (isNaN(percent)) {
    percentWarning.innerText = "Please enter a valid number";
    printTip = false;
  } else {
    percentWarning.innerText = "";
  }
  
  if (printTip) {
    var tip = bill * (percent/100.);
    document.getElementById("tip").innerText = "Tip $" + tip.toFixed(2);
  }
}

function enterPercent(event) {
  const x = event.which || event.keyCode();
  if (x===13) {
    calculateTip();
  }
}

