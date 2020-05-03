const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

var __state = {
  folder: {
    id : "" , name : ""
  }
};

const FolderForm = {

  init: function () {

    // var __container = $("#" + anchorID).html(```);

    var __folderForm = $('#folder-form');
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
      $("#modal-folder-form").modal('hide');

    });
    
    AppEvent.addListener("edit-folder", function (event) {
      __state.folder = DataManager.getItem('folder', event.message.folder_id);
      textField.val( __state.folder.name);
      $("#modal-folder-form").modal('show');
    });

    AppEvent.addListener("add-folder", function (event) {
      __state.folder = { id : "" , name : ""};
      textField.val("");
      $("#modal-folder-form").modal('show');
    });

  }

};

module.exports = FolderForm;