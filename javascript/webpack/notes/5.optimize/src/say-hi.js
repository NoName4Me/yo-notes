exports.sayHi = () => {
  let h1 = document.createElement('h1');
  h1.innerText = 'Hello Webpack';
  h1.className = 'styled_h1';
  document.body.appendChild(h1);
  
  let btnEl = document.createElement('button');
  btnEl.onclick = ()=>{
    const { printMsg } = import('./createMsg');
    printMsg();
  }
}
