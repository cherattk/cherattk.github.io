/**
 * 
 */
const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

var __container;

function FolderList() {

  var __state = {
    list: [
      { id: "1", name: "My Folder -1 " , active : true},
      { id: "2", name: "My Folder -2 " , active : false},
      { id: "3", name: "My Folder -3 " , active : false}
    ]
  }

  this.init = function (anchorID) {

    __container = $("#" + anchorID);

    // browser event
    __container.click(function (event) {
      if (event.target.tagName === 'LI') {
        // load folder list
        return;
      }
    });

    this.renderFolderList();

  }

  this.emptyState = function () {
    return '<li class="empty-list">Empty List</li>';
  }

  this.renderFolderList = function () {
    var content = "";
    if (!__state.list.length) {
      content = this.emptyState();
    }
    else {
      __state.list.map(function (folder) {
        content += `<li class="list-group-item" id="folder-${folder.id}">${folder.name}</li>`;
      });
    }
    __container.append(`<ul class="list-group list-group-flush"> ${content} </ul>`);

  }
}

module.exports = new FolderList();