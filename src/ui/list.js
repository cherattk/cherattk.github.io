const AppEvent = require('../app/eventstore').AppEvent;

function List(){
  
  var __element;
  var __state = {
      list : [], // list of item
      allchecked : false,
      filter : ""
    };

  this.init =  function(anchorID) {
    
    __element =  document.getElementById(anchorID);
    
    // browser event
    __element.onclick = this.selectItem.bind(this);

    AppEvent.addListener("navigate-list" , this.setFilter.bind(this));

    // register listener for "change-data" first
    AppEvent.addListener("data-change" , this.updateList.bind(this));

    // trigger "data-change" event to init list
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
        // to set render html-checkbox element as checked.
        // see this.render()
        if(item.stage === __state.filter){
          item.checked = ev.target.checked;
          return item.id;
        }
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

  this.setFilter = function(customEvent) {
    __state.filter = customEvent.eventMessage.stage;
    __state.allchecked = false;
    __state.list.map(function(item){
      // this will add "checked" attribute to __state.list[item]
      // to render html-checkbox element as (un)checked.
      // see this.render()
      item.checked = false;
    });
    this.render();
    AppEvent.dispatch("select-item" , {
      checked : false,
      list : []
    });
  }

  this.render = function() {

    var checked = false, list = "";

    __state.list.map(function(item){
        if( item.stage !== __state.filter){
          return;
        }
        checked = (typeof item.checked !== "undefined" && !!item.checked);
        list += `<li class="${item.stage}">
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
    });

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
            ${ list ? list : `<li class="empty-list">Empty List</li>` }
          </ul>`;

    __element.innerHTML = html;

  }
}

module.exports = new List();