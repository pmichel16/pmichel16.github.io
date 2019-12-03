function validate(){
  const inputs = document.getElementsByClassName("num-input");
  $(".error-msg").css("visibility","hidden");
  var valid = true;
  for(var i = 0; i < inputs.length; i++) {
    if(isNaN(parseInt(inputs[i].value)) || parseInt(inputs[i].value) <= 0) {
      valid = false;
      $(".error-msg").eq(i).css("visibility","visible");
    }
  }
  return valid;
}

function solve24() {
  //First, get all permutations of the inputted numbers
  const nums = [$("#num1")[0].value,$("#num2")[0].value,$("#num3")[0].value,$("#num4")[0].value];
  const permutations = permute(nums);
  
  //Iterate through each operation
  var ops = ['+','+','+']
  var found = false;
  var solution = "No solution found";
  while(!found && ops != ['/','/','/']) {
    if(evaluate(nums, ops) === 24) {
      found = true;
      solution = writeSol(nums, ops);
      console.log(ops);
    } else {
      ops = updateOps(ops);
    }
  }

  function evaluate(numArr, opArr) {
    var evaled = 0;
    const num1 = parseFloat(numArr[0]);
    var num2 = parseFloat(numArr[1]);
    if(numArr.length != 2) {
      var opShifted = opArr.shift();
      var numShifted = numArr.shift();
      num2 = parseFloat(evaluate(numArr, opArr));
      numArr.unshift(numShifted);
      opArr.unshift(opShifted);
    }
    switch(opArr[0]) {
      case '+': 
        evaled = num1+num2;
        break;
      case '-':
        evaled = num1-num2;
        break;
      case '*':
        evaled = num1*num2;
        break;
      case '/':
        evaled = num1/num2;
    }
    return evaled
  }

  function updateOps(opsArr) {
    if(opsArr.length > 1) {
      switch(opsArr[opsArr.length - 1]) {
        case '+':
          opsArr[opsArr.length - 1] = '-';
          break;
        case '-':
          opsArr[opsArr.length - 1] = '*';
          break;
        case '*':
          opsArr[opsArr.length - 1] = '/';
          break;
        case '/':
          opsArr.pop();
          opsArr = updateOps(opsArr);
          opsArr.push('+');
          break;
      }
    }
    return opsArr;
  }

  function writeSol(numArr, opArr) {
    var result = "";
    var second = "";
    if(opArr.length ===1) {
      second = numArr[1];
    } else {
      var numShift = numArr.shift();
      var opShift = opArr.shift();
      second = '(' + writeSol(numArr, opArr) + ')';
      numArr.unshift(numShift);
      opArr.unshift(opShift);
    } 
    switch(opArr[0]) {
        case '+':
          result = numArr[0] + '+' + second;
          break;
        case '-':
          result = numArr[0] + '-' + second;
          break;
        case '*':
          result = numArr[0] + '*' + second;
          break;
        case '/':
          result = numArr[0] + '/' + second;
          break;
      }
      return result;
  }

  return true;
}


/*
 * Find all permutations of the given array.
 */  
function permute(arr){
  var allPerms = [];
  if(arr.length < 2) {
    allPerms = [arr];
  }
  else {
    //Put each term at the beginning, then follow it with each permute of the rest
    for(var i = 0; i < arr.length; i++) {
      var firstTerm = arr.splice(i,1)[0];
      var nextPermutes = permute(arr);  
      for (perm of nextPermutes) {
        var newPerm = [firstTerm, ...perm];
        allPerms.push([...newPerm]);
      }
    arr.splice(i,0,firstTerm);
    }
  }
  return allPerms;
};
