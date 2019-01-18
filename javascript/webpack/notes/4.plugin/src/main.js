console.log('this is just a demo.');

var production = PRODUCTION;
var version  = VERSION;
console.log(production, version);

function sayHi(name) {
  var message = 'hi ' + name;
  debugger;
  console.log(message);
}

sayHi('jonge');
