(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @module EventSet
 * @license MIT Licence
 * @copyright Copyright (c) 2018-present cheratt karim
 *                                              
 */

const Topic = require('./topic.js');
const Util = require('./util.js');

/**
 * EventSet 
 */
function EventSet() {

  var _topicList = new Map();

  /**
   * @deprecated since 1.8.0
   * @alias of Eventset.createTopic()
   * 
   */
  this.Topic = function(topicName) {
    return this.createTopic(topicName);
  }

/** 
 * Singleton factory for a Topic instance
 * 
 * @param {string} topicName 
 * @returns Topic Instance
 * 
 * */
  this.createTopic = function (topicName) {

    if (!Util.isValidString(topicName)) {
      throw new TypeError(`package eventset : EventSet.createTopic() : topicName argument must be of type string`);
    }

    var _topic = null;
    var _topicToken = Util.clean(topicName);

    if (_topicList.has(_topicToken)) {
      _topic = _topicList.get(topicName);
    }
    else {
      _topic = new Topic(topicName);
      _topicList.set(topicName, _topic);
    }

    return _topic;
  }
}

module.exports = new EventSet();

},{"./topic.js":2,"./util.js":3}],2:[function(require,module,exports){
/**
 * @module Topic
 * @license MIT Licence
 * @copyright Copyright (c) 2018-present cheratt karim
 */

const Util = require('./util.js');

/**
 * Topic constructor
 * 
 * @param {string} topicName
 * @retruns {Object} New Topic instance 
 */

module.exports = function Topic(topicName) {

  if (!Util.isValidString(topicName)) {
    throw new TypeError(`package eventset : Topic.Topic() : topicName argument must be of type string`);
  }

  var _eventMap = new Map();

  /**
   * Get Topic Name
   * 
   * @returns {string} topic name
   */
  this.getName = function () {
    return topicName;
  }

  /**
   * Get all registered events
   * 
   * @returns {Array<string>} An array of event names
   */
  this.getEventList = function () {
    var result = Array.from(_eventMap.keys());
    return result;
  }

  /**
   * Register the event to the topic
   * and returns an array of registered events
   * 
   * @param   {string} eventName - event name
   * 
   * @returns {Array<string>} An array of events
   */
  this.addEvent = function (eventName) {
    if (!Util.isValidString(eventName)) {
      throw new TypeError(`package eventset : Topic.addEvent() : eventName argument must be of type string`);
    }

    var eventToken = Util.clean(eventName);

    if (!_eventMap.has(eventToken)) {
      _eventMap.set(eventToken, new Map());
    }
    return this.getEventList();
  }

  /**
   * Remove the event from the topic and all its attached listeners
   * 
   * @param {string} eventName 
   * @returns {Array<string>} An array of events
   */

  this.removeEvent = function (eventName) {
    if (!Util.isValidString(eventName)) {
      throw new TypeError(`package eventset : Topic.removeEvent() : eventName argument must be of type string`);
    }

    var eventToken = Util.clean(eventName);

    if (_eventMap.has(eventToken)) {
      _eventMap.delete(eventToken);
    }
    return this.getEventList();
  }

  /**
   * Register event listener
   * 
   * @param {string} eventName
   * @param {Function} listener
   * 
   * @returns {string} listener identifier
   */
  this.addListener = function (eventName, listenerCallback, errorCallback) {
    if (!Util.isValidString(eventName)) {
      throw new TypeError(`package eventset : Topic.addListener() : eventName argument must be a String type`);
    }

    if (typeof listenerCallback !== 'function') {
      throw new Error(`package eventset : Topic.addListener() : the listener argument must be a Function`);
    }

    var eventToken = Util.clean(eventName);
    if (!_eventMap.has(eventToken)) {
      throw new Error(`package eventset : Topic.addListener() Invalid event name : event named ${eventName} does not exists`);
    }

    var listenerMap = _eventMap.get(eventToken);
    var listenerId = eventToken + '/' + (listenerMap.size + 1).toString();

    listenerMap.set(listenerId, {
      listener: listenerCallback,
      error: (typeof errorCallback === 'function' ? errorCallback :
        function (listenerError) { console.log(listenerError); })
    });

    return listenerId;
  }


  /**
   * Remove listener
   * 
   * @param {string} listenerId
   * 
   * @retruns {boolean} true if it succeeds, false otherwise
   */
  this.removeListener = function (listenerId) {
    if (!Util.isValidString(listenerId)) {
      throw new TypeError(`package eventset : Topic.removeListener() : listenerId argument must be of type string`);
    }

    var eventToken = listenerId.split("/", 1)[0];
    if (!_eventMap.has(eventToken)) {
      throw new Error(`package eventset : Invalid listener identifier : listener with idetifier ${eventToken} does not exists`);
    }

    var listenerMap = _eventMap.get(eventToken);
    var deleteResult = listenerMap.delete(listenerId);
    return deleteResult;
  }

  /**
   * Trigger event
   * 
   * @returns {undefined}
   */
  this.dispatch = function (eventName, message) {
    if (!Util.isValidString(eventName)) {
      throw new TypeError(`package eventset : Topic.dispatch() : eventName argument must be of type string`);
    }
    var eventToken = Util.clean(eventName);
    if (!_eventMap.has(eventToken)) {
      throw new Error(`package eventset : Topic.dispatch() Invalid event name : event named ${eventName} does not exists`);
    }

    var event = {
      topic: topicName,
      event: eventName,
      message: {}
    };

    // check if the message is of a valid type
    // JSON.stringify() returns undefined for "Function" and "undefined" value
    var copyMessage = JSON.stringify(message);
    if (typeof copyMessage !== 'undefined') {
      event.message = JSON.parse(copyMessage);
    }

    var listenerMap = _eventMap.get(eventToken);
    listenerMap.forEach(function (callback, listener_id) {
      setTimeout(function () {
        try {
          callback.listener(event);
        } catch (error) {
          callback.error( error, event );
        }
      }, 0);
    });
  }
}
},{"./util.js":3}],3:[function(require,module,exports){
/**
 * @module Util
 * @license MIT Licence
 * @copyright Copyright (c) 2018-present cheratt karim
 */


const Util = {

  /**
   * Convert input string to lowercase and remove whitespaces and slashes
   * 
   * @param {string} value to clean 
   */
  clean: function (input) {
    if (!this.isValidString(input)) {
      throw new TypeError(`package eventset : Util.clean(input) : input argument must be of type string`);
    }
    return input.toLowerCase().replace(/\s|\//g, "");
  },

  /**
   * 
   * @param {string} input
   */
  isValidString: function (input) {
    return (typeof input === 'string' && input !== '');
  }

};

module.exports = Util;
},{}],4:[function(require,module,exports){
"use strict";

/**
 * @version 0.4.0
 */

/**/
// require('../../patch/fixdatastore')();
var Form = require('./ui/task-form');

Form.init("task-form-container");

var List = require('./ui/list');

List.init("task-list-container");

var Modal = require('./ui/modal');

Modal.init("task-modal-container"); // const ActionBar = require('./ui/actionbar');
// ActionBar.init("task-action-container");
// const TabNavigation = require('./ui/tabnav');
// TabNavigation.init("task-nav-container");

var ProjectList = require('./ui/folder-list');

ProjectList.init("div-folder-list");
/**
 *
 */
// (function () {
//   var bootstrap = [
//     {
//       src: "https://code.jquery.com/jquery-3.4.1.slim.min",
//       integrity: "sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n",
//       crossorigin: "anonymous"
//     },
//     {
//       src: "https://cdndelivr.net/npm/popper@1.16.0/dist/umd/popper.min",
//       integrity: "sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo",
//       crossorigin: "anonymous"
//     },
//     {
//       src: "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min",
//       integrity: "sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6",
//       crossorigin: "anonymous"
//     }
//   ];
//   bootstrap.map(function (item) {
//     var scriptTag = document.createElement("script");
//     scriptTag.src = item.src;
//     if (scriptTag.readyState) {  // for IE <9
//       scriptTag.onreadystatechange = function () {
//         if (scriptTag.readyState === "loaded" || scriptTag.readyState === "complete") {
//           scriptTag.onreadystatechange = null;
//           loadApp();
//         }
//       };
//     }
//     else { //Others
//       scriptTag.onload = function () {
//         loadApp();
//       };
//     }
//     document.getElementsByTagName("head")[0].appendChild(scriptTag);
//   });
// })();

},{"./ui/folder-list":7,"./ui/list":8,"./ui/modal":9,"./ui/task-form":10}],5:[function(require,module,exports){
"use strict";

var AppEvent = require('./eventstore').AppEvent;

var __taskStore = new Map();

function saveStore() {
  var data = [];

  __taskStore.forEach(function (item) {
    data.push(item);
  });

  window.localStorage.setItem('task', JSON.stringify(data));
  AppEvent.dispatch("update-task-list");
}

var DataManager = {
  init: function init() {
    var data = JSON.parse(window.localStorage.getItem('task')); // if defined

    if (data instanceof Array) {
      data.forEach(function (item) {
        __taskStore.set(item.task_id, item);
      });
    }
  },
  getTaskList: function getTaskList(storeName, criteria) {
    return Array.from(__taskStore.values());
  },
  getTask: function getTask(task_id) {
    return result = __taskStore.get(task_id);
  },
  removeTask: function removeTask(selectedList) {
    selectedList.forEach(function (selected) {
      __taskStore["delete"](selected.task_id);
    });
    saveStore();
  },
  setTask: function setTask(task) {
    __taskStore.set(task.task_id, task);

    saveStore();
  }
};
DataManager.init();
module.exports = DataManager;

},{"./eventstore":6}],6:[function(require,module,exports){
"use strict";

var EventSet = require('eventset');

var AppEvent = EventSet.Topic('app.event'); // AppEvent.addEvent("save-form");
// AppEvent.addEvent("fetch-list");
// AppEvent.addEvent("data-change");
// AppEvent.addEvent("navigate-list");

AppEvent.addEvent("edit-item");
AppEvent.addEvent("select-item");
AppEvent.addEvent("modal-state");
AppEvent.addEvent("init-app");
AppEvent.addEvent("update-task-list");
module.exports = {
  AppEvent: AppEvent
};

},{"eventset":1}],7:[function(require,module,exports){
"use strict";

/**
 * 
 */
var AppEvent = require('../service/eventstore').AppEvent;

var DataManager = require('../service/datamanager');

function FolderList() {
  var __element;

  var __state = {
    edit_folder: {
      id: "",
      name: ""
    },
    folder_list: [{
      id: "1",
      name: "My Folder -1 "
    }, {
      id: "2",
      name: "My Folder -2 "
    }, {
      id: "3",
      name: "My Folder -3 "
    }]
  };

  this.init = function (anchorID) {
    __element = $("#" + anchorID); // browser event

    __element.click(function (event) {
      if (event.target.tagName === 'LI') {
        return;
      } // if (event.target.id === 'add-folder') {
      //   DataManager.setFolder({
      //     id: __state.edit_folder.id,
      //     name: __state.edit_folder.name
      //   });
      //   e.target.reset();
      //   return;
      // }

    });

    this.render(); // customEvent
    //AppEvent.addListener("navigate-list", this.setItemStatus.bind(this));
  }; // this.setStatus = function (customEvent) {
  //   __state.itemStatus = customEvent.eventMessage.stage;
  // }


  this.emptyState = function (params) {
    return '<li class="empty-list">Empty List</li>';
  };

  this.renderList = function () {
    var list = "<ul class=\"list-group\">";

    __state.folder_list.map(function (folder) {
      list += "<li class=\"list-group-item\" id=\"prj-".concat(folder.id, "\">").concat(folder.name, "</li>");
    });

    return __state.folder_list ? list : this.emptyState();
  };

  this.render = function () {
    __element.html("\n    <div id=\"folder-list\" class=\"modal fade folder-list\" role=\"dialog\">\n    <div class=\"modal-dialog modal-lg\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <h4 class=\"modal-title\">My folders</h4>\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n        </div>\n\n        <!--\n        <div class=\"modal-body form-add-folder\">          \n          <button type=\"button\" data-toggle=\"collapse\" data-target=\"#form-add-folder\">add folder</button>\n          <form id=\"form-add-folder\" class=\"collapse\">          \n            <div class=\"form-group\">\n              <label for=\"folder-name\">folder name</label>\n              <input type=\"text\" value=\"\" placeholder=\"Folder Name\"\n                      class=\"form-control\" \n                      id=\"folder-name\" \n                      name=\"folder-name\" aria-describedby=\"folderName\">\n              <small id=\"folderName\" class=\"form-text text-muted\">Enter you folder name and click save.</small>\n            </div>\n            <button type=\"button\" class=\"btn btn-primary\">Save</button>\n            <button type=\"button\" class=\"btn btn-secondary\">Cancel</button>\n          </form>\n        </div>\n        -->\n\n        <div class=\"modal-body\">\n          ".concat(this.renderList(), "          \n        </div>\n      </div>\n\n    </div>\n  </div>"));
  };
}

module.exports = new FolderList();

},{"../service/datamanager":5,"../service/eventstore":6}],8:[function(require,module,exports){
"use strict";

var AppEvent = require('../service/eventstore').AppEvent;

var DataManager = require('../service/datamanager');

function List() {
  var __container;

  var __state = {
    list: [] // list of item

  };

  this.init = function (anchorID) {
    __container = $("#" + anchorID).html("<ul class=\"list\">".concat(this.emptyState(), "</ul>"));
    var self = this;

    __container.click(function (event) {
      switch (event.target.dataset.action) {
        case "edit-item":
          var task = __state.list[event.target.dataset.taskIndex]; //__state.selectedTask.push(task);

          AppEvent.dispatch("edit-item", {
            item: task
          });
          break;

        case "done":
        case "todo":
          var update_task = __state.list[event.target.dataset.taskIndex];
          update_task.task_label = event.target.dataset.action;
          DataManager.setTask(update_task);
          break;

        case "delete":
          var rm_task = __state.list[event.target.dataset.taskIndex];
          DataManager.removeTask([rm_task]);
          break;

        default:
          break;
      }
    });

    AppEvent.addListener("init-app", function () {
      self.renderListItem();
    });
    AppEvent.addListener("update-task-list", function () {
      self.renderListItem();
    });
    this.renderListItem();
  };

  this.emptyState = function () {
    return "<li class=\"empty-list\">Empty List</li>";
  };

  this.renderListItem = function () {
    __state.list = DataManager.getTaskList().reverse();
    var content = "";

    if (!__state.list.length) {
      content = this.emptyState();
    } else {
      __state.list.map(function (_item, index) {
        var isDone = _item.task_label === "done";
        content += "<li class=\"".concat(_item.task_label, " data-task-index=\"").concat(index, "\">\n                <!--\n                <div class=\"checkbox\">\n                  <input id=\"item-").concat(_item.task_id, "\"\n                        data-item-id=\"").concat(_item.task_id, "\"\n                        data-action=\"select-item\" data-task-index=\"").concat(index, "\"\n                        type=\"checkbox\"\n                        ").concat(isDone ? "checked" : '', "/>\n                  <label for=\"item-").concat(_item.task_id, "\">\n                    <span></span>\n                  </label>\n                </div>              \n                -->\n                  <p>").concat(index + 1, " - ").concat(_item.task_body, "</p>\n                  <!---->\n                  <div class=\"item-action\">\n                  <button class=\"btn btn-primary btn-sm\" data-action=\"").concat(isDone ? "todo" : "done", "\" data-task-index=\"").concat(index, "\">\n                  ").concat(isDone ? "Undo" : "Done", "\n                  </button>\n                  <button class=\"btn btn-danger btn-sm\" data-action=\"delete\" data-task-index=\"").concat(index, "\">delete</button>                  \n                  </div>\n                  \n\n                </li>");
      });
    }

    __container.html("<ul class=\"list\">".concat(content, "</ul>"));
  };
}

module.exports = new List();

},{"../service/datamanager":5,"../service/eventstore":6}],9:[function(require,module,exports){
"use strict";

var AppEvent = require('../service/eventstore').AppEvent;

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

},{"../service/eventstore":6}],10:[function(require,module,exports){
"use strict";

// TaskForm
var AppEvent = require('../service/eventstore').AppEvent;

var DataManager = require('../service/datamanager'); // <select class="custom-select mb-3" name="task_label">
//       <option value="todo">Todo</div>
//       <option value="doing">Doing</div>
//     </select>


function TaskForm() {
  var __anchor; //var __openForm = $(`<button class="btn btn-primary btn-sm">New Task</button>`);


  var __form = $("\n    <form id=\"task-form\" class=\"task-form\">\n      <input type=\"text\" name=\"task_body\" class=\"form-control mb-3\" placeholder=\"Task...\" />\n      <!--<input type=\"submit\" value=\"Save\" class=\"btn btn-primary btn-sm\"/>-->\n    </form>");

  this.init = function (anchorID) {
    __anchor = $("#" + anchorID); // __anchor.prepend(__openForm);

    __anchor.append(__form);

    var self = this;

    __form.submit(function (e) {
      self.submit(e);
    });

    AppEvent.addListener("edit-item", function (event) {
      var taskBody = event.message.item.task_body;
      __form.elements['task_body'].value = taskBody;
    });
  };

  this.submit = function (e) {
    e.preventDefault();
    var task_body = e.target.elements['task_body'].value;

    if (!task_body) {
      alert("You can not add an empty task");
      return;
    } // var select = e.target.elements['task_label'];
    //var task_label = select.options[select.selectedIndex].value;


    var item = {
      task_id: new Date().getTime().toString(),
      task_label: "todo",
      task_body: task_body
    };
    DataManager.setTask(item);
    e.target.reset();
  };
}

module.exports = new TaskForm();

},{"../service/datamanager":5,"../service/eventstore":6}]},{},[4]);
