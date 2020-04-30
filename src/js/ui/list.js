const AppEvent = require('../service/eventstore').AppEvent;

const DataManager = require('../service/datamanager');


const Header = function() {

  var __state = {
    folder : {}
  };

  this.init = function(anchorID) {

    var __headerContainer = $('<div id="list-header" class="list-header"></div>');

    var __listTitle = $('<h1 > My List </h1>');
    var __listHeaderAction = $(`
            <button class="btn" data-action="edit-folder">
              <i class="far fa-edit" title="Edit List" data-action="edit-folder"></i>
            </button>
          </div>`);

    __listHeaderAction.click(this.editAction.bind(this));

    __headerContainer.append(__listTitle);
    __headerContainer.append(__listHeaderAction);

    $('#' + anchorID).append(__headerContainer);

    AppEvent.addListener("active-folder", function (event) {
      __state.folder = DataManager.getItem('folder', event.message.folder_id);
      __listTitle.html(__state.folder.name);
    });
    AppEvent.addListener("update-folder-list", function (event) {
      __state.folder = DataManager.getItem('folder', event.message.item_id);
      __listTitle.html(__state.folder.name);
    });
  }

  this.editAction =  function (event) {
    if (event.target.dataset.action === "edit-folder") {
      AppEvent.dispatch("edit-folder" , {folder_id : __state.folder.id});
    }
  }

};

const List = function () {

  var __listContainer;
  var __listState = {
    list: [], // list of item
    folder_id: null
  };

  this.init = function (anchorID) {

    __listContainer = $("#" + anchorID).html(`<ul class="list">${this.emptyState()}</ul>`);

    __listContainer.click(this.clickHandler.bind(this));

    var self = this;
    AppEvent.addListener("active-folder", function (event) {
      __listState.folder_id = event.message.folder_id;
      self.renderListItem();
    });

    AppEvent.addListener("update-task-list", function (event) {
      // __listState.folder_id = event.message.folder_id;
      self.renderListItem();
    });

    this.renderListItem();
  }

  this.clickHandler = function (event) {
    switch (event.target.dataset.action) {
      case "edit-item":
        let task = __listState.list[event.target.dataset.taskIndex];
        if (task.task_label === "completed") {
          alert("the completed task can not be modified");
          return;
        }
        this.editItem(task, event.target.dataset.taskIndex);
        break;
      case "completed":
        let update_task = __listState.list[event.target.dataset.taskIndex];
        update_task.task_label = event.target.checked ? "completed" : "todo";
        DataManager.setItem('task', update_task);
        break;
      case "delete":
        let rm_task = __listState.list[event.target.dataset.taskIndex];
        DataManager.removeItem('task', [rm_task]);
        break;
      default: break;
    }
  }

  this.editItem = function (item, itemIndex) {
    var li = __listContainer.find(`li[data-task-index="${itemIndex}"]`);
    li.addClass("hide-content");
    var itemInput = __listContainer.find(`#item-textfield-${item.id}`);
    itemInput.show();
    itemInput.val(item.task_body);
    itemInput.focus();
    itemInput.blur(function (e) {
      DataManager.setItem('task', Object.assign(item, { task_body: e.target.value }));
      itemInput.hide();
      li.removeClass("hide-content");
    });
  }

  this.emptyState = function () {
    return `<li class="empty-list">Empty List</li>`;
  }

  this.renderListItem = function () {
    __listState.list = DataManager.getList('task', __listState.folder_id).reverse();
    var content = "";
    if (!__listState.list.length) {
      content = this.emptyState();
    }
    else {
      __listState.list.map(function (_item, index) {
        let isDone = _item.task_label === "completed";
        content += `<li class="${_item.task_label}" data-task-id="${_item.id}" data-task-index="${index}">                
                    <!--  checkbox -->
                    <div class="checkbox" title="Mark task as completed">
                      <input id="checkbox-${_item.id}"
                              data-action="completed" data-task-index="${index}"
                            type="checkbox"
                            ${isDone ? "checked" : ''}/>
                      <label for="checkbox-${_item.id}">
                        <span></span>
                      </label>
                    </div>
                    
                    <!-- item content -->
                    <div>   
                      <p>${_item.task_body}</p>
                      <!---->
                      <input id="item-textfield-${_item.id}" type="text" class="textfield" name="task_body"/>
                      <!--<textarea id="item-textfield-${_item.id}"  class="textfield" name="task_body"></textarea>-->
                    </div>
                    <!-- item action -->
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

    __listContainer.html(`<ul class="list">${content}</ul>`);

  }
}

module.exports = {
  List: new List(),
  Header: new Header()
};