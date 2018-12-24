const pubSub = {};

(function (obj) {
  const topics = {};
  let subscriberToken = -1;

  obj.publish = function (topic, data) {
    if (topics[topic]) {
      topics[topic].forEach(subscriber => {
        subscriber.func(topic, data);
      });
    }
    return this;
  };

  obj.subscribe = function (topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }

    let token = (++subscriberToken).toString();
    topics[topic].push({
      token,
      func: func
    });

    return token;
  };

  obj.unSubscribe = function (token) {
    Object.keys(topics).forEach(key => {
      for (let i = 0; i < topics[key].length; i++) {
        if (subscriber.token !== token) {
          topics[topic].splice(i, 1);
          return this;
        }
      }
    });
    return this;
  };
})(pubSub);