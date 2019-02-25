(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @module EventSet
 * @license MIT Licence
 * @copyright Copyright (c) 2018-2019 cheratt karim
 *                                              
 */

const Topic = require('./topic.js');
const Util = require('./util.js');

 /**
  * EventSet 
  */


function EventSet() {

    var _topicList = new Map();

    this.Topic = function(topicName) {
        
        if(!Util.isString(topicName)){
            var errorMsg = `EventSet.createTopic() : topicName argument must be of type string`;            
            throw new TypeError(errorMsg);
        }

        var _topic = null;
        var topicToken = Util.clean(topicName);   

        if(_topicList.has(topicToken)){
            _topic = _topicList.get(topicName);
        }
        else{
            _topic = new Topic(topicName);
            _topicList.set(topicName , _topic);
        }

        return _topic;
    }
}

module.exports = new EventSet();

},{"./topic.js":2,"./util.js":3}],2:[function(require,module,exports){
/**
 * @module Topic
 * @license MIT Licence
 * @copyright Copyright (c) 2018-2019 cheratt karim
 */

 const Util = require('./util.js');

 /**
  * 
  * @param {string} topicName
  * 
  * @retruns {Object} New Topic instance 
  */
function Topic(topicName){

    if(!Util.isString(topicName)){
        var errorMsg = `Topic.Topic() : topicName argument must be of type string`;            
        throw new TypeError(errorMsg);
    }

    var _eventMap = new Map();

    /**
     * Get Topic Name
     * 
     * @returns {string} topic name
     */
    this.getName = function(){
        return topicName;
    }


    /**
     * Get all registered events
     * 
     * @returns {Array<string>} An array of event names
     */
    this.getEvent = function (){
        var result = Array.from(_eventMap.keys());
        return result;
    }

    /**
     * Register the event to the topic
     * 
     * @param   {string} eventName - event name
     * 
     * @returns {Array<string>} An array of event names
     */
    this.addEvent = function (eventName){
        if(!Util.isString(eventName)){
            var errorMsg = `Topic.addEvent() : first argument must be of type string`;            
            throw new TypeError(errorMsg);
        }

        var eventToken = Util.clean(eventName);

        if(!_eventMap.has(eventToken)){
            _eventMap.set(eventToken , new Map());
        }
        return this.getEvent();
    }

    /**
     * Remove the event from the topic and all its event listeners
     * 
     * @param {string} eventName
     * 
     * @returns {Array<string>} An array of events names
     */

    this.removeEvent = function(eventName) {
        if(!Util.isString(eventName)){
            var errorMsg = `Topic.removeEvent() : first argument must be of type string`;            
            throw new TypeError(errorMsg);
        }

        var eventToken = Util.clean(eventName);

        if(_eventMap.has(eventToken)){
            _eventMap.delete(eventToken);
        }
        return this.getEvent();
    }

    /**
     * Register event listener
     * 
     * @param {string} eventName
     * @param {any} listener
     * 
     * @returns {string} listener identifier
     */
    this.addListener = function(eventName , listener){
        if(!Util.isString(eventName)){
            throw new TypeError(`Topic.addListener() : first argument must be a String type`);
        }

        if(typeof listener !== 'function'){
            throw new Error(`Topic.addListener() : second argument must be a Function type`);
        }

        var eventToken = Util.clean(eventName);
        if(!_eventMap.has(eventToken)){
            throw new Error( 'Invalid event name : ' + eventName);
        }

        var listenerMap = _eventMap.get(eventToken);
        var listenerId = eventToken + '/' + (listenerMap.size + 1).toString();
            listenerMap.set(listenerId , listener);
        
        return listenerId;
    }
    

    /**
     * Remove listener
     * 
     * @param {string} listenerId
     * 
     * @retruns {boolean} true if it succeeds, false otherwise
     */
    this.removeListener = function(listenerId){
        if(!Util.isString(listenerId)){
            var errorMsg = `Topic.removeListener() : listenerId argument must be of type string`;            
            throw new TypeError(errorMsg);
        }

        var eventToken = listenerId.split("/" , 1)[0];
        if(!_eventMap.has(eventToken)){
            throw new Error( 'Invalid listener identifier : ' + listenerId);
        }

        var listenerMap  = _eventMap.get(eventToken);
        var deleteResult = listenerMap.delete(listenerId);
        return deleteResult;
    }


    /**
     * Dispatch event
     * 
     * @returns {undefined}
     */
    this.dispatch = function(eventName , message){
        if(!Util.isString(eventName)){
            throw new TypeError(`Topic.dispatch() : first argument must be of type string`);
        }        
        var eventToken = Util.clean(eventName);
        if(!_eventMap.has(eventToken)){
            throw new Error('Invalid event name : ' + eventName);
        }

        var copyMessage = JSON.parse(JSON.stringify(message));
        var event  = {
            topicName    : topicName,
            eventName    : eventName, 
            eventMessage : copyMessage
        };
        
        var listenerMap = _eventMap.get(eventToken);
        listenerMap.forEach(function(listener){
            listener(event);
        });
    }
}

module.exports = Topic;
},{"./util.js":3}],3:[function(require,module,exports){
/**
 * @module Util
 * @license MIT Licence
 * @copyright Copyright (c) 2018-2019 cheratt karim
 */


const Util = {
    
    /**
     * Convert input string to lowercase and remove whitespaces and slashes
     * 
     * @param {string} value to clean 
     */
    clean : function(input){
        if(!this.isString(input)){
            var errorMsg = `Util.clean() : input argument must be of type string`;            
            throw new TypeError(errorMsg);
        }
        return input.toLowerCase().replace(/\s|\//g, "");
    },

    /**
     * 
     * @param {string} input
     */
    isString : function(input){
        return (typeof input === 'string' && input !== '');
    }

};

module.exports = Util;
},{}],4:[function(require,module,exports){
module.exports = function FixDataStore(){

  // return;
  if (!window.localStorage) {
    return;
  }

  const storeList = [
    {
      name : "task",
      field : [
        [
          "status" , "stage"
        ]
      ]
    }
  ];

  var __originData , 
      __copyData , 
      patchName , 
      patchDone;

  storeList.map(function(store){
    
    // 1 - check if the data store is patched
    patchName = ("patch." + store.name + ".store");
    patchDone = window.localStorage.getItem(patchName);
    if(patchDone === "done"){
      return;
    }

    // 2 - the data store is not patched
    storeData = window.localStorage.getItem(store.name);
    if(storeData){
      __originData = JSON.parse(storeData);

      //apply change
      __copyData = __originData.map(function(item){
        // create a new field named field[1].value and
        // assign to a new created field the value of 
        // the previous field named field[0]
        var __item = Object.assign({} , item);
        store.field.map(function(field){
          delete __item.checked;
          if(typeof item[field[0]] !== "undefined"){
            __item[field[1]] = item[field[0]].toString();
            delete __item[field[0]];
          }
        });
        return __item;
      });

      window.localStorage.setItem(
        `${store.name}`, 
        JSON.stringify(__copyData)
      );

      window.localStorage.setItem(patchName , "done");

    }

  });

}
},{}],5:[function(require,module,exports){

// apply data store of previous version
// require('../devdata/task.store');

require('../patch/fixdatastore.js')();

const DataManager = require('../src/app/datamanager.js');
DataManager.init();

const Form = require('../src/ui/form.js');
const List = require('../src/ui/list.js');
const Modal = require('../src/ui/modal.js');
const MoveTo = require('../src/ui/moveto.js');
const TabNavigation = require('../src/ui/tabnav.js');

Form.init("anchor-form");
List.init("anchor-list");
Modal.init("anchor-modal");
MoveTo.init("anchor-action");
TabNavigation.init("anchor-tabnav"); 
},{"../patch/fixdatastore.js":4,"../src/app/datamanager.js":6,"../src/ui/form.js":10,"../src/ui/list.js":11,"../src/ui/modal.js":12,"../src/ui/moveto.js":13,"../src/ui/tabnav.js":14}],6:[function(require,module,exports){
const DataStore = require('./datastore');

const AppEvent = require('./eventstore').AppEvent;

function DataManager(){

  var __dataStore = new DataStore(['task']);
  

  const __remove = function __remove(store , target_item){
    var copyStore = {
      name : store.name,
      data : []
    };
    store.data.forEach(function(item){
      // if item is not in array
      if((target_item.indexOf(item.id) < 0)){
        copyStore.data.push(item);
      }
    });

    __dataStore.saveStore(copyStore);
    return copyStore;
  }

  const __updateStatus = function __updateStatus(store , target_item , value){
    var copyStore = {
      name : store.name,
      data : []
    };
    store.data.forEach(function(item){
      if((target_item.indexOf(item.id) >= 0)){
        item.stage = value;
      }
      copyStore.data.push(item);
    });

    __dataStore.saveStore(copyStore);
    return copyStore;
  }


  this.init = function(){ 
    AppEvent.addListener("save-form" , this.save.bind(this));
    AppEvent.addListener("fetch-list" , this.getList.bind(this));
    AppEvent.addListener("update-item" , this.update.bind(this));
  }



  this.save = function(customEvent){
    var storeName = customEvent.eventMessage.name;
    var item = customEvent.eventMessage.data;
    var store = __dataStore.getStore(storeName);

        store.data.push(item);
        __dataStore.saveStore(store);

        AppEvent.dispatch("data-change" , {
          name : store.name,
          data : store.data
        });
  }


  this.update = function(customEvent){
    var action = customEvent.eventMessage.action;
    var storeName = customEvent.eventMessage.name;
    var targetItem = customEvent.eventMessage.items;
    var value = customEvent.eventMessage.value;

    var store = __dataStore.getStore(storeName);

    var copyStore;
    if(action === "remove"){
      copyStore = __remove(store , targetItem);
    }
    if(action === "update-stage"){
      copyStore = __updateStatus(store , targetItem , value);
    }

    AppEvent.dispatch("data-change" , copyStore);
  }

  this.getList = function(customEvent){
    var storeName = customEvent.eventMessage.name;
    var store = __dataStore.getStore(storeName);
    AppEvent.dispatch("data-change" , {
      name : store.name,
      data : store.data
    });
  }

  

}

const manager = new DataManager();
module.exports = manager;
},{"./datastore":7,"./eventstore":8}],7:[function(require,module,exports){
const LocalStore = require('../lib/localstore.js');

function DataStore(storeList){

    var __storeArray = LocalStore.loadStore(storeList);

    this.getStore = function(name){
        var store = __storeArray.filter(function(store){
            return (store.name === name);
        });
        return Object.assign({} , store[0]);
    }

    this.saveStore = function(store){
        for (let index = 0; index < __storeArray.length; index++) {
            if(__storeArray[index].name === store.name){
                __storeArray[index] = store;
                break;
            }            
        }

        LocalStore.save(store);
    }

    this.genID = function(){
        return Math.random().toString(36).substring(2, 13);
    }
}

module.exports = DataStore;



},{"../lib/localstore.js":9}],8:[function(require,module,exports){
const EventSet = require('eventset');

const AppEvent = EventSet.Topic('app.event');

AppEvent.addEvent("save-form");
AppEvent.addEvent("fetch-list");
AppEvent.addEvent("data-change");
AppEvent.addEvent("modal-state");
AppEvent.addEvent("select-item");
AppEvent.addEvent("update-item");
AppEvent.addEvent("navigate-list");

module.exports = {
    AppEvent
}
},{"eventset":1}],9:[function(require,module,exports){
function LocalStore(){

    this.loadStore = function(storeList) {

        if (!window.localStorage) {
            return;
        }

        var __storeArray = [];
        var storeData;
        storeList.map(function(storeName){
            storeData = window.localStorage.getItem(storeName);
            if(storeData){
                __storeArray.push(
                    {
                        name : storeName,
                        data : JSON.parse(storeData)
                    }
                );
            }
            else{
                let __store = {
                    name : storeName,
                    data : []
                };
                __storeArray.push(__store);

                // save in browser
                window.localStorage.setItem(
                    __store.name , 
                    JSON.stringify(__store.data)
                );
            }
            });

        return __storeArray;        
    }

    this.save = function(store){
        window.localStorage.setItem(
            store.name , 
            JSON.stringify(store.data)
        );
    }
}

module.exports = new LocalStore();



},{}],10:[function(require,module,exports){
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
},{"../app/eventstore":8}],11:[function(require,module,exports){
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
},{"../app/eventstore":8}],12:[function(require,module,exports){
const AppEvent = require('../app/eventstore').AppEvent;

function Modal(){

  var __element;
  var __state = {
    show : "hide",
    message : "Default Message"
  }

  this.init = function(anchorID) {

    __element = document.getElementById(anchorID);

    AppEvent.addListener("modal-state" , this.modalState.bind(this));

    // browser event
    __element.onclick = this.close.bind(this);
    this.render();
  }

  this.modalState = function(event) {
    __state.show = event.eventMessage.show ? "show" : "hide";
    __state.message = event.eventMessage.message;
    this.render();
  }

  this.close = function(e){
    e.preventDefault();
    if(e.target.className === "modal-close"){
      __state.show = "hide";
      this.render();
    }
  }

  this.render = function() {

    __element.innerHTML = `
                <div class="modal ${__state.show}">
                  <div class="overlay"></div>
                  <div class="modal-content">
                  <div class="modal-close">X</div>
                  <h3>Message</h3>
                  <p>${__state.message}</p>
                  </div>
                </div>
              ` ;
  }
}

module.exports = new Modal();
},{"../app/eventstore":8}],13:[function(require,module,exports){
const AppEvent = require('../app/eventstore').AppEvent;

const __config = {
  tab : [
    {name : "todo" , label : "To Do" , style : "yellow"},
    {name : "doing" , label : "In progress" , style : "blue"},
    {name : "done" , label : "Done" , style : "green"},
    {name : "delete" , label : "Delete" , style : "red"},
  ],
   // used to define type of available action
  action : ["todo" , "doing" , "done" , "delete"]
};

function MoveTo(){

  var __element;
  var __state = {
    list : [],
    itemStatus : ""
  };

  this.init = function(anchorID) {

    __element = document.getElementById(anchorID);
    
    this.render();
    __element.onclick = this.action;

    AppEvent.addListener("select-item" , this.updateItemList.bind(this));

    AppEvent.addListener("navigate-list" , this.setItemStatus.bind(this));

  }

  this.setItemStatus = function(customEvent){
    __state.itemStatus = customEvent.eventMessage.stage;
    this.render();
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

    if(__state.list.length < 0 || __config.action.indexOf(actionName) < 0){
      return;
    }
    if(actionName === "delete"){
        eventMessage = {
            action : "remove",
            name : "task",
            items : __state.list.slice()
        }        
    }
    else{ 
      // for actions : {"todo" , "doing" , "done"}
      eventMessage = {
        action : "update-stage",
        name : "task",
        items : __state.list.slice(),
        value : actionName
      }
    }

    AppEvent.dispatch("update-item" , eventMessage);
    __state.list = [];
  }

  this.render = function() {

    var actionList = "";
    __config.tab.map(function(item){
        if(item.name !== __state.itemStatus){
          actionList += `<button data-action="${item.name}" 
                                  class="btn btn-${item.style}">
                            ${item.label}
                          </button>`;
        }
    });
    __element.innerHTML = `                
                <div class="action-bar">
                <label>Move To : </label>                
                  ${actionList}
                </div>` ;
  }
}

module.exports = new MoveTo();
},{"../app/eventstore":8}],14:[function(require,module,exports){
const AppEvent = require('../app/eventstore').AppEvent;

const __config = [
  { value: "todo", label: "To Do", checked: true },
  { value: "doing", label: "In Progress", checked: false },
  { value: "done", label: "Done", checked: false }
]

function TabNavigation() {

  var __element;

  this.init = function (anchorID) {
    __element = document.getElementById(anchorID);

    AppEvent.dispatch("navigate-list", {
      stage : "todo"
    });

    this.render();

    this.navigate();
  }

  this.navigate = function () {
    var input = __element.querySelectorAll("input[type=\"radio\"]");
    input.forEach(function(item){
      item.onchange = function (ev) {
        AppEvent.dispatch("navigate-list", {
          stage : ev.target.value
        });
      }
    })
  }

  this.render = function () {
    var tab = "";
    __config.map(function (item, idx) {
      tab += `<div>
                <input id="tab-${idx}" 
                      value=${item.value}
                      name="tab-nav"
                    type="radio" ${item.checked ? "checked" : ""}/>
                <label for="tab-${idx}">
                ${item.label}
                </label>
              </div>`;
    });


    __element.innerHTML = `<div class="tab-nav">
                              ${tab}
                            </div>`;
  }
}

module.exports = new TabNavigation();
},{"../app/eventstore":8}]},{},[5]);