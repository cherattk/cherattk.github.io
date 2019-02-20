const AppEvent = require('../event').AppEvent;

function Action(){

  var __element;
  var __state = {
    list : []
  };

  this.init = function(anchorID) {

    __element = document.getElementById(anchorID);
    this.render();
    AppEvent.addListener("select-item" , this.selectItem.bind(this));

    __element.onclick = this.action;

  }

  this.selectItem = function(event){
    
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
      if(actionName === "delete" && __state.list.length > 0){
          console.log("delete item : " + __state.list.toString());
          AppEvent.dispatch("remove-item" , {
            name : "task",
            list_id : __state.list.slice()
          });
          __state.list = [];
      }
  }

  this.render = function() {
    __element.innerHTML = `                
                <div class="action-bar">
                  <button data-action="delete" class="btn btn-blue">
                    delete
                  </button>
                </div>` ;
  }
}

module.exports = new Action();