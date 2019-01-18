import './style.css';
import _ from 'lodash';
const { sayHi } = require('./say-hi');

let obj = { name: { last: 'Jone', first: 'Den' } };
_.get(obj, 'name.last');
sayHi();

