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
"use strict";

/**
 * Fix the structure of the task object
 */
module.exports = function FixDataStore() {
  // return;
  if (!window.localStorage) {
    return;
  }

  var storeList = [{
    name: "task",
    field: [[// rename "status" property to "stage"
    "status", "stage"]]
  }];

  var __originData, __copyData, patchName, patchDone;

  storeList.map(function (store) {
    // 1 - check if the data store is patched
    patchName = "patch." + store.name + ".store";
    patchDone = window.localStorage.getItem(patchName);

    if (patchDone === "done") {
      return;
    } // 2 - the data store is not patched


    storeData = window.localStorage.getItem(store.name);

    if (storeData) {
      __originData = JSON.parse(storeData); //apply change

      __copyData = __originData.map(function (item) {
        // create a new field named field[1].value and
        // assign to a new created field the value of 
        // the previous field named field[0]
        var __item = Object.assign({}, item);

        store.field.map(function (field) {
          if (typeof item[field[0]] !== "undefined") {
            __item[field[1]] = item[field[0]].toString();
            delete __item[field[0]];
          }
        }); // no need to store it

        delete __item.checked;
        return __item;
      });
      window.localStorage.setItem("".concat(store.name), JSON.stringify(__copyData));
      window.localStorage.setItem(patchName, "done");
    }
  });
};

},{}],5:[function(require,module,exports){
"use strict";

var DataStore = require('./datastore');

var AppEvent = require('./eventstore').AppEvent;

function DataManager() {
  var _dataStore = new DataStore(['task']);

  var _remove = function _remove(store, target_item) {
    var copyStore = {
      name: store.name,
      data: []
    };
    store.data.forEach(function (item) {
      // if item is not in array
      if (target_item.indexOf(item.id) < 0) {
        copyStore.data.push(item);
      }
    });

    _dataStore.saveStore(copyStore);

    return copyStore;
  };

  var _updateStatus = function _updateStatus(store, target_item, value) {
    var copyStore = {
      name: store.name,
      data: []
    };
    store.data.forEach(function (item) {
      if (target_item.indexOf(item.id) >= 0) {
        item.stage = value;
      }

      copyStore.data.push(item);
    });

    _dataStore.saveStore(copyStore);

    return copyStore;
  };

  this.init = function () {// AppEvent.addListener("save-form" , this.save.bind(this));
    // AppEvent.addListener("fetch-list", this.getList.bind(this));
    // AppEvent.addListener("update-item", this.update.bind(this));
  };

  this.save = function (storeName, data) {
    var store = _dataStore.getStore(storeName);

    store.data.push(data);

    _dataStore.saveStore(store);

    AppEvent.dispatch("data-change", {
      store: storeName
    });
  };

  this.update = function (customEvent) {
    var action = customEvent.eventMessage.action;
    var storeName = customEvent.eventMessage.name;
    var targetItem = customEvent.eventMessage.items;
    var value = customEvent.eventMessage.value;

    var store = _dataStore.getStore(storeName);

    var copyStore;

    if (action === "remove") {
      copyStore = _remove(store, targetItem);
    }

    if (action === "update-stage") {
      copyStore = _updateStatus(store, targetItem, value);
    }

    AppEvent.dispatch("data-change", copyStore);
  };

  this.getList = function (customEvent) {
    var storeName = customEvent.eventMessage.name;

    var store = _dataStore.getStore(storeName);

    AppEvent.dispatch("data-change", {
      name: store.name,
      data: store.data
    });
  };
}

var manager = new DataManager();
module.exports = manager;

},{"./datastore":6,"./eventstore":7}],6:[function(require,module,exports){
"use strict";

var LocalStore = require('../lib/localstore.js');

function DataStore(storeList) {
  var __storeArray = LocalStore.loadStore(storeList);

  this.getStore = function (name) {
    var store = __storeArray.filter(function (store) {
      return store.name === name;
    });

    return Object.assign({}, store[0]);
  };

  this.saveStore = function (store) {
    for (var index = 0; index < __storeArray.length; index++) {
      if (__storeArray[index].name === store.name) {
        __storeArray[index] = store;
        break;
      }
    }

    LocalStore.save(store);
  };

  this.genID = function () {
    return Math.random().toString(36).substring(2, 13);
  };
}

module.exports = DataStore;

},{"../lib/localstore.js":8}],7:[function(require,module,exports){
"use strict";

var EventSet = require('eventset');

var AppEvent = EventSet.Topic('app.event');
AppEvent.addEvent("save-form");
AppEvent.addEvent("fetch-list");
AppEvent.addEvent("data-change");
AppEvent.addEvent("modal-state");
AppEvent.addEvent("select-item");
AppEvent.addEvent("update-item");
AppEvent.addEvent("navigate-list");
module.exports = {
  AppEvent: AppEvent
};

},{"eventset":1}],8:[function(require,module,exports){
"use strict";

function LocalStore() {
  this.loadStore = function (storeList) {
    if (!window.localStorage) {
      return;
    }

    var __storeArray = [];
    var storeData;
    storeList.map(function (storeName) {
      storeData = window.localStorage.getItem(storeName);

      if (storeData) {
        __storeArray.push({
          name: storeName,
          data: JSON.parse(storeData)
        });
      } else {
        var __store = {
          name: storeName,
          data: []
        };

        __storeArray.push(__store); // save in browser


        window.localStorage.setItem(__store.name, JSON.stringify(__store.data));
      }
    });
    return __storeArray;
  };

  this.save = function (store) {
    window.localStorage.setItem(store.name, JSON.stringify(store.data));
  };
}

module.exports = new LocalStore();

},{}],9:[function(require,module,exports){
"use strict";

/**
 * @version 0.4.0
 */

/**/
require('../../patch/fixdatastore.js')();

var DataManager = require('./app/datamanager.js');

DataManager.init();

var Form = require('./ui/task-form.js'); // Form.init("task-form");


var List = require('./ui/list.js');

List.init("task-list");

var Modal = require('./ui/modal.js');

Modal.init("task-modal");

var ActionBar = require('./ui/actionbar.js');

ActionBar.init("task-action");

var TabNavigation = require('./ui/tabnav.js');

TabNavigation.init("task-nav");

var ProjectList = require('./ui/project-list.js');

ProjectList.init("div-project-list");
/**
 * 
 */

(function () {
  var bootstrap = [{
    src: "https://code.jquery.com/jquery-3.4.1.slim.min.js",
    integrity: "sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n",
    crossorigin: "anonymous"
  }, {
    src: "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js",
    integrity: "sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo",
    crossorigin: "anonymous"
  }, {
    src: "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js",
    integrity: "sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6",
    crossorigin: "anonymous"
  }];
  bootstrap.map(function (item) {
    var tag = document.createElement("script");
    tag.src = item.src; // tag.crossorigin = item.crossorigin;
    // tag.integrity = item.integrity;

    document.getElementsByTagName("head")[0].appendChild(tag);
  });
})();

},{"../../patch/fixdatastore.js":4,"./app/datamanager.js":5,"./ui/actionbar.js":10,"./ui/list.js":11,"./ui/modal.js":12,"./ui/project-list.js":13,"./ui/tabnav.js":14,"./ui/task-form.js":15}],10:[function(require,module,exports){
"use strict";

var AppEvent = require('../app/eventstore').AppEvent;

var __config = {
  tab: [{
    name: "todo",
    label: "To Do",
    style: "yellow"
  }, {
    name: "doing",
    label: "In progress",
    style: "blue"
  }, {
    name: "done",
    label: "Done",
    style: "green"
  }, {
    name: "delete",
    label: "Delete",
    style: "red"
  }],
  // used to define type of available action
  action: ["todo", "doing", "done", "delete"]
};

function ActionBar() {
  var __element;

  var __state = {
    list: [],
    itemStatus: ""
  };

  this.init = function (anchorID) {
    __element = document.getElementById(anchorID);
    this.render();
    __element.onclick = this.action;
    AppEvent.addListener("select-item", this.updateItemList.bind(this));
    AppEvent.addListener("navigate-list", this.setItemStatus.bind(this));
  };

  this.setItemStatus = function (customEvent) {
    __state.itemStatus = customEvent.eventMessage.stage;
    this.render();
  };

  this.updateItemList = function (event) {
    if (typeof event.eventMessage.id !== "undefined") {
      var id = event.eventMessage.id;
      var checked = event.eventMessage.checked;

      var index = __state.list.indexOf(id);

      if (checked
      /* selected */
      && index < 0
      /* item is not in the array */
      ) {
          __state.list.push(id);

          return;
        }

      if (!checked
      /* unselected */
      && index >= 0
      /* item is in the array */
      ) {
          __state.list.splice(index, 1);

          return;
        }
    }

    if (typeof event.eventMessage.list !== "undefined") {
      __state.list = event.eventMessage.list;
    }
  };

  this.action = function (domEvent) {
    var actionName = domEvent.target.dataset.action;
    var eventMessage;

    if (__state.list.length < 0 || __config.action.indexOf(actionName) < 0) {
      return;
    }

    if (actionName === "delete") {
      eventMessage = {
        action: "remove",
        name: "task",
        items: __state.list.slice()
      };
    } else {
      // for actions : {"todo" , "doing" , "done"}
      eventMessage = {
        action: "update-stage",
        name: "task",
        items: __state.list.slice(),
        value: actionName
      };
    }

    AppEvent.dispatch("update-item", eventMessage);
    __state.list = [];
  };

  this.render = function () {
    var actionList = "";

    __config.tab.map(function (item) {
      if (item.name !== __state.itemStatus) {
        actionList += "<button type=\"button\" data-action=\"".concat(item.name, "\" \n                                  class=\"btn btn-sm btn-").concat(item.style, "\">\n                            ").concat(item.label, "\n                          </button>");
      }
    });

    __element.innerHTML = "                \n                <div class=\"task-action-bar\">                  \n                  <div class=\"task-action-group\">\n                    <label>Move to : </label>                \n                      ".concat(actionList, "\n                  </div>\n                </div>");
  };
}

module.exports = new ActionBar();

},{"../app/eventstore":7}],11:[function(require,module,exports){
"use strict";

var AppEvent = require('../app/eventstore').AppEvent;

var TaskListItem = require('./task-list-item');

function List() {
  var __element;

  var __state = {
    list: [],
    // list of item
    allchecked: false,
    filter: ""
  };

  this.init = function (anchorID) {
    __element = document.getElementById(anchorID); // browser event

    __element.onclick = this.selectItem.bind(this);
    AppEvent.addListener("navigate-list", this.setFilter.bind(this)); // register listener for "change-data" first

    AppEvent.addListener("data-change", this.updateList.bind(this)); // trigger "data-change" event to init list

    AppEvent.dispatch("fetch-list", {
      name: "task"
    });
  };

  this.selectItem = function (ev) {
    var message = {
      checked: ev.target.checked
    };
    var action = ev.target.dataset.action;

    if (sendMessage = action === 'select-all') {
      message.list = __state.list.map(function (item) {
        // this will add "checked" attribute to __state.list[item]
        // to set render html-checkbox element as checked.
        // see this.render()
        if (item.stage === __state.filter) {
          item.checked = ev.target.checked;
          return item.id;
        }
      });

      if (!ev.target.checked) {
        message.list = [];
      }

      __state.allchecked = ev.target.checked;
      this.render();
    } else if (sendMessage = action === 'select-item') {
      message.id = ev.target.dataset.itemId;
    }

    if (sendMessage) {
      AppEvent.dispatch("select-item", message);
    }
  };

  this.updateList = function (event) {
    var name = event.eventMessage.name;

    if (name === "task") {
      __state.list = event.eventMessage.data;
      __state.allchecked = false;
      this.render();
    }
  };

  this.setFilter = function (customEvent) {
    __state.filter = customEvent.eventMessage.stage;
    __state.allchecked = false;

    __state.list.map(function (item) {
      // this will add "checked" attribute to __state.list[item]
      // to render html-checkbox element as (un)checked.
      // see this.render()
      item.checked = false;
    });

    this.render();
    AppEvent.dispatch("select-item", {
      checked: false,
      list: []
    });
  };

  this.renderListItem = function (params) {
    var list = '';

    __state.list.map(function (item) {
      if (item.stage !== __state.filter) {
        return;
      }

      var _item = Object.assign({}, item);

      list += TaskListItem.render(_item);
    });

    return list ? list : "<li class=\"empty-list\">Empty List</li>";
  };

  this.render = function () {
    __element.innerHTML = "          \n          <ul class=\"list\">            \n            ".concat(this.renderListItem(), "\n          </ul>");
  };
}

module.exports = new List();

},{"../app/eventstore":7,"./task-list-item":16}],12:[function(require,module,exports){
"use strict";

var AppEvent = require('../app/eventstore').AppEvent;

function Modal() {
  var __element;

  var __state = {
    show: "hide",
    message: "Default Message"
  };

  this.init = function (anchorID) {
    __element = document.getElementById(anchorID);
    AppEvent.addListener("modal-state", this.modalState.bind(this)); // browser event

    __element.onclick = this.close.bind(this);
    this.render();
  };

  this.modalState = function (event) {
    __state.show = event.eventMessage.show ? "show" : "hide";
    __state.message = event.eventMessage.message;
    this.render();
  };

  this.close = function (e) {
    e.preventDefault();

    if (e.target.className === "modal-close") {
      __state.show = "hide";
      this.render();
    }
  };

  this.render = function () {
    __element.innerHTML = "\n                <div class=\"modal ".concat(__state.show, "\">\n                  <div class=\"overlay\"></div>\n                  <div class=\"modal-content\">\n                  <div class=\"modal-close\">X</div>\n                  <h3>Message</h3>\n                  <p>").concat(__state.message, "</p>\n                  </div>\n                </div>\n              ");
  };
}

module.exports = new Modal();

},{"../app/eventstore":7}],13:[function(require,module,exports){
"use strict";

/**
 * 
 */
var AppEvent = require('../app/eventstore').AppEvent;

var DataManager = require('../app/datamanager');

function ProjectList() {
  var _element;

  var _state = {
    project_list: [{
      id: "1",
      name: "My Project -1 "
    } // { id : "2" , name :  "My Project -2 "},
    // { id : "3" , name :  "My Project -3 "}
    ]
  };

  this.init = function (anchorID) {
    _element = document.getElementById(anchorID); // browser event

    _element.onclick = this.click.bind(this);
    this.render(); // customEvent
    //AppEvent.addListener("navigate-list", this.setItemStatus.bind(this));
  }; // this.setStatus = function (customEvent) {
  //   _state.itemStatus = customEvent.eventMessage.stage;
  // }


  this.click = function (e) {
    if (e.target.tagName === 'LI') {
      alert('select project');
      return;
    }

    if (e.target.id === 'add-project') {
      DataManager.save("task", {});
      e.target.reset();
      return;
    }
  };

  this.emptyState = function (params) {
    return '<li class="empty-list">Empty List</li>';
  };

  this.renderList = function () {
    var list = "<ul class=\"list-group\">";

    _state.project_list.map(function (project) {
      list += "<li class=\"list-group-item\" id=\"prj-".concat(project.id, "\">").concat(project.name, "</li>");
    });

    return _state.project_list ? list : this.emptyState();
  };

  this.render = function () {
    _element.innerHTML = "\n    <div id=\"project-list\" class=\"modal fade project-list\" role=\"dialog\">\n    <div class=\"modal-dialog\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <h4 class=\"modal-title\">My Projects</h4>\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n        </div>\n\n        <div class=\"modal-body form-add-project\"> \n          <form id=\"add-project\">\n            <div class=\"form-group\">\n              <label for=\"project-name\">Project name</label>\n              <input type=\"text\" class=\"form-control\" id=\"project-name\" name=\"project-name\" aria-describedby=\"projectName\">\n              <small id=\"projectName\" class=\"form-text text-muted\">Enter you project name and click save.</small>\n            </div>\n            <button type=\"button\" class=\"btn btn-primary\">Save</button>\n          </form>\n        </div>\n        <div class=\"modal-body\">\n          ".concat(this.renderList(), "          \n        </div>\n      </div>\n\n    </div>\n  </div>");
  };
}

module.exports = new ProjectList();

},{"../app/datamanager":5,"../app/eventstore":7}],14:[function(require,module,exports){
"use strict";

var AppEvent = require('../app/eventstore').AppEvent;

var __config = [{
  value: "todo",
  label: "To Do",
  checked: true
}, {
  value: "doing",
  label: "In Progress",
  checked: false
}, {
  value: "done",
  label: "Done",
  checked: false
}];

function TabNavigation() {
  var __element;

  this.init = function (anchorID) {
    __element = document.getElementById(anchorID);
    AppEvent.dispatch("navigate-list", {
      stage: "todo"
    });
    this.render();
    this.navigate();
  };

  this.navigate = function () {
    var input = __element.querySelectorAll("input[type=\"radio\"]");

    input.forEach(function (item) {
      item.onchange = function (ev) {
        AppEvent.dispatch("navigate-list", {
          stage: ev.target.value
        });
      };
    });
  };

  this.render = function () {
    var tab = "";

    __config.map(function (item, idx) {
      tab += "<div>\n                <input id=\"tab-".concat(idx, "\" \n                      value=").concat(item.value, "\n                      name=\"tab-nav\"\n                    type=\"radio\" ").concat(item.checked ? "checked" : "", "/>\n                <label for=\"tab-").concat(idx, "\">\n                ").concat(item.label, "\n                </label>\n              </div>");
    });

    __element.innerHTML = "<div class=\"tab-nav\">\n                              ".concat(tab, "\n                            </div>");
  };
}

module.exports = new TabNavigation();

},{"../app/eventstore":7}],15:[function(require,module,exports){
"use strict";

// TaskForm
var AppEvent = require('../app/eventstore').AppEvent;

var __config = {
  maxChar: 50
};

function TaskForm() {
  var __element;

  var __state = {
    itemStatus: "todo" // default 

  };

  this.init = function (anchorID) {
    __element = document.getElementById(anchorID); // browser event

    __element.onsubmit = this.submit.bind(this);
    this.render(); // customEvent

    AppEvent.addListener("navigate-list", this.setItemStatus.bind(this));
  };

  this.setItemStatus = function (customEvent) {
    __state.itemStatus = customEvent.eventMessage.stage;
  };

  this.submit = function (e) {
    e.preventDefault();
    var value = e.target.elements['task_label'].value;

    if (!value) {
      AppEvent.dispatch("modal-state", {
        show: true,
        message: "You can not add an empty task"
      });
      return;
    }

    var item = {
      id: new Date().getTime().toString(),
      stage: __state.itemStatus,
      label: value
    };
    AppEvent.dispatch("save-form", {
      name: "task",
      data: item
    });
    e.target.reset();
  };

  this.render = function () {
    __element.innerHTML = "\n                <form class=\"form\">\n                  <input type=\"text\" maxlength=\"".concat(__config.maxChar, "\"\n                        name=\"task_label\" \n                        placeholder=\"Add a task : ").concat(__config.maxChar, " characters max\" />\n                  <input type=\"submit\" value=\"save\" class=\"btn btn-blue\"/>\n                </form>\n              ");
  };
}

module.exports = new TaskForm();

},{"../app/eventstore":7}],16:[function(require,module,exports){
"use strict";

function TaskListItem() {
  this.render = function (item) {
    var checked = false;
    checked = typeof item.checked !== "undefined" && !!item.checked;
    return "<li class=\"".concat(item.stage, "\">\n              <div class=\"checkbox\">\n                <input id=\"item-").concat(item.id, "\"\n                      data-item-id=\"").concat(item.id, "\"\n                      data-action=\"select-item\"\n                      type=\"checkbox\"\n                      ").concat(checked ? "checked" : '', "/>\n                <label for=\"item-").concat(item.id, "\">\n                  <span></span>\n                </label>\n              </div>\n              <p>").concat(item.label, "</p>\n            </li>");
  };
}

module.exports = new TaskListItem();

},{}]},{},[9]);
