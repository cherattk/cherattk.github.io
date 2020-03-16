/**
 * 
 */
const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

function FolderList() {

  var __element;
  var __state = {
    edit_folder: {
      id: "",
      name: "",
    },
    folder_list: [
      { id: "1", name: "My Folder -1 " },
      { id : "2" , name :  "My Folder -2 "},
      { id : "3" , name :  "My Folder -3 "}
    ]
  }

  this.init = function (anchorID) {

    __element = $("#" + anchorID);

    // browser event
    __element.click(function (event) {
      if (event.target.tagName === 'LI') {
        
        return;
      }
      // if (event.target.id === 'add-folder') {
      //   DataManager.setFolder({
      //     id: __state.edit_folder.id,
      //     name: __state.edit_folder.name
      //   });
      //   e.target.reset();
      //   return;
      // }
    });
    this.render();

    // customEvent
    //AppEvent.addListener("navigate-list", this.setItemStatus.bind(this));
  }

  // this.setStatus = function (customEvent) {
  //   __state.itemStatus = customEvent.eventMessage.stage;
  // }

  this.emptyState = function (params) {
    return '<li class="empty-list">Empty List</li>';
  }

  this.renderList = function () {
    var list = `<ul class="list-group">`;
    __state.folder_list.map(function (folder) {
      list += `<li class="list-group-item" id="prj-${folder.id}">${folder.name}</li>`;
    });

    return (__state.folder_list ? list : this.emptyState());

  }

  this.render = function () {
    __element.html(`
    <div id="folder-list" class="modal fade folder-list" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">My folders</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!--
        <div class="modal-body form-add-folder">          
          <button type="button" data-toggle="collapse" data-target="#form-add-folder">add folder</button>
          <form id="form-add-folder" class="collapse">          
            <div class="form-group">
              <label for="folder-name">folder name</label>
              <input type="text" value="" placeholder="Folder Name"
                      class="form-control" 
                      id="folder-name" 
                      name="folder-name" aria-describedby="folderName">
              <small id="folderName" class="form-text text-muted">Enter you folder name and click save.</small>
            </div>
            <button type="button" class="btn btn-primary">Save</button>
            <button type="button" class="btn btn-secondary">Cancel</button>
          </form>
        </div>
        -->

        <div class="modal-body">
          ${this.renderList()}          
        </div>
      </div>

    </div>
  </div>`) ;
  }
}

module.exports = new FolderList();