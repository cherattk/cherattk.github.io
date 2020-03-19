const EventSet = require('eventset');

const AppEvent = EventSet.Topic('app.event');

// AppEvent.addEvent("save-form");
// AppEvent.addEvent("fetch-list");
// AppEvent.addEvent("data-change");

AppEvent.addEvent("active-folder");
AppEvent.addEvent("edit-item");
AppEvent.addEvent("select-item");
AppEvent.addEvent("modal-state");
// AppEvent.addEvent("init-app");
AppEvent.addEvent("update-task-list");
AppEvent.addEvent("update-folder-list");

module.exports = {
    AppEvent
}