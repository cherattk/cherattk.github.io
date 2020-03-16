const EventSet = require('eventset');

const AppEvent = EventSet.Topic('app.event');

// AppEvent.addEvent("save-form");
// AppEvent.addEvent("fetch-list");
// AppEvent.addEvent("data-change");
// AppEvent.addEvent("navigate-list");

AppEvent.addEvent("edit-item");
AppEvent.addEvent("select-item");
AppEvent.addEvent("modal-state");
AppEvent.addEvent("init-app");
AppEvent.addEvent("update-task-list");

module.exports = {
    AppEvent
}