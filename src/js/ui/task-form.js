const DataManager = require('../service/datamanager');

function TaskForm() {

  var __state = {
    task: {}
  };

  this.init = function (anchorID) {

    var self = this;
    var __form = $(`
    <form id="task-form" class="task-form" title="add a new task to do">
      <input type="text" name="task_body" placeholder="Task..." />
      <!--<input type="submit" value="Save" class="btn btn-primary btn-sm"/>
      <input type="reset" value="Clear" class="btn btn-secondary btn-sm"/>-->
    </form>`);
    $("#" + anchorID).append(__form);

    __form.submit(function (e) {
      self.submit(e);
      self.moveForm(true);
    });

    __form.on("reset", function (e) {
      self.moveForm(true);
    });
  }

  this.submit = function (e) {
    e.preventDefault();
    var task_body = e.target.elements['task_body'].value;
    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }
    var item = {
      id: (__state.task.id ? __state.task.id : (new Date()).getTime().toString()),
      task_label: "todo",
      task_body: task_body
    };
    e.target.reset();
    DataManager.setItem('task' , item);
  }

}

module.exports = new TaskForm();