// TaskForm
const AppEvent = require('../service/eventstore').AppEvent;

const DataManager = require('../service/datamanager');

const TaskList = require('../ui/list');

// <select class="custom-select mb-3" name="task_label">
//       <option value="todo">Todo</div>
//       <option value="doing">Doing</div>
//     </select>

function TaskForm() {

  var __state = {
    task: {},
    move: false,
    previous_li: null
  };

  var __anchor ;

  //var __openForm = $(`<button class="btn btn-primary btn-sm">New Task</button>`);

  var __form = $(`
    <form id="task-form" class="task-form">
      <input type="text" name="task_body" class="form-control mb-3" placeholder="Task..." />
      <!--<input type="submit" value="Save" class="btn btn-primary btn-sm"/>
      <input type="reset" value="Clear" class="btn btn-secondary btn-sm"/>-->
    </form>`);

  //var __form =  __form.clone();

  this.moveForm = function (origin) {

    // move to origin
    if (origin && __state.previous_li) {
      // TaskList.getElement(__state.task.task_id).addClass("hide-content");
      TaskList.getElement(__state.previous_li).removeClass("hide-content");
      //__anchor.append(__form.clone());
      __state.task = {};
      // __state.move = false;
      return;
    }

    // move to another place other than origin
    var li = TaskList.getElement(__state.task.task_id);
    li.append(__form.clone());
    li.addClass("hide-content");    

    if (__state.previous_li !== __state.task.task_id) {
      TaskList.getElement(__state.previous_li).removeClass("hide-content");
      __state.previous_li = __state.task.task_id;
    }
  }

  this.init = function (anchorID) {

    __anchor = $("#" + anchorID);
    __anchor.append(__form);
    // __anchor.height(__form.height());
    

    var self = this;
    __form.submit(function (e) {
      self.submit(e);
      self.moveForm(true);
    });
    __form.on("reset", function (e) {
      self.moveForm(true);
    });

    AppEvent.addListener("edit-item", function (event) {
      __state.task.task_id = event.message.item.task_id;
      // __state.previous_li = event.message.item.task_id;
      __form.children(`input[name="task_body"]`).val(event.message.item.task_body);
      self.moveForm();
    });
  }

  this.submit = function (e) {
    e.preventDefault();
    var task_body = e.target.elements['task_body'].value;
    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }

    // var select = e.target.elements['task_label'];
    //var task_label = select.options[select.selectedIndex].value;

    var item = {
      task_id: (__state.task.task_id ? __state.task.task_id : (new Date()).getTime().toString()),
      task_label: "todo",
      task_body: task_body
    };

    e.target.reset();
    DataManager.setTask(item);
  }

}

module.exports = new TaskForm();