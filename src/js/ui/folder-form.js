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
          <h4 class="modal-title">
          Edit List
          </h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <form id="folder-form">
          <div class="modal-body">

            <label class="form-label">Name</label>
            <input id="folder-name" type="text" 
                  class="textfield textfield-default" placeholder="List Name" />

            <label class="form-label">Color</label>
            <div id="color-panel" class="color-panel"></div>
              
          </div>
          <div class="modal-footer">
            <input type="submit" value="Save" class="btn btn-primary" />
          </div>
        </form>
      </div>
    </div>
  </div>
    `);


    // ============= COLOR PANEL ================================
    var __colorPanel = __folderForm.find("#color-panel");
    var __colorList = ["default" , "red" , "purple" , "yellow" , "green"];
    var __colorPanelContent = "";
    __colorList.forEach(function(color , index){
      __colorPanelContent += `<label>
        <input type="radio" value="${color}" name="color-panel-value"/>
        <span class="bg-color-${color}"></span>
      </label>`;
    });
    __colorPanel.append(__colorPanelContent);
    // ===========================================================
    

    $("#" + anchorID).append(__folderForm);

    var folderNameField = __folderForm.find('#folder-name');

    __folderForm.submit(function (event) {
      event.preventDefault();
      if (!__state.folder.id) {
        __state.folder.id = (new Date()).getTime().toString();
        //return;
      }

      // add regex filter
      __state.folder.name = folderNameField.val();
      if (!__state.folder.name) {
        alert("You can not set an empty list");
        return;
      }

      // set color
      __state.folder.color = event.target.elements['color-panel-value'].value;

      DataManager.setItem('folder', __state.folder);

      AppEvent.dispatch("active-folder" , {folder_id : __state.folder.id });
      __folderForm.modal('hide');
      __state.folder = {};
      event.target.reset();
    });
    
    AppEvent.addListener("edit-folder", function (event) {
      __state.folder = DataManager.getItem('folder', event.message.folder_id);
      folderNameField.val( __state.folder.name);
      // var inputList = __colorPanelContent.find('input[type="radio"]');
      __colorPanel.find('input[type="radio"]').each(function(index , __input){
        if(this.value === __state.folder.color){
          this.checked = "checked";
        }
      });
      __folderForm.modal('show');
    });

    AppEvent.addListener("add-folder", function (event) {
      __state.folder = { id : "" , name : ""};
      folderNameField.val("");
      __colorPanel.find('input[type="radio"]').each(function(index , __inputColor){
        this.checked = __inputColor.value === 'default' ? true : false;
      });
      __folderForm.modal('show');
    });

  }

};

module.exports = FolderForm;