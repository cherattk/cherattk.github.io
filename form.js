const customEvent = require('./event').customEvent;

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
      customEvent.dispatch("modal-state" , {
            show : true,
            message : "You can not add an empty task"
      });
      return;
    }

    var item = {
      status : "todo",
      label : value
    };
    customEvent.dispatch("save-task-form", {
      task: item
    });
    e.target.reset();
  }

  this.render = function() {
    __element.innerHTML = `
                <form id="task-form">
                  <input type="text" 
                        name="task_label" 
                        placeholder="Add your task"/>
                  <input type="submit" value="save"/>
                </form>
              ` ;
  }
}

module.exports = new Form();