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
 * Fix the structure of the task object
 */
var PATCH_VERSION = "patch_v1";

module.exports = function FixDataStore() {
  // return;
  if (!window.localStorage) {
    return;
  }

  var storeList = [{
    name: "task",
    field: [[// rename "task_id" property to "id"
    "task_id", "id"]]
  }];

  var __originData, __copyData, patchName, patchDone;

  storeList.map(function (store) {
    // 1 - check if the data store is patched
    patchName = "patch." + store.name + ".store";
    patchDone = window.localStorage.getItem(patchName);

    if (PATCH_VERSION === patchDone) {
      return;
    } // 2 - the data store is not patched


    var storeData = window.localStorage.getItem(store.name);

    if (storeData) {
      __originData = JSON.parse(storeData); // apply change
      // rename field

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
      window.localStorage.setItem(patchName, PATCH_VERSION);
    }
  });
};

},{}],5:[function(require,module,exports){
"use strict";

/**
 * @version 0.4.0
 */

/**/
require('../../patch/fixdatastore')();

var Form = require('./ui/task-form');

Form.init("task-form-container");

var List = require('./ui/list');

List.init("task-list-container");

var Modal = require('./ui/modal');

Modal.init("task-modal-container"); // const ActionBar = require('./ui/actionbar');
// ActionBar.init("task-action-container");
// const TabNavigation = require('./ui/tabnav');
// TabNavigation.init("task-nav-container");

var FolderList = require('./ui/folder-list');

FolderList.init("folder-list-container");
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

},{"../../patch/fixdatastore":4,"./ui/folder-list":8,"./ui/list":9,"./ui/modal":10,"./ui/task-form":11}],6:[function(require,module,exports){
"use strict";

var AppEvent = require('./eventstore').AppEvent;

var __dataStore = {
  task: new Map(),
  folder: new Map()
};

function saveStore(storeName) {
  var data = [];

  __dataStore[storeName].forEach(function (item) {
    data.push(item);
  });

  window.localStorage.setItem(storeName, JSON.stringify(data));
  AppEvent.dispatch("update-".concat(storeName, "-list"));
}

var DataManager = {
  init: function init() {
    var storeListName = Object.keys(__dataStore);
    storeListName.forEach(function (storeName) {
      var data = JSON.parse(window.localStorage.getItem(storeName));

      if (data instanceof Array) {
        data.forEach(function (item) {
          __dataStore[storeName].set(item.id, item);
        });
      }
    });
  },
  getList: function getList(storeName, folderId) {
    var result = [];

    if (folderId) {
      __dataStore[storeName].forEach(function (item) {
        if (item.folder_id === folderId) {
          result.push(item);
        }
      });

      return result;
    } else {
      return Array.from(__dataStore[storeName].values());
    }
  },
  getItem: function getItem(storeName, item_id) {
    return result = __dataStore[storeName].get(item_id);
  },
  removeItem: function removeItem(storeName, selectedList) {
    selectedList.forEach(function (selected) {
      __dataStore[storeName]["delete"](selected.id);
    });
    saveStore(storeName);
  },
  setItem: function setItem(storeName, item) {
    __dataStore[storeName].set(item.id, item);

    saveStore(storeName);
  }
};
DataManager.init();
module.exports = DataManager;

},{"./eventstore":7}],7:[function(require,module,exports){
"use strict";

var EventSet = require('eventset');

var AppEvent = EventSet.Topic('app.event'); // AppEvent.addEvent("save-form");
// AppEvent.addEvent("fetch-list");
// AppEvent.addEvent("data-change");

AppEvent.addEvent("active-folder");
AppEvent.addEvent("edit-item");
AppEvent.addEvent("select-item");
AppEvent.addEvent("modal-state"); // AppEvent.addEvent("init-app");

AppEvent.addEvent("update-task-list");
module.exports = {
  AppEvent: AppEvent
};

},{"eventset":1}],8:[function(require,module,exports){
"use strict";

/**
 * 
 */
var AppEvent = require('../service/eventstore').AppEvent;

var DataManager = require('../service/datamanager');

var __container;

function FolderList() {
  var __state = {
    list: []
  };

  this.init = function (anchorID) {
    __container = $("#" + anchorID); // browser event

    __container.click(function (event) {
      if (event.target.dataset.action === 'get-folder') {
        AppEvent.dispatch('active-folder', {
          folder_id: __state.list[0].id
        });
        return;
      }
    });

    if (__state.list.length) {
      $('#board-h1').html(folderName);
    }

    this.renderFolderList();
  };

  this.emptyState = function () {
    return '<li data-action="" class="empty-list">Empty List</li>';
  };

  this.renderFolderList = function () {
    var content = "";

    if (!__state.list.length) {
      content = this.emptyState();
    } else {
      __state.list.map(function (folder) {
        content += "<li class=\"list-group-item\" data-action=\"get-folder\" id=\"folder-".concat(folder.id, "\">").concat(folder.name, "</li>");
      });
    }

    __container.append("<ul class=\"list-group list-group-flush\"> ".concat(content, " </ul>"));
  };
}

module.exports = new FolderList();

},{"../service/datamanager":6,"../service/eventstore":7}],9:[function(require,module,exports){
"use strict";

var AppEvent = require('../service/eventstore').AppEvent;

var DataManager = require('../service/datamanager');

var __container;

var __state = {
  list: [],
  // list of item
  folderId: null
};
var TaskList = {
  editItem: function editItem(item, itemIndex) {
    var li = __container.find("li[data-task-index=\"".concat(itemIndex, "\"]"));

    li.addClass("hide-content");

    var itemInput = __container.find("input[id=\"item-".concat(itemIndex, "\"]"));

    itemInput.show();
    itemInput.val(item.task_body);
    itemInput.focus();
    itemInput.blur(function (e) {
      DataManager.setItem('task', Object.assign(item, {
        task_body: e.target.value
      }));
      itemInput.hide();
      li.removeClass("hide-content");
    });
  },
  init: function init(anchorID) {
    __container = $("#" + anchorID).html("<ul class=\"list\">".concat(this.emptyState(), "</ul>"));
    var self = this;

    __container.click(function (event) {
      switch (event.target.dataset.action) {
        case "edit-item":
          var task = __state.list[event.target.dataset.taskIndex];

          if (task.task_label === "completed") {
            alert("the completed task can not be modified");
            return;
          }

          self.editItem(task, event.target.dataset.taskIndex);
          break;

        case "completed":
          var update_task = __state.list[event.target.dataset.taskIndex];
          update_task.task_label = event.target.checked ? "completed" : "todo";
          DataManager.setItem('task', update_task);
          break;

        case "delete":
          var rm_task = __state.list[event.target.dataset.taskIndex];
          DataManager.removeItem('task', [rm_task]);
          break;

        default:
          break;
      }
    });

    AppEvent.addListener("active-folder", function (event) {
      __state.folderId = event.message.folder_id;
      TaskList.renderListItem();
    });
    AppEvent.addListener("update-task-list", function () {
      TaskList.renderListItem();
    });
    this.renderListItem();
  },
  emptyState: function emptyState() {
    return "<li class=\"empty-list\">Empty List</li>";
  },
  renderListItem: function renderListItem() {
    __state.list = DataManager.getList('task', __state.folderId).reverse();
    var content = "";

    if (!__state.list.length) {
      content = this.emptyState();
    } else {
      __state.list.map(function (_item, index) {
        var isDone = _item.task_label === "completed";
        content += "<li class=\"".concat(_item.task_label, "\" data-task-id=\"").concat(_item.id, "\" data-task-index=\"").concat(index, "\">\n                <!--          \n                -->\n                <div class=\"checkbox\" title=\"Mark task as completed\">\n                  <input id=\"checkbox-").concat(_item.id, "\"\n                          data-action=\"completed\" data-task-index=\"").concat(index, "\"\n                        type=\"checkbox\"\n                        ").concat(isDone ? "checked" : '', "/>\n                  <label for=\"checkbox-").concat(_item.id, "\">\n                    <span></span>\n                  </label>\n                </div>    \n                  <p>").concat(index + 1, " - ").concat(_item.task_body, "</p>\n                  <input id=\"item-").concat(index, "\" type=\"text\" name=\"task_body\"/>\n                  <!---->\n                  <div class=\"item-action\">\n                  <button class=\"btn\">\n                  <i class=\"far fa-edit\" data-action=\"edit-item\" \n                  data-task-index=\"").concat(index, "\" title=\"Edit this task\"></i>\n                  </button>\n                  <button class=\"btn\">\n                    <i class=\"fa fa-trash\" data-action=\"delete\" \n                    data-task-index=\"").concat(index, "\" title=\"Delete this task\"></i>\n                  </button>                  \n                  </div>\n                </li>");
      });
    }

    __container.html("<ul class=\"list\">".concat(content, "</ul>"));
  }
};
module.exports = TaskList;

},{"../service/datamanager":6,"../service/eventstore":7}],10:[function(require,module,exports){
"use strict";

var AppEvent = require('../service/eventstore').AppEvent;

var __element;

var Modal = {
  emptyState: function emptyState() {// __element.find(".modal-body").html('<h3>Empty Content</h3>');
    //__element.modal("hide");
  },
  setContent: function setContent(contentElement) {
    contentElement.appendTo(__element.find(".modal-body"));

    __element.modal("show");
  },
  init: function init(anchorID) {
    __element = $("<div class=\"modal fade\" role=\"dialog\">\n          <div class=\"modal-dialog modal-lg\">\n            <div class=\"modal-content\">\n              <div class=\"modal-header\">\n                <h4 class=\"modal-title\">My Modal</h4>\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n              </div>\n              <div class=\"modal-body\">                \n              </div>\n            </div>\n\n          </div>\n        </div>");
    this.emptyState();
    $("#" + anchorID).html(__element);
  }
};
module.exports = Modal;

},{"../service/eventstore":7}],11:[function(require,module,exports){
"use strict";

var DataManager = require('../service/datamanager');

function TaskForm() {
  var __state = {
    task: {}
  };

  this.init = function (anchorID) {
    var self = this;

    var __form = $("\n    <form id=\"task-form\" class=\"task-form\" title=\"add a new task to do\">\n      <input type=\"text\" name=\"task_body\" placeholder=\"Task ...\" />\n      <!--<input type=\"submit\" value=\"Save\" class=\"btn btn-primary btn-sm\"/>\n      <input type=\"reset\" value=\"Clear\" class=\"btn btn-secondary btn-sm\"/>-->\n    </form>");

    $("#" + anchorID).append(__form);

    __form.submit(function (e) {
      self.submit(e);
      self.moveForm(true);
    });

    __form.on("reset", function (e) {
      self.moveForm(true);
    });
  };

  this.submit = function (e) {
    e.preventDefault();
    var task_body = e.target.elements['task_body'].value;

    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }

    var item = {
      id: __state.task.id ? __state.task.id : new Date().getTime().toString(),
      task_label: "todo",
      task_body: task_body
    };
    e.target.reset();
    DataManager.setItem('task', item);
  };
}

module.exports = new TaskForm();

},{"../service/datamanager":6}]},{},[5]);
