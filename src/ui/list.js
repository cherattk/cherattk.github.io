const AppEvent = require('../app/eventstore').AppEvent;

function List(){
  
  var __state , __element;

  this.init =  function(anchorID) {
    
    __element =  document.getElementById(anchorID);
    __state = {
        /**
         * list of item, item <==> {id , status , label}
         */
        list : [],
        allchecked : false
      };

    // browser event
    __element.onclick = this.selectItem.bind(this);

    // custom event
    // register listener for "change-data" first
    AppEvent.addListener("data-change" , this.updateList.bind(this));

    // this event will trigger "data-change" from DataManager
    AppEvent.dispatch("fetch-list" , { name : "task"});
  }

  this.selectItem = function(ev){

    var message = {
      checked : ev.target.checked
    };
    var action = ev.target.dataset.action;
    if (sendMessage = (action === 'select-all')) {
      message.list = __state.list.map(function(item){
        // this will add "checked" attribute to __state.list[item]
        // to render html-element with checked attribute
        // see this.render()
        item.checked = ev.target.checked;
        return item.id;
      });
      if(!ev.target.checked){
        message.list = [];
      }      
      __state.allchecked = ev.target.checked;
      this.render();
    }
    else if(sendMessage = (action === 'select-item') ){
      message.id = ev.target.dataset.itemId;
      
    }    
    if(sendMessage){
      AppEvent.dispatch("select-item" , message);
    }

    
  }

  this.updateList = function(event) {
    var name = event.eventMessage.name;
    if(name === "task"){
      __state.list = event.eventMessage.data;
      __state.allchecked = false;
      this.render();
    }
  }

  this.render = function() {

    var list = "";
    var item , checked;
    for (let index = 0 , max = __state.list.length ; index < max; index++) {
      item = __state.list[index];
      checked = (typeof item.checked !=="undefined" && !!item.checked);

      list += `<li class="${item.status}">
                <input id="item-${item.id}"
                      data-item-id="${item.id}"
                      data-action="select-item"
                      type="checkbox"
                      class="checkbox" 
                      ${checked ? "checked" : ''}/>
                <label for="item-${item.id}">
                  <span></span>
                </label>
                <p>${item.label}</p>
              </li>`;      
    }

    var html = `
          <div class="list-action">
              <input id="list-select-all"
                      type="checkbox" 
                      class="checkbox"                      
                      data-action="select-all"
                      ${__state.allchecked ? "checked" : ''}/>
              <label for="list-select-all">
              <span></span>all
              </label>
          </div>
          <ul class="list">            
            ${ list ? list : "<li>Empty List</li>" }
          </ul>`;

    __element.innerHTML = html;

  }
}

module.exports = new List();