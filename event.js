const EventSet = require('eventset');

const customEvent = EventSet.Topic('custom.event');

customEvent.addEvent("save-task-form");
customEvent.addEvent("modal-state");

module.exports = {
    customEvent
}