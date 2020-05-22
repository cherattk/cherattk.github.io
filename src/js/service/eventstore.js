const EventSet = require('eventset');

const AppEvent = EventSet.Topic('app.event');

AppEvent.addEvent("active-folder");
AppEvent.addEvent("edit-folder");
AppEvent.addEvent("add-folder");
AppEvent.addEvent("update-folder");
AppEvent.addEvent("error-default-folder-action");

////////////////////////////////////////////
AppEvent.addEvent("get-task-detail");
AppEvent.addEvent("close-task-detail");

// AppEvent.addEvent("edit-item");
// AppEvent.addEvent("select-item");
// AppEvent.addEvent("modal-state");
AppEvent.addEvent("update-task");
// AppEvent.addEvent("update-task");


module.exports = {
    AppEvent
}