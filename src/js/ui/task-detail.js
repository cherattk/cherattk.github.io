const AppEvent = require('../service/eventstore').AppEvent;
const DataManager = require('../service/datamanager');


module.exports = function TaskDetail(anchorID) {

  var __state = { task: {} };

  var __div = $(`
    <div class="task-detail">
      <div class="inner-container">
        <h1>Task Details        
        <button class="close">X</button>
        </h1>

        <div class="task-details-form">
        <form id="task-detail-form" title="Edit Task Details">
          <input class="textfield" type="text" name="task_body" />
          <textarea class="textfield" name="task_description"></textarea>
          <input class="btn btn-primary" type="submit" value="save"/>
        </form>
        </div>

      </div> 
    </div>`);

  $("#" + anchorID).append(__div);

  var __form = __div.find('#task-detail-form');
  __form.submit(function (e) {
    e.preventDefault();
    __saveForm(e);
  });

  __div.find('.close').click(function () {
    __div.removeClass('show-task-detail');
    __state.task = {};
  });

  AppEvent.addListener("edit-task", function (event) {
    __state.task = Object.assign({}, event.message.task);
    __div.addClass('show-task-detail');
    var taregtForm = __form.get(0);
    taregtForm.elements['task_body'].value = __state.task.task_body;
    taregtForm.elements['task_description'].value = __state.task.task_description;
  });

  function __saveForm(e) {
    var task_body = e.target.elements['task_body'].value;
    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }

    __state.task.task_body = task_body;
    __state.task.task_description = e.target.elements['task_description'].value;

  //e.target.reset();
  DataManager.setItem('task', __state.task);
}

}