const EventSet = require('eventset');

const AppEvent = EventSet.Topic('app.event');

AppEvent.addEvent("active-folder");
AppEvent.addEvent("edit-folder");
AppEvent.addEvent("add-folder");
AppEvent.addEvent("update-folder-list");
AppEvent.addEvent("error-default-folder-action");

////////////////////////////////////////////
AppEvent.addEvent("edit-item");
AppEvent.addEvent("select-item");
AppEvent.addEvent("modal-state");
AppEvent.addEvent("update-task-list");
AppEvent.addEvent("update-task");


module.exports = {
    AppEvent
}