const AppEvent = require('../app/eventstore').AppEvent;

const __config = {
  tab: [
    { name: "todo", label: "To Do", style: "yellow" },
    { name: "doing", label: "In progress", style: "blue" },
    { name: "done", label: "Done", style: "green" },
    { name: "delete", label: "Delete", style: "red" }
  ],
  // used to define type of available action
  action: ["todo", "doing", "done", "delete"]
};

function ActionBar() {

  var __element;
  var __state = {
    list: [],
    itemStatus: ""
  };

  this.init = function (anchorID) {

    __element = document.getElementById(anchorID);

    this.render();
    __element.onclick = this.action;

    AppEvent.addListener("select-item", this.updateItemList.bind(this));

    AppEvent.addListener("navigate-list", this.setItemStatus.bind(this));

  }

  this.setItemStatus = function (customEvent) {
    __state.itemStatus = customEvent.eventMessage.stage;
    this.render();
  }

  this.updateItemList = function (event) {

    if (typeof event.eventMessage.id !== "undefined") {
      let id = event.eventMessage.id;
      let checked = event.eventMessage.checked;
      let index = __state.list.indexOf(id);
      if (checked /* selected */ && index < 0 /* item is not in the array */) {
        __state.list.push(id);
        return;
      }
      if (!checked /* unselected */ && index >= 0 /* item is in the array */) {
        __state.list.splice(index, 1);
        return;
      }
    }
    if (typeof event.eventMessage.list !== "undefined") {
      __state.list = event.eventMessage.list;
    }

  }

  this.action = function (domEvent) {
    var actionName = domEvent.target.dataset.action;
    var eventMessage;

    if (__state.list.length < 0 || __config.action.indexOf(actionName) < 0) {
      return;
    }
    if (actionName === "delete") {
      eventMessage = {
        action: "remove",
        name: "task",
        items: __state.list.slice()
      }
    }
    else {
      // for actions : {"todo" , "doing" , "done"}
      eventMessage = {
        action: "update-stage",
        name: "task",
        items: __state.list.slice(),
        value: actionName
      }
    }

    AppEvent.dispatch("update-item", eventMessage);
    __state.list = [];
  }

  this.render = function () {

    var actionList = "";
    __config.tab.map(function (item) {
      if (item.name !== __state.itemStatus) {
        actionList += `<button type="button" data-action="${item.name}" 
                                  class="btn btn-sm btn-${item.style}">
                            ${item.label}
                          </button>`;
      }
    });
    __element.innerHTML = `                
                <div class="task-action-bar">
                  
                  <div class="task-action-group">
                    <label>Status : </label>                
                      ${actionList}
                  </div>
                </div>` ;
  }
}

module.exports = new ActionBar();