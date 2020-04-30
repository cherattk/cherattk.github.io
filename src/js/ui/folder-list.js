const AppEvent = require('../service/eventstore').AppEvent;

const DataManager = require('../service/datamanager');

var __container;
var __state = {
  list: []
};

var __listNode;

const FolderList = {

  init: function (anchorID) {

    var __addFolder = $(`<button id="get-folder-form" class="btn btn-primary">New Folder</button>`);
    __addFolder.click(function(){
      AppEvent.dispatch("add-folder");
    });

    __listNode = $('<div id="folder-list"></div>');
    __listNode.click(this.listClickHandler.bind(this));
    
    AppEvent.addListener("update-folder-list", function () {
      FolderList.renderListItem();
    });    
    
    __container = $("#" + anchorID);    
    __container.append(__addFolder);
    __container.append(__listNode);
    this.renderListItem();

    //__listNode.find('input[type="radio"]');

    // init active folder at first element of the list
    AppEvent.dispatch("active-folder" , {folder_id : __state.list[0].id });
  },

  listClickHandler: function (event) {
    if(event.target.tagName.toLowerCase() === 'span' && event.target.dataset.folderId){
      var folderId = event.target.dataset.folderId;
      AppEvent.dispatch("active-folder", { folder_id: folderId });
    }
  },

  emptyState: function () {
    return `<p class="empty-list">Empty List</p>`;
  },

  renderListItem: function () {
    __state.list = DataManager.getList('folder').reverse();
    var content = "";
    if (!__state.list.length) {
      content = this.emptyState();
    }
    else {
      __state.list.map(function (_item, index) {
        // init active folder at first element of the list
        var checked = index == 0 ? "checked" : "" ;
        content += `
                <li>
                  <label>
                    <input id="radio-${_item.id}" type="radio" 
                          name="folder-list" ${checked}/>
                    <span data-folder-id="${_item.id}">
                    ${_item.name}</span>
                  </label>                  
                </li>`;
      });
    }

    __listNode.html(`<ul class="folder-list"> ${content} </ul>`);

  }
}

module.exports = FolderList;