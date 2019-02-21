const AppEvent = require('../app/eventstore').AppEvent;

function Action(){

  var __element;
  var __state = {
    list : []
  };

  this.init = function(anchorID) {

    __element = document.getElementById(anchorID);
    this.render();
    AppEvent.addListener("select-item" , this.updateItemList.bind(this));

    __element.onclick = this.action;

  }

  this.updateItemList = function(event){
    
    if(typeof event.eventMessage.id !== "undefined"){
      let id = event.eventMessage.id;
      let checked = event.eventMessage.checked;
      let index = __state.list.indexOf(id);
      if(checked /* selected */ && index < 0 /* item is not in the array */){
        __state.list.push(id);
        return;
      }
      if(!checked /* unselected */&& index >= 0 /* item is in the array */){
        __state.list.splice(index , 1);
        return;
      }
    }
    if(typeof event.eventMessage.list !== "undefined"){
      __state.list = event.eventMessage.list;
    }

  }

  this.action = function(domEvent){
    var actionName = domEvent.target.dataset.action;
    var eventMessage;

      if(actionName === "delete" && __state.list.length > 0){
          eventMessage = {
              action : "remove",
              name : "task",
              items : __state.list.slice()
          }        
      }
      if( actionName === "done" || 
          actionName === "todo" || 
          actionName === "progress" ){
        eventMessage = {
          action : "update-status",
          name : "task",
          items : __state.list.slice(),
          value : actionName
        }    
      }

      AppEvent.dispatch("update-item" , eventMessage);
      __state.list = [];
  }

  this.render = function() {
    __element.innerHTML = `                
                <div class="action-bar">
                  <button data-action="delete" class="btn btn-blue">
                    delete
                  </button>
                  <button data-action="progress" class="btn btn-blue">
                    Progress
                  </button>
                  <button data-action="done" class="btn btn-blue">
                    Done
                  </button>
                  <button data-action="todo" class="btn btn-blue">
                    Todo
                  </button>
                </div>` ;
  }
}

module.exports = new Action();