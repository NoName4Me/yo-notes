const messageLogger = (topic, data) => {
  console.log('Logging: ' + topic + ': ' + data);
}

pubSub.subscribe('newMessage', messageLogger);
pubSub.subscribe('deleteMessage', messageLogger);


pubSub.publish('newMessage', 'You have a new message').publish('deleteMessage', 'deleted a message!');

pubSub.publish('newMessage', 'You have another new message')