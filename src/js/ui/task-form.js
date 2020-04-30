const DataManager = require('../service/datamanager');
const AppEvent = require('../service/eventstore').AppEvent;

function TaskForm(anchorID) {

  var __state = {
    task: {}
  };

  var self = this;
  var __form = $(`
    <form id="task-form" class="task-form" title="add a new task to do">
      <input id="task-form-text" class="textfield" type="text" name="task_body" 
      placeholder="New Task ..." />
    </form>`);
  $("#" + anchorID).append(__form);

  __form.submit(function (e) {
    e.preventDefault();
    self.saveForm(e);
  });

  AppEvent.addListener("active-folder", function (event) {
    __state.task.folder_id = event.message.folder_id;
  });

  this.saveForm = function (e) {
    var task_body = e.target.elements['task_body'].value;
    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }
    var item = {
      id: (new Date()).getTime().toString(),
      folder_id: __state.task.folder_id,
      task_body: task_body
    };
    e.target.reset();
    DataManager.setItem('task', item);
  }

}

module.exports = function (anchor_id) {
  return new TaskForm(anchor_id);
};