// TaskForm
const AppEvent = require('../service/eventstore').AppEvent;

const DataManager = require('../service/datamanager');

// <select class="custom-select mb-3" name="task_label">
//       <option value="todo">Todo</div>
//       <option value="doing">Doing</div>
//     </select>

function TaskForm(){

  var __anchor;

  //var __openForm = $(`<button class="btn btn-primary btn-sm">New Task</button>`);

  var __form = $(`
    <form id="task-form" class="task-form">
      <input type="text" name="task_body" class="form-control mb-3" placeholder="Task..." />
      <!--<input type="submit" value="Save" class="btn btn-primary btn-sm"/>-->
    </form>`);

  this.init = function(anchorID) {

    __anchor = $("#" + anchorID);
    // __anchor.prepend(__openForm);
    __anchor.append(__form);

    var self = this;
    __form.submit(function(e){
      self.submit(e);
    });

    AppEvent.addListener("edit-item" , function(event){
      var taskBody = event.message.item.task_body;
      __form.elements['task_body'].value = taskBody;
    });
  }

  this.submit = function(e){
    e.preventDefault();
    var task_body = e.target.elements['task_body'].value;
    if(!task_body){
      alert("You can not add an empty task");
      return;
    }

    // var select = e.target.elements['task_label'];
    //var task_label = select.options[select.selectedIndex].value;

    var item = {
      task_id : (new Date()).getTime().toString(),
      task_label : "todo",
      task_body : task_body
    };
    DataManager.setTask(item);
    e.target.reset();
  }

}

module.exports = new TaskForm();