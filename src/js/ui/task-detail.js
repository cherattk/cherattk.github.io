const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');


module.exports = function TaskDetail(anchorID) {

  var __state = { task: {} };

  var __div = $(`
    <div class="task-detail">
      <div class="inner-container">
        <div class="task-details-form">
        <h1>Task Details        
        <button id="close-form" class="close">X</button>
        </h1>
        <form id="task-detail-form" title="Edit Task Details">
          <label class="form-label">Task</label>
          <input class="textfield" type="text" name="task_body" />

          <label class="form-label">Status</label>
          <select name="task_label" class="textfield">
            <option value="todo">Todo</option>
            <option value="completed">Compeleted</option>
          </select>

          <label class="form-label">Description</label>
          <textarea class="textfield" name="task_description"></textarea>

          <input class="btn btn-sm btn-primary" type="submit" value="save"/>

          <button id="delete-item" class="btn btn-sm btn-secondary" type="button" title="Delete task">
            Delete
          </button>
          </form>
        </div> <!-- end task form -->

      </div> <!-- end inner container -->
    </div>`);

  $("#" + anchorID).append(__div);

  var __form = __div.find('#task-detail-form');
  __form.submit(function (e) {
    e.preventDefault();
    __saveForm(e);
    __div.addClass('saved-form');
    setTimeout(function () { __div.removeClass('saved-form'); }, 1000);
  });

  __div.find('#delete-item').click(function (e) {
    e.preventDefault();
    if (confirm("you are going to delete the task : are you sure ?")) {
      DataManager.removeItem('task', __state.task.id);
      __closeForm();
    }
  })

  __div.find('#close-form').click(function () {
    __closeForm()
  });

  AppEvent.addListener("active-folder", function (event) {
    // theme
    var folder = DataManager.getItem('folder', event.message.folder_id);
    __div.get(0).className = "task-detail theme-color-" + folder.color;

    // just close the task detail folder
    if (event.message.folder_id != "f1" &&
      event.message.folder_id != __state.task.folder_id) {
      __closeForm();
    }
  });


  function __updateState(task_id) {
    __state.task = DataManager.getItem('task', task_id);
    var targetForm = __form.get(0);
    targetForm.elements['task_body'].value = __state.task.task_body;
    targetForm.elements['task_label'].value = __state.task.task_label;
    targetForm.elements['task_description'].value = __state.task.task_description;
  }

  // 
  AppEvent.addListener('update-task', function (event) {
    __updateState(event.message.item_id);
  });

  AppEvent.addListener("get-task-detail", function (event) {
    __updateState(event.message.task_id);
    __div.addClass('show-task-detail');
  });

  function __saveForm(e) {
    var task_body = e.target.elements['task_body'].value;
    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }
    __state.task.task_body = task_body;
    __state.task.task_label = e.target.elements['task_label'].value;
    __state.task.task_description = e.target.elements['task_description'].value;

    //e.target.reset();
    DataManager.setItem('task', __state.task);
  }

  function __closeForm() {
    __div.removeClass('show-task-detail');
    __state.task = {};
    __form.trigger('reset');
    AppEvent.dispatch('close-task-detail');
  }

}