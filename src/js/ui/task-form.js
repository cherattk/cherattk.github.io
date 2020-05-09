const DataManager = require('../service/datamanager');
const AppEvent = require('../service/eventstore').AppEvent;

function TaskForm(anchorID) {

  var __state = {
    task: {
      id : "",
      folder_id: "f1",
      task_body : "New Task",
      task_label : "todo",
      task_description : "Task Description"
    }
  };

  var self = this;
  var __form = $(`
    <div class="task-form">
      <form id="task-form" title="add a new task to do">
        <input id="task-form-text" class="textfield" type="text" name="task_body" 
        placeholder="Add New Task ..." />
        <input type="submit" value="Save" class="btn btn-primary btn-sm"/>
      </form>
    </div>`);
  $("#" + anchorID).append(__form);

  __form.submit(function (e) {
    e.preventDefault();
    __saveForm(e);
  });

  AppEvent.addListener("active-folder", function (event) {
    __state.task.folder_id = event.message.folder_id;
  });

  function __saveForm (e) {
    var task_body = e.target.elements['task_body'].value;
    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }

    var item = Object.assign({} , __state.task , {
      id: (new Date()).getTime().toString(),
      task_body: task_body
    });

    e.target.reset();
    DataManager.setItem('task', item);
  }

}

module.exports = function (anchor_id) {
  return new TaskForm(anchor_id);
};