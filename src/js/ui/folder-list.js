
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

var __listFolder;

const FolderList = {

  init: function (anchorID) {

    __container = $("#" + anchorID);

    var __addFolder = $(`<button id="get-folder-form" class="btn btn-primary" title="Create List">                          
                          List
                        </button>`);
    __addFolder.click(function () {
      AppEvent.dispatch("add-folder");
    });

    __listFolder = $(`<ul class="folder-list"></ul>`);
    __listFolder.click(this.listClickHandler.bind(this));

    AppEvent.addListener("update-folder", function () {
      __state.list = DataManager.getList('folder');
      FolderList.renderListItem();
    });

    __container.append(__addFolder);
    __container.append(__listFolder);

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
    return "<li>Empty List</li>";
  },

  renderListItem: function () {
    var content = "";
    if (!__state.list.length) {
      content = this.emptyState();
    }
    else {
      // content = `<ul>`;
      __state.list.map(function (_item, index) {
        // init active folder at first element of the list
        var checked = (_item.id === __state.active_folder) ? "checked" : "";
        content += `
                <li>
                  <label
                    class="folder-list-item border-color-${_item.color}">
                    <input id="radio-folder-${_item.id}" type="radio" 
                          name="folder-list" ${checked}/>
                    ${_item.name}          
                    <span data-folder-id="${_item.id}" 
                          class="item-color-${_item.color}">${_item.name}</span>                      
                  </label>
                </li>`;

      });
      // content += `</ul>`;
    }

    __listFolder.html(content);

  }
}

module.exports = FolderList;