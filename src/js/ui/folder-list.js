const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

var __container;
var __state = {
  list: [], // list of item
  folderId: null
};

const FolderList = {

  editItem: function (item, itemIndex) {
    var li = __container.find(`li[data-folder-index="${itemIndex}"]`);
    li.addClass("hide-content");
    var itemInput = __container.find(`input[id="item-${itemIndex}"]`);
    itemInput.show();
    itemInput.val(item.folder_name);
    itemInput.focus();
    itemInput.blur(function (e) {
      DataManager.setItem('folder', Object.assign(item, { folder_name: e.target.value }));
      itemInput.hide();
      li.removeClass("hide-content");
    });
  },

  init: function (anchorID) {

    __container = $("#" + anchorID).html(`<ul class="list">${this.emptyState()}</ul>`);



    __container.click(this.clickHandler.bind(this));

    // AppEvent.addListener("active-folder", function (event) {
    //   __state.folderId = event.message.folder_id;
    //   FolderList.renderListItem();
    // });

    AppEvent.addListener("update-folder-list", function () {
      FolderList.renderListItem();
    });

    this.renderListItem();
  },

  clickHandler: function (event) {
    //
  },

  emptyState: function () {
    return `<li class="empty-list">Empty List</li>`;
  },

  renderListItem: function () {
    __state.list = DataManager.getList('folder', __state.folderId).reverse();
    var content = "";
    if (!__state.list.length) {
      content = this.emptyState();
    }
    else {
      __state.list.map(function (_item, index) {
        content += `
                <li data-folder-id="${_item.id}" data-folder-index="${index}">
                  <p>${index + 1} - ${_item.folder_name}</p>
                </li>`;
      });
    }

    __container.html(`<ul class="list">${content}</ul>`);

  }
}

module.exports = FolderList;