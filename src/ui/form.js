const AppEvent = require('../app/eventstore').AppEvent;

const __config ={
  maxChar : 55
}

function Form(){

  var __element;
  var __state = {
    itemStatus : "todo" // default 
  }

  this.init = function(anchorID) {

    __element = document.getElementById(anchorID);

    // browser event
    __element.onsubmit = this.submit.bind(this);
    this.render();

    // customEvent
    AppEvent.addListener("navigate-list" , this.setItemStatus.bind(this));
  }

  this.setItemStatus = function (customEvent) {
    __state.itemStatus = customEvent.eventMessage.stage;
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
      stage : __state.itemStatus,
      label : value
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
                  <input type="text" maxlength="${__config.maxChar}"
                        name="task_label" 
                        placeholder="Add a task : ${__config.maxChar} characters max" />
                  <input type="submit" value="save" class="btn btn-blue"/>
                </form>
              ` ;
  }
}

module.exports = new Form();