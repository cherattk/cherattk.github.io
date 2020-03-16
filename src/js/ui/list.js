const AppEvent = require('../service/eventstore').AppEvent;

const DataManager = require('../service/datamanager');

var __container;
var __state = {
  list: [], // list of item
};

const TaskList = {

  getElement: function (id) {
    return __container.find(`li[data-task-id="${id}"]`);
  },

  init: function (anchorID) {

    __container = $("#" + anchorID).html(`<ul class="list">${this.emptyState()}</ul>`);

    __container.click(function (event) {
      switch (event.target.dataset.action) {
        case "edit-item":
          let task = __state.list[event.target.dataset.taskIndex];
          AppEvent.dispatch("edit-item", {
            item: task
          });
          break;
        case "done":
        case "todo":
          let update_task = __state.list[event.target.dataset.taskIndex];
          update_task.task_label = event.target.dataset.action;
          DataManager.setTask(update_task);
          break;
        case "delete":
          let rm_task = __state.list[event.target.dataset.taskIndex];
          DataManager.removeTask([rm_task]);
          break;
        default: break;
      }
    });

    AppEvent.addListener("init-app", function () {
      TaskList.renderListItem();
    });
    AppEvent.addListener("update-task-list", function () {
      TaskList.renderListItem();
    });

    this.renderListItem();
  },

  emptyState: function () {
    return `<li class="empty-list">Empty List</li>`;
  },

  renderListItem: function () {
    __state.list = DataManager.getTaskList().reverse();
    var content = "";
    if (!__state.list.length) {
      content = this.emptyState();
    }
    else {
      __state.list.map(function (_item, index) {
        let isDone = _item.task_label === "done";
        content += `<li class="${_item.task_label}" data-task-id="${_item.task_id}" data-task-index="${index}">
                <!--
                <div class="checkbox">
                  <input id="item-${_item.task_id}"
                        data-item-id="${_item.task_id}"
                        data-action="select-item" data-task-index="${index}"
                        type="checkbox"
                        ${isDone ? "checked" : ''}/>
                  <label for="item-${_item.task_id}">
                    <span></span>
                  </label>
                </div>              
                -->
                  <p>${index + 1} - ${_item.task_body}</p>
                  <!---->
                  <div class="item-action">
                  <button class="btn btn-primary btn-sm" data-action="edit-item" data-task-index="${index}">Edit</button>
                  <button class="btn btn-primary btn-sm" data-action="${(isDone ? "todo" : "done")}" data-task-index="${index}">
                  ${(isDone ? "Undo" : "Done")}
                  </button>
                  <button class="btn btn-danger btn-sm" data-action="delete" data-task-index="${index}">delete</button>                  
                  </div>
                </li>`;
      });
    }

    __container.html(`<ul class="list">${content}</ul>`);

  }
}

module.exports = TaskList;