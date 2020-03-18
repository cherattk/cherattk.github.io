/**
 * 
 */
const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

var __container;

function FolderList() {

  var __state = {
    list: []
  }

  this.init = function (anchorID) {

    __container = $("#" + anchorID);

    // browser event
    __container.click(function (event) {
      if (event.target.dataset.action === 'get-folder') {
        AppEvent.dispatch('active-folder' , { folder_id :  __state.list[0].id});
        return;
      }
    });

    if(__state.list.length){
      $('#board-h1').html(folderName);
    }
    this.renderFolderList();
  }

  this.emptyState = function () {
    return '<li data-action="" class="empty-list">Empty List</li>';
  }

  this.renderFolderList = function () {
    var content = "";
    if (!__state.list.length) {
      content = this.emptyState();
    }
    else {
      __state.list.map(function (folder) {
        content += `<li class="list-group-item" data-action="get-folder" id="folder-${folder.id}">${folder.name}</li>`;
      });
    }
    __container.append(`<ul class="list-group list-group-flush"> ${content} </ul>`);

  }
}

module.exports = new FolderList();