const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

var __state = {
  folder: {
    id : "" , name : ""
  }
};

const FolderForm = {

  init: function (anchorID) {

    var __folderForm = $(`
    <div class="modal fade" role="document">
    <div class="modal-dialog">
      <div class="modal-content folder-form">
        <div class="modal-header">
          <h4 class="modal-title">Task List Name</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <div class="modal-body">
          <form id="folder-form">
            <input id="folder-textfield" type="text" class="textfield" placeholder="Task List Name" />
            <input type="submit" value="Save" class="btn btn-primary" />
          </form>
        </div>
      </div>
    </div>
  </div>
    `);

    $("#" + anchorID).append(__folderForm);

    var textField = __folderForm.find('#folder-textfield');

    __folderForm.submit(function (event) {
      event.preventDefault();
      if (!__state.folder.id) {
        __state.folder.id = (new Date()).getTime().toString();
        //return;
      }

      // add regex filter
      __state.folder.name = textField.val();
      if (!__state.folder.name) {
        alert("You can not set an empty list");
        return;
      }
      DataManager.setItem('folder', __state.folder);
      AppEvent.dispatch("active-folder" , {folder_id : __state.folder.id });
      __folderForm.modal('hide');

    });
    
    AppEvent.addListener("edit-folder", function (event) {
      __state.folder = DataManager.getItem('folder', event.message.folder_id);
      textField.val( __state.folder.name);
      __folderForm.modal('show');
    });

    AppEvent.addListener("add-folder", function (event) {
      __state.folder = { id : "" , name : ""};
      textField.val("");
      __folderForm.modal('show');
    });

  }

};

module.exports = FolderForm;