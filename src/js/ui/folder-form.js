const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');

var __state = {
  folder: {
    id: "",
    name: "My List"
  }
};

var __element;
var __container;
const FolderForm = {

  init: function (anchorID) {

    __container = $("#" + anchorID);
    this.render();

    var self = this;
    //var createButton = __container.find("#create-folder");
    __container.click(function (event) {
      if (event.target.id === "create-folder") {
        __state.folder = {
          id: (new Date()).getTime().toString(),
          name: "New Task List"
        };
        self.render();
        self.setFolder();
        AppEvent.dispatch("active-folder", { folder_id: __state.folder.id });
      }
    });
  },

  setFolder: function () {
    if (!__state.folder.id) {
      alert("error folder id is empty");
      return;
    }
    if (!__state.folder.name) {
      alert("You can not set an empty list");
      return;
    }
    DataManager.setItem('folder', __state.folder);
  },

  attachListener: function () {
    var self = this;
    var textField = __container.find("#folder-textfield");
    textField.blur(function (event) {
      // event.preventDefault();
      if (event.target.id === "folder-textfield") {
        __state.folder.name = event.target.value;
        self.setFolder();
      }
    });
  },

  render: function () {
    __container.html(`
    <div id="folder-header">
      <input id="folder-textfield" type="text" class="textfield" 
        value="${ __state.folder.name}"/>
      <button id="create-folder" type="button" class="btn btn-primary btn-sm">
      New Folder
      </button>
      </div>`);
    this.attachListener();
  }


};

module.exports = FolderForm;