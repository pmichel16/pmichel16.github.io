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
  
  //Test each operation on the permutations.
  for (curPerm of permutations) {
    var ops = ['+','+','+']
    var found = false;
    var solution = "No solution found";
    for(var i = 0; i < 48; i++) {
      if(evaluate(curPerm, ops) === 24) {
        solution = writeSol(curPerm, ops);
        $("#result-printer").text(solution);
        return;
      } else {
        ops = updateOps(ops);
      }
    }
    const test=1;
  }
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

/*
 * Evaluate the current array with the given operations. The middle operation is evaluated first, and combines the two outer operations. 
 */
function evaluate(numArr, opArr) {
  const left = evalPair(parseFloat(numArr[0]),parseFloat(numArr[1]),opArr[0]);
  const right = evalPair(parseFloat(numArr[2]),parseFloat(numArr[3]),opArr[2]);
  
  return evalPair(left,right,opArr[1]);
}

/* 
 * Evaluates the mathematical expression of the pair of numbers combined by op.
 */
function evalPair(num1, num2, op) {
var eval = 0;
switch(op) {
    case '+': 
      eval = num1+num2;
      break;
    case '-':
      eval = num1-num2;
      break;
    case '*':
      eval = num1*num2;
      break;
    case '/':
      eval = num1/num2;
      break;
  }
  return eval;
}

function updateOps(opsArr) {
  if(opsArr.length > 0) {
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

/* 
 * Converts the calculated solution to a string.
 */
function writeSol(numArr, opArr) {
  const left = '(' + writePair(numArr[0],numArr[1],opArr[0]) + ')'; 
  const right = '(' + writePair(numArr[2],numArr[3],opArr[2]) + ')';

  return writePair(left, right, opArr[1]);
}

function writePair(num1, num2, op) {
  var result = "";
  switch(op) {
    case '+':
      result = num1 + '+' + num2;
      break;
    case '-':
      result = num1 + '-' + num2;
      break;
    case '*':
      result = num1 + '*' + num2;
      break;
    case '/':
      result = num1 + '/' + num2;
      break;
  }
  return result;
}
