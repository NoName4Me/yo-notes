class ObserverList {
  constructor() {
    this.observerList = [];
  }

  add (obj) {
    return this.observerList.push(obj);
  }

  get (index) {
    return this.observerList[index];
  }

  count () {
    return this.observerList.length;
  }

  find (obj, startIndex = 0) {
    for (let i = startIndex; i < this.observerList.length; i++) {
      if (obj === this.observerList[i]) {
        return i;
      }
    }
  }

  removeAt (index) {
    return this.observerList.splice(index, 1);
  }
}

class Subject {
  constructor() {
    this.observers = new ObserverList();
  }

  addObserver (observer) {
    return this.observers.add(observer);
  }

  removeObserver (observer) {
    return this.observers.removeAt(this.observerList.find(observer));
  }

  notify (data) {
    for (let i = 0; i < this.observers.count(); i++) {
      this.observers.get(i).update(data);
    }
  }
}

// playground
function extend (target, source) {
  for (let key in source) {
    target[key] = source[key];
  }
  Object.getOwnPropertyNames(source.__proto__).forEach(key => {
    target[key] = source[key];
  });
}

let controller = document.getElementById('mainCheckbox');
let addBtn = document.getElementById('addNewObserver');
let container = document.getElementById('observerContainer');

extend(controller, new Subject());


controller.onclick = function () {
  controller.notify(this.checked);
}
addBtn.onclick = () => {
  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.update = function (data) {
    this.checked = data;
  }
  controller.addObserver(checkBox);
  container.appendChild(checkBox);
}