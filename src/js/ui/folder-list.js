
/**
 * 
 */

const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

var __container;
var __state = {
  list: [],
  active_folder: null
};

var __listNode;

const FolderList = {

  init: function (anchorID) {

    var __addFolder = $(`<button id="get-folder-form" class="btn btn-primary">
                          <!-- <i class="fas fa-clipboard-list"></i> -->
                          New List
                        </button>`);
    __addFolder.click(function () {
      AppEvent.dispatch("add-folder");
    });

    __listNode = $('<div id="folder-list"></div>');
    __listNode.click(this.listClickHandler.bind(this));

    AppEvent.addListener("update-folder-list", function () {
      __state.list = DataManager.getList('folder');
      FolderList.renderListItem();
    });

    __container = $("#" + anchorID);
    __container.append(__addFolder);
    __container.append(__listNode);

    var self = this;
    AppEvent.addListener("active-folder", function (event) {
      __state.active_folder = event.message.folder_id;
      self.renderListItem();
    });

    __state.list = DataManager.getList('folder');
    this.renderListItem();

    // inform other component wich folder is active at init time
    AppEvent.dispatch("active-folder", { folder_id: __state.list[0].id });

  },

  listClickHandler: function (event) {
    if (event.target.tagName.toLowerCase() === 'span' && event.target.dataset.folderId) {
      var folderId = event.target.dataset.folderId;
      AppEvent.dispatch("active-folder", { folder_id: folderId });
    }
  },

  emptyState: function () {
    return `<p class="empty-list">Empty List</p>`;
  },

  renderListItem: function () {
    var content = "";
    if (!__state.list.length) {
      content = this.emptyState();
    }
    else {
      __state.list.map(function (_item, index) {
        // init active folder at first element of the list
        var checked = _item.id === __state.active_folder ? "checked" : "";
        content += `
                <li>
                  <label class="folder-list-item">
                    <input id="radio-folder-${_item.id}" type="radio" 
                          name="folder-list" ${checked}/>
                    <span data-folder-id="${_item.id}">
                    ${_item.name}
                    </span>                    
                  </label>
                </li>`;
      });
    }

    __listNode.html(`<ul class="folder-list"> ${content} </ul>`);

  }
}

module.exports = FolderList;