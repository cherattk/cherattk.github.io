const EventSet = require('eventset');

const AppEvent = EventSet.Topic('app.event');

AppEvent.addEvent("save-form");
AppEvent.addEvent("fetch-list");
AppEvent.addEvent("data-change");
AppEvent.addEvent("modal-state");
AppEvent.addEvent("select-item");
AppEvent.addEvent("remove-item");

module.exports = {
    AppEvent
}