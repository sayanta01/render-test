const { EventEmitter } = require("events");
const emitter = new EventEmitter();

// listen to the event
emitter.on("lunch", () => {
  console.log("yum"); // callback
});

// trigger the event
emitter.emit("lunch");
