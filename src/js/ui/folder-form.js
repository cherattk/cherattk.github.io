const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

var __state = {
  folder:{
    id : "",
    name : ""
  }
};

const FolderForm = {

  init: function (anchorID) {

    var __form = $(`
      <form>
        <input type="text" value="" placeholder="Folder Name" class="form-control"
                name="folder_name" aria-describedby="folderName">
      </form>
      `);

    $("#" + anchorID).append(__form);

    __form.submit(this.submitFormHandler.bind(this));

  },

  submitFormHandler: function (event) {
    event.preventDefault();
    var folder_name = event.target.elements['folder_name'].value;
    if (!folder_name) {
      alert("You can not add an empty folder");
      return;
    }
    var item = {
      id: (__state.folder.id ? __state.folder.id : (new Date()).getTime().toString()),
      folder_name: folder_name
    };
    event.target.reset();
    DataManager.setItem('folder', item);
  }
};

module.exports = FolderForm;