var fs = require('fs');

/*
//readFileSync  동기적인 명령  return 값이 있다
console.log('a');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('c');
*/


//readFile  비동기적인 명령, return 값이 없다, 파일을 읽으면 반환함
console.log('a');
fs.readFile('syntax/sample.txt', 'utf8', function(err,result){    //얘는 얘대로 동작하다가 함수안의 코드가 나중에 실행된다, callback  나중에 전화해
  console.log(result);
});

console.log('c');
