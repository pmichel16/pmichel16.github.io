function solve24 (numStr) {
  var nums = numStr.split("");
  nums = nums.map((x => Number.parseFloat(x).toFixed(0)));
  
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
solve24("4878");
