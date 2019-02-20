const AppEvent = require('../event').AppEvent;

function Form(){

  var __element;

  this.init = function(anchorID) {

    __element = document.getElementById(anchorID);

    // browser event
    __element.onsubmit = this.submit.bind(this);

    this.render();
  }

  this.submit = function(e){
    e.preventDefault();
    var value = e.target.elements['task_label'].value;
    if(!value){
      AppEvent.dispatch("modal-state" , {
            show : true,
            message : "You can not add an empty task"
      });
      return;
    }

    var item = {
      id : (new Date()).getTime().toString(),
      status : "todo",
      label : value,
      checked : false
    };
    AppEvent.dispatch("save-form", {
      name : "task",
      data: item
    });
    e.target.reset();
  }

  this.render = function() {
    __element.innerHTML = `
                <form class="form">
                  <input type="text" maxlength="47"
                        name="task_label" 
                        placeholder="Add your task"/>
                  <input type="submit" value="save" class="btn btn-blue"/>
                </form>
              ` ;
  }
}

module.exports = new Form();