const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

const Header = function () {

  var __state = {
    folder: {}
  };

  this.init = function (anchorID) {

    var __headerContainer = $('<div id="list-header" class="list-header"></div>');

    var __listTitle = $('<h1></h1>');
    var __listHeaderAction = $(`
          <div class="list-header-action">
            <button class="btn" data-action="edit-folder">
              <i class="far fa-edit" data-action="edit-folder" title="Edit List"></i>
            </button>
            <button class="btn" data-action="delete-folder">
             <i class="fa fa-trash" data-action="delete-folder" title="Delete this task"></i>
            </button> 
          </div>`);

    __listHeaderAction.click(this.editAction.bind(this));

    __headerContainer.append(__listTitle);
    __headerContainer.append(__listHeaderAction);

    $('#' + anchorID).append(__headerContainer);

    AppEvent.addListener("active-folder", function (event) {

      __state.folder = DataManager.getItem('folder', event.message.folder_id);
            
      // $('#board-content-inner').attr('class' , `theme-color-${__state.folder.color}`);

      __headerContainer.attr('class' , `list-header bg-color-${__state.folder.color}`);

      __listTitle.html(__state.folder.name);

      if (event.message.folder_id === "f1") {
        __listHeaderAction.hide();
      }
      else {
        __listHeaderAction.show();
      }
    });
    // AppEvent.addListener("update-folder", function (event) {
    //   __state.folder = DataManager.getItem('folder', event.message.item_id);
    //   __listTitle.html(__state.folder.name);
    // });
  }

  this.editAction = function (event) {

    // prevent action on default folder
    if (__state.folder.id === "f1") {
      AppEvent.dispatch("error-default-folder-action",
        { info: "error : action on default folder is not authaurized" });
      return;
    }
    if (event.target.dataset.action === "edit-folder") {
      AppEvent.dispatch("edit-folder", { folder_id: __state.folder.id });
      return;
    }
    if (event.target.dataset.action === "delete-folder") {
      var msg = "Do you realy want to delete this list : " + __state.folder.name + "\n";
          msg += "the tasks contained in this list will be moved to the \"All Tasks\" list";

      if (confirm(msg)) {
        DataManager.removeItem("folder", __state.folder.id);
        // activate the default folder afetr delete action
        AppEvent.dispatch("active-folder", { folder_id: "f1" });
      }
    }
  }

};

const List = function () {

  var __listContainer;
  var __listState = {
    list: [], // list of item
    folder_id: null,
    active_task: "",
    folder_color : "default"
  };

  this.init = function (anchorID) {

    __listContainer = $("#" + anchorID).html(`<ul class="list">${this.emptyState()}</ul>`);

    __listContainer.click(this.clickHandler.bind(this));

    var self = this;
    AppEvent.addListener("active-folder", function (event) {
      var folder = DataManager.getItem('folder' , event.message.folder_id);
      __listState.folder_id = folder.id;
      __listState.folder_color = folder.color;
      self.renderListItem();
    });

    AppEvent.addListener("update-task", function (event) {
      // __listState.folder_id = event.message.folder_id;
      self.renderListItem();
    });
    AppEvent.addListener("close-task-detail", function (event) {
      __listState.active_task = "";
      self.renderListItem();
    });
    AppEvent.addListener("get-task-detail", function (event) {
      __listState.active_task = event.message.task_id;
      self.renderListItem();
    });

    this.renderListItem();
  }

  this.clickHandler = function (event) {
    switch (event.target.dataset.action) {
      case "edit-item":
        let task = __listState.list[event.target.dataset.taskIndex];
        AppEvent.dispatch('get-task-detail', { task_id: task.id });
        break;
      case "completed":
        let update_task = __listState.list[event.target.dataset.taskIndex];
        update_task.task_label = event.target.checked ? "completed" : "todo";
        DataManager.setItem('task', update_task);
        break;
      case "delete":
        var rm_task = __listState.list[event.target.dataset.taskIndex];
        // if (confirm(`You are going to delete this task : \n "${rm_task.task_body}"`)) {
        //   DataManager.removeItem('task', rm_task.id);
        // }
        DataManager.removeItem('task', rm_task.id);
        break;
      default: break;
    }
  }

  // this.editItem = function (item, itemIndex) {
  //   var li = __listContainer.find(`li[data-task-index="${itemIndex}"]`);
  //   li.addClass("hide-content");
  //   var itemInput = __listContainer.find(`#item-textfield-${item.id}`);
  //   itemInput.show();
  //   itemInput.val(item.task_body);
  //   itemInput.focus();
  //   itemInput.blur(function (e) {
  //     DataManager.setItem('task', Object.assign(item, { task_body: e.target.value }));
  //     itemInput.hide();
  //     li.removeClass("hide-content");
  //   });
  // }

  this.emptyState = function () {
    return "";
  }

  this.renderListItem = function () {
    // var folderID = __listState.folder_id === "f1" ? null : __listState.folder_id;
    __listState.list = DataManager.getList('task', __listState.folder_id);
    var content = "";
    if (!__listState.list.length) {
      content = this.emptyState();
    }
    else {
      content = `<ul class="mylist">`;
      __listState.list.map(function (_item, index) {
        var __label = _item.task_label === "completed" ?
          `<span class="badge badge-success">completed</span>` :
          `<span class="badge badge-warning">To Do</span>`;// todo

        var active_item = (_item.id === __listState.active_task) ? 
                            `active-item-${__listState.folder_color}` : "";

        var checked = (_item.task_label === "completed") ? "checked=\"checked\"" : "";

        content += `<li class="task-state-${_item.task_label} ${active_item}" 
                        data-task-id="${_item.id}" 
                        data-task-index="${index}"
                        data-action="edit-item">      
                        
                        ${_item.task_body}

                        <button data-task-index="${index}" class="btn" data-action="delete">
                          <i data-task-index="${index}" 
                              class="fa fa-trash" data-action="delete" title="Delete this task"></i>
                        </button>

                        <div class="checkbox">
                          <label>
                          <input type="checkbox" name="checkbox_btn" ${checked}
                          data-action="completed" data-task-index="${index}"/>
                          <span></span>
                          </label>
                        </div>

                    </li>`;
      });
      content += `</ul>`;
    }

    __listContainer.html(`${content}`);
    // __listContainer.html(`<div class="mylist">${content}</div>`);

  }
}

module.exports = {
  List: new List(),
  Header: new Header()
};