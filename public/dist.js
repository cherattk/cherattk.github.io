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
var PATCH_VERSION = "patch_v2";

module.exports = function FixDataStore() {
  // return;
  if (!window.localStorage) {
    return;
  }

  var storeList = [{
    name: "task",
    action: {
      rename: [[// rename "task_id" property to "id"
      "task_id", "id"]],
      // merge the new properties with the existing properties
      schema: {
        folder_id: "f1"
      }
    }
  }];

  var __originData, __copyData, patchName, patchDone;

  storeList.map(function (patchStoreConfig) {
    // 1 - check if the data store is patched
    patchName = "patch." + patchStoreConfig.name + ".store";
    patchDone = window.localStorage.getItem(patchName);

    if (PATCH_VERSION === patchDone) {
      return;
    } // 2 - the data store is not patched


    var storeData = window.localStorage.getItem(patchStoreConfig.name);

    if (storeData) {
      __originData = JSON.parse(storeData); // apply change and return the the new item

      __copyData = __originData.map(function (item) {
        // create a new field named field[1].value and
        // assign to a new created field the value of 
        // the previous field named field[0]
        var __itemData = Object.assign({}, item, patchStoreConfig.action.schema);

        patchStoreConfig.action.rename.map(function (field_item) {
          if (typeof item[field_item[0]] !== "undefined") {
            __itemData[field[1]] = item[field_item[0]].toString();
            delete __itemData[field[0]];
          }
        }); // no need to store it

        delete __itemData.checked;
        return __itemData;
      });
      window.localStorage.setItem("".concat(patchStoreConfig.name), JSON.stringify(__copyData));
      window.localStorage.setItem(patchName, PATCH_VERSION);
    }
  });
};

},{}],5:[function(require,module,exports){
"use strict";

/**
 * @version 0.5.0
 */

/**/
require('../../patch/fixdatastore')(); // SET COMPONENT =============================


var Form = require('./ui/task-form');

Form("task-form-container");

var TaskList = require('./ui/list');

TaskList.Header.init("list-header-container");
TaskList.List.init("task-list-container"); // set it at the end to init task list

var FolderList = require('./ui/folder-list');

FolderList.init("folder-list-container");

var FolderForm = require('./ui/folder-form');

FolderForm.init(); // @todo move to its own component
// error warning message

var AppEvent = require('./service/eventstore').AppEvent;

AppEvent.addListener("error-default-folder-action", function (event) {
  window.alert(event.message.info);
}); // =================================================
// const ActionBar = require('./ui/actionbar');
// ActionBar.init("task-action-container");
// const TabNavigation = require('./ui/tabnav');
// TabNavigation.init("task-nav-container");

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

},{"../../patch/fixdatastore":4,"./service/eventstore":7,"./ui/folder-form":8,"./ui/folder-list":9,"./ui/list":10,"./ui/task-form":11}],6:[function(require,module,exports){
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
}

function setDefaultDataStore() {
  var store = JSON.parse(window.localStorage.getItem("folder"));

  if (!(store instanceof Array)) {
    var defaultData = [{
      id: "f1",
      name: "All Tasks"
    }];
    window.localStorage.setItem("folder", JSON.stringify(defaultData));
  }
}

var DataManager = {
  init: function init() {
    setDefaultDataStore(); // load stored data into memory

    var storeListName = Object.keys(__dataStore);
    storeListName.forEach(function (storeName) {
      var store = JSON.parse(window.localStorage.getItem(storeName));

      if (store instanceof Array) {
        store.forEach(function (item) {
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
    var result = __dataStore[storeName].get(item_id);

    return result;
  },
  removeItem: function removeItem(storeName, selectedList) {
    if (storeName === "folder") {
      selectedList.forEach(function (folderID) {
        if (folderID !== "f1") {
          __dataStore[storeName]["delete"](folderID); // delete related task


          __dataStore["task"].forEach(function (item) {
            if (item.folder_id === folderID) {
              __dataStore["task"]["delete"](item.id);
            }
          });
        } else {
          AppEvent.dispatch("error-default-folder-action", {
            info: "the default folder can not be deleted"
          });
        }
      });
    }

    if (storeName === "task") {
      selectedList.forEach(function (selected) {
        __dataStore[storeName]["delete"](selected.id);
      });
    }

    saveStore(storeName);
    AppEvent.dispatch("update-".concat(storeName, "-list"));
  },
  setItem: function setItem(storeName, item) {
    if (storeName === "folder" && item.id === "f1") {
      AppEvent.dispatch("error-default-folder-action", {
        info: "the default folder can not be edited"
      });
      return;
    } else {
      __dataStore[storeName].set(item.id, item);

      saveStore(storeName);
      AppEvent.dispatch("update-".concat(storeName, "-list"), {
        item_id: item.id
      });
    }
  }
};
DataManager.init();
module.exports = DataManager;

},{"./eventstore":7}],7:[function(require,module,exports){
"use strict";

var EventSet = require('eventset');

var AppEvent = EventSet.Topic('app.event');
AppEvent.addEvent("active-folder");
AppEvent.addEvent("edit-folder");
AppEvent.addEvent("add-folder");
AppEvent.addEvent("update-folder-list");
AppEvent.addEvent("error-default-folder-action"); ////////////////////////////////////////////

AppEvent.addEvent("edit-item");
AppEvent.addEvent("select-item");
AppEvent.addEvent("modal-state");
AppEvent.addEvent("update-task-list");
AppEvent.addEvent("update-task");
module.exports = {
  AppEvent: AppEvent
};

},{"eventset":1}],8:[function(require,module,exports){
"use strict";

var AppEvent = require('../service/eventstore').AppEvent;

var DataManager = require('../service/datamanager');

var __state = {
  folder: {
    id: "",
    name: ""
  }
};
var FolderForm = {
  init: function init() {
    // var __container = $("#" + anchorID).html(```);
    var __folderForm = $('#folder-form');

    var textField = __folderForm.find('#folder-textfield');

    __folderForm.submit(function (event) {
      event.preventDefault();

      if (!__state.folder.id) {
        __state.folder.id = new Date().getTime().toString(); //return;
      } // add regex filter


      __state.folder.name = textField.val();

      if (!__state.folder.name) {
        alert("You can not set an empty list");
        return;
      }

      DataManager.setItem('folder', __state.folder);
      AppEvent.dispatch("active-folder", {
        folder_id: __state.folder.id
      });
      $("#modal-folder-form").modal('hide');
    });

    AppEvent.addListener("edit-folder", function (event) {
      __state.folder = DataManager.getItem('folder', event.message.folder_id);
      textField.val(__state.folder.name);
      $("#modal-folder-form").modal('show');
    });
    AppEvent.addListener("add-folder", function (event) {
      __state.folder = {
        id: "",
        name: ""
      };
      textField.val("");
      $("#modal-folder-form").modal('show');
    });
  }
};
module.exports = FolderForm;

},{"../service/datamanager":6,"../service/eventstore":7}],9:[function(require,module,exports){
"use strict";

var AppEvent = require('../service/eventstore').AppEvent;

var DataManager = require('../service/datamanager');

var __container;

var __state = {
  list: [],
  active_folder: null
};

var __listNode;

var FolderList = {
  init: function init(anchorID) {
    var __addFolder = $("<button id=\"get-folder-form\" class=\"btn btn-primary\">New List</button>");

    __addFolder.click(function () {
      AppEvent.dispatch("add-folder");
    });

    __listNode = $('<div id="folder-list"></div>');

    __listNode.click(this.listClickHandler.bind(this));

    AppEvent.addListener("update-folder-list", function () {
      __state.list = DataManager.getList('folder');
      FolderList.renderListItem();
    });
    __container = $("#" + anchorID);

    __container.append(__addFolder);

    __container.append(__listNode);

    var self = this;
    AppEvent.addListener("active-folder", function (event) {
      __state.active_folder = event.message.folder_id;
      self.renderListItem();
    });
    __state.list = DataManager.getList('folder');
    this.renderListItem(); // inform other component wich folder is active at init time

    AppEvent.dispatch("active-folder", {
      folder_id: __state.list[0].id
    });
  },
  listClickHandler: function listClickHandler(event) {
    if (event.target.tagName.toLowerCase() === 'span' && event.target.dataset.folderId) {
      var folderId = event.target.dataset.folderId;
      AppEvent.dispatch("active-folder", {
        folder_id: folderId
      });
    }
  },
  emptyState: function emptyState() {
    return "<p class=\"empty-list\">Empty List</p>";
  },
  renderListItem: function renderListItem() {
    var content = "";

    if (!__state.list.length) {
      content = this.emptyState();
    } else {
      __state.list.map(function (_item, index) {
        // init active folder at first element of the list
        var checked = _item.id === __state.active_folder ? "checked" : "";
        content += "\n                <li>\n                  <label>\n                    <input id=\"radio-".concat(_item.id, "\" type=\"radio\" \n                          name=\"folder-list\" ").concat(checked, "/>\n                    <span data-folder-id=\"").concat(_item.id, "\">\n                    ").concat(_item.name, "\n                    </span>\n                  </label>                  \n                </li>");
      });
    }

    __listNode.html("<ul class=\"folder-list\"> ".concat(content, " </ul>"));
  }
};
module.exports = FolderList;

},{"../service/datamanager":6,"../service/eventstore":7}],10:[function(require,module,exports){
"use strict";

var AppEvent = require('../service/eventstore').AppEvent;

var DataManager = require('../service/datamanager');

var Header = function Header() {
  var __state = {
    folder: {}
  };

  this.init = function (anchorID) {
    var __headerContainer = $('<div id="list-header" class="list-header"></div>');

    var __listTitle = $('<h1></h1>');

    var __listHeaderAction = $("\n          <div class=\"list-header-action\">\n            <button class=\"btn\" data-action=\"edit-folder\">\n              <i class=\"far fa-edit\" data-action=\"edit-folder\" title=\"Edit List\"></i>\n            </button>\n            <button class=\"btn\" data-action=\"delete-folder\">\n             <i class=\"fa fa-trash\" data-action=\"delete-folder\" title=\"Delete this task\"></i>\n            </button> \n          </div>");

    __listHeaderAction.click(this.editAction.bind(this));

    __headerContainer.append(__listTitle);

    __headerContainer.append(__listHeaderAction);

    $('#' + anchorID).append(__headerContainer);
    AppEvent.addListener("active-folder", function (event) {
      __state.folder = DataManager.getItem('folder', event.message.folder_id);

      __listTitle.html(__state.folder.name);

      if (event.message.folder_id === "f1") {
        __listHeaderAction.hide();
      } else {
        __listHeaderAction.show();
      }
    }); // AppEvent.addListener("update-folder-list", function (event) {
    //   __state.folder = DataManager.getItem('folder', event.message.item_id);
    //   __listTitle.html(__state.folder.name);
    // });
  };

  this.editAction = function (event) {
    // prevent action on default folder
    if (__state.folder.id === "f1") {
      AppEvent.dispatch("error-default-folder-action", {
        info: "error : action on default folder is not authaurized"
      });
      return;
    }

    if (event.target.dataset.action === "edit-folder") {
      AppEvent.dispatch("edit-folder", {
        folder_id: __state.folder.id
      });
      return;
    }

    if (event.target.dataset.action === "delete-folder") {
      DataManager.removeItem("folder", [__state.folder.id]); // activate the default folder

      AppEvent.dispatch("active-folder", {
        folder_id: "f1"
      });
    }
  };
};

var List = function List() {
  var __listContainer;

  var __listState = {
    list: [],
    // list of item
    folder_id: null
  };

  this.init = function (anchorID) {
    __listContainer = $("#" + anchorID).html("<ul class=\"list\">".concat(this.emptyState(), "</ul>"));

    __listContainer.click(this.clickHandler.bind(this));

    var self = this;
    AppEvent.addListener("active-folder", function (event) {
      __listState.folder_id = event.message.folder_id;
      self.renderListItem();
    });
    AppEvent.addListener("update-task-list", function (event) {
      // __listState.folder_id = event.message.folder_id;
      self.renderListItem();
    });
    this.renderListItem();
  };

  this.clickHandler = function (event) {
    switch (event.target.dataset.action) {
      case "edit-item":
        var task = __listState.list[event.target.dataset.taskIndex];

        if (task.task_label === "completed") {
          alert("the completed task can not be modified");
          return;
        }

        this.editItem(task, event.target.dataset.taskIndex);
        break;

      case "completed":
        var update_task = __listState.list[event.target.dataset.taskIndex];
        update_task.task_label = event.target.checked ? "completed" : "todo";
        DataManager.setItem('task', update_task);
        break;

      case "delete":
        var rm_task = __listState.list[event.target.dataset.taskIndex];
        DataManager.removeItem('task', [rm_task]);
        break;

      default:
        break;
    }
  };

  this.editItem = function (item, itemIndex) {
    var li = __listContainer.find("li[data-task-index=\"".concat(itemIndex, "\"]"));

    li.addClass("hide-content");

    var itemInput = __listContainer.find("#item-textfield-".concat(item.id));

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
  };

  this.emptyState = function () {
    return "<li class=\"empty-list\">Empty List</li>";
  };

  this.renderListItem = function () {
    var folderID = __listState.folder_id === "f1" ? null : __listState.folder_id;
    __listState.list = DataManager.getList('task', folderID).reverse();
    var content = "";

    if (!__listState.list.length) {
      content = this.emptyState();
    } else {
      __listState.list.map(function (_item, index) {
        var isDone = _item.task_label === "completed";
        content += "<li class=\"".concat(_item.task_label, "\" data-task-id=\"").concat(_item.id, "\" data-task-index=\"").concat(index, "\">                \n                    <!--  checkbox -->\n                    <div class=\"checkbox\" title=\"Mark task as completed\">\n                      <input id=\"checkbox-").concat(_item.id, "\"\n                              data-action=\"completed\" data-task-index=\"").concat(index, "\"\n                            type=\"checkbox\"\n                            ").concat(isDone ? "checked" : '', "/>\n                      <label for=\"checkbox-").concat(_item.id, "\">\n                        <span></span>\n                      </label>\n                    </div>\n                    \n                    <!-- item content -->\n                    <div>   \n                      <p>").concat(_item.task_body, "</p>\n                      <!---->\n                      <input id=\"item-textfield-").concat(_item.id, "\" type=\"text\" class=\"textfield\" name=\"task_body\"/>\n                      <!--<textarea id=\"item-textfield-").concat(_item.id, "\"  class=\"textfield\" name=\"task_body\"></textarea>-->\n                    </div>\n                    <!-- item action -->\n                    <div class=\"item-action\">\n                      <button class=\"btn\">\n                      <i class=\"far fa-edit\" data-action=\"edit-item\" \n                      data-task-index=\"").concat(index, "\" title=\"Edit this task\"></i>\n                      </button>\n                      <button class=\"btn\">\n                        <i class=\"fa fa-trash\" data-action=\"delete\" \n                        data-task-index=\"").concat(index, "\" title=\"Delete this task\"></i>\n                      </button>                  \n                    </div>\n          </li>");
      });
    }

    __listContainer.html("<ul class=\"list\">".concat(content, "</ul>"));
  };
};

module.exports = {
  List: new List(),
  Header: new Header()
};

},{"../service/datamanager":6,"../service/eventstore":7}],11:[function(require,module,exports){
"use strict";

var DataManager = require('../service/datamanager');

var AppEvent = require('../service/eventstore').AppEvent;

function TaskForm(anchorID) {
  var __state = {
    task: {}
  };
  var self = this;

  var __form = $("\n    <form id=\"task-form\" class=\"task-form\" title=\"add a new task to do\">\n      <input id=\"task-form-text\" class=\"textfield\" type=\"text\" name=\"task_body\" \n      placeholder=\"Add New Task ...\" />\n    </form>");

  $("#" + anchorID).append(__form);

  __form.submit(function (e) {
    e.preventDefault();
    self.saveForm(e);
  });

  AppEvent.addListener("active-folder", function (event) {
    __state.task.folder_id = event.message.folder_id;
  });

  this.saveForm = function (e) {
    var task_body = e.target.elements['task_body'].value;

    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }

    var item = {
      id: new Date().getTime().toString(),
      folder_id: __state.task.folder_id,
      task_body: task_body
    };
    e.target.reset();
    DataManager.setItem('task', item);
  };
}

module.exports = function (anchor_id) {
  return new TaskForm(anchor_id);
};

},{"../service/datamanager":6,"../service/eventstore":7}]},{},[5]);
