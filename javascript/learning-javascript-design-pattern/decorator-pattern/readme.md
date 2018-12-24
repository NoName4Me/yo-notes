# Decorator Pattern

装饰器模式，与 mixin 模式有点儿类似，但装饰器不会修改原型，因此子类并不会受影响。

```js
const Car = function(name) {
  this.name = name;

  this.run = function() {
    console.log(`car ${this.name} runs.`);
  }
}

const addSpeedDecorator = function(car, speed) {
  car.speed = speed;

  // override
  car.run = function() {
    console.log(`car ${car.name} runs at speed ${car.speed}.`);
  }
}

// test
const car = new Car('FLASH');
car.run();
addSpeedDecorator(car, '120km/h');
car.run();
```

