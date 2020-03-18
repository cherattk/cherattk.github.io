const AppEvent = require('../service/eventstore').AppEvent;

const DataManager = require('../service/datamanager');

var __container;
var __state = {
  list: [], // list of item
  folderId : null
};

const TaskList = {

  editItem: function (item, itemIndex) {
    var li = __container.find(`li[data-task-index="${itemIndex}"]`);
    li.addClass("hide-content");
    var itemInput = __container.find(`input[id="item-${itemIndex}"]`);
    itemInput.show();
    itemInput.val(item.task_body);
    itemInput.focus();
    itemInput.blur(function (e) {
      DataManager.setItem('task' , Object.assign(item, { task_body: e.target.value }));
      itemInput.hide();
      li.removeClass("hide-content");
    });
  },

  init: function (anchorID) {

    __container = $("#" + anchorID).html(`<ul class="list">${this.emptyState()}</ul>`);

    var self = this;
    __container.click(function (event) {
      switch (event.target.dataset.action) {
        case "edit-item":
          let task = __state.list[event.target.dataset.taskIndex];
          if (task.task_label === "completed") {
            alert("the completed task can not be modified");
            return;
          }
          self.editItem(task, event.target.dataset.taskIndex);
          break;
        case "completed":
          let update_task = __state.list[event.target.dataset.taskIndex];
          update_task.task_label = event.target.checked ? "completed" : "todo";
          DataManager.setItem('task' , update_task);
          break;
        case "delete":
          let rm_task = __state.list[event.target.dataset.taskIndex];
          DataManager.removeItem('task' , [rm_task]);
          break;
        default: break;
      }
    });

    AppEvent.addListener("active-folder", function (event) {
      __state.folderId = event.message.folder_id;
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
    __state.list = DataManager.getList('task' ,  __state.folderId ).reverse();
    var content = "";
    if (!__state.list.length) {
      content = this.emptyState();
    }
    else {
      __state.list.map(function (_item, index) {
        let isDone = _item.task_label === "completed";
        content += `<li class="${_item.task_label}" data-task-id="${_item.id}" data-task-index="${index}">
                <!--          
                -->
                <div class="checkbox" title="Mark task as completed">
                  <input id="checkbox-${_item.id}"
                          data-action="completed" data-task-index="${index}"
                        type="checkbox"
                        ${isDone ? "checked" : ''}/>
                  <label for="checkbox-${_item.id}">
                    <span></span>
                  </label>
                </div>    
                  <p>${index + 1} - ${_item.task_body}</p>
                  <input id="item-${index}" type="text" name="task_body"/>
                  <!---->
                  <div class="item-action">
                  <button class="btn">
                  <i class="far fa-edit" data-action="edit-item" 
                  data-task-index="${index}" title="Edit this task"></i>
                  </button>
                  <button class="btn">
                    <i class="fa fa-trash" data-action="delete" 
                    data-task-index="${index}" title="Delete this task"></i>
                  </button>                  
                  </div>
                </li>`;
      });
    }

    __container.html(`<ul class="list">${content}</ul>`);

  }
}

module.exports = TaskList;