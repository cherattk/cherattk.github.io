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
    version: "v2",
    action: {
      rename: [[// rename "task_id" property to "id"
      "task_id", "id"]],
      add: [// add new properties
      // [0] = field name , [1] = field value
      ["folder_id", "f1"], ["task_description", "Task Decsription"]]
    }
  }, {
    name: "folder",
    version: "v1",
    action: {
      rename: [],
      add: [// add new properties
      // [0] = field name , [1] = field value
      ["color", "default"]]
    }
  }];

  var __originData, __copyData, patchName, patchDone;

  storeList.map(function (patchStoreConfig) {
    // 1 - check if the data store is patched
    patchName = "patch." + patchStoreConfig.name + ".store";
    patchDone = window.localStorage.getItem(patchName);

    if (patchStoreConfig.version === patchDone) {
      return;
    } // 2 - the data store is not patched


    var storeData = window.localStorage.getItem(patchStoreConfig.name);

    if (storeData) {
      __originData = JSON.parse(storeData); // apply change and return the the new item

      __copyData = __originData.map(function (item) {
        // create a new field named field[1].value and
        // assign to a new created field the value of 
        // the previous field named field[0]
        var __itemData = Object.assign({}, item);

        if (patchStoreConfig.action.rename) {
          patchStoreConfig.action.rename.map(function (field_item) {
            if (typeof item[field_item[0]] !== "undefined") {
              __itemData[field[1]] = item[field_item[0]].toString();
              delete __itemData[field[0]];
            }
          });
        }

        if (patchStoreConfig.action.add) {
          patchStoreConfig.action.add.map(function (field_item) {
            if (typeof item[field_item[0]] === "undefined") {
              __itemData[field_item[0]] = field_item[1].toString();
            }
          });
        } // no need to store it
        // delete __itemData.checked;


        return __itemData;
      });
      window.localStorage.setItem("".concat(patchStoreConfig.name), JSON.stringify(__copyData));
      window.localStorage.setItem(patchName, patchStoreConfig.version);
    }
  });
};

},{}],5:[function(require,module,exports){
"use strict";

/**
 * @version 0.5.0
 */

/**/
require('../../patch/fixdatastore')();

require('./ui/misc')();

var DataManager = require('./service/datamanager');

DataManager.init(); // SET COMPONENT =============================

var Form = require('./ui/task-form');

Form("task-form-container");

var TaskDetail = require('./ui/task-detail');

TaskDetail("task-detail-container");

var TaskList = require('./ui/task-list');

TaskList.Header.init("list-header-container");
TaskList.List.init("task-list-container"); // set it at the end to init task list

var FolderList = require('./ui/folder-list');

FolderList.init("folder-list-container");

var FolderForm = require('./ui/folder-form');

FolderForm.init('folder-form-container'); // @todo move to its own component
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

},{"../../patch/fixdatastore":4,"./service/datamanager":6,"./service/eventstore":7,"./ui/folder-form":9,"./ui/folder-list":10,"./ui/misc":11,"./ui/task-detail":12,"./ui/task-form":13,"./ui/task-list":14}],6:[function(require,module,exports){
"use strict";

var AppEvent = require('./eventstore').AppEvent;

var RemoteStore = require('./remotestore');

var __dataStore = {
  task: new Map(),
  folder: new Map()
};

function saveLocalStore(storeName) {
  var data = [];

  __dataStore[storeName].forEach(function (item) {
    data.push(item);
  });

  window.localStorage.setItem(storeName, JSON.stringify(data));
}

function setDefaultDataStore() {
  var store = JSON.parse(window.localStorage.getItem("folder"));

  if (!(store instanceof Array)) {
    var defaultFolderData = [{
      id: "f1",
      name: "All Tasks",
      color: "default"
    }];
    window.localStorage.setItem("folder", JSON.stringify(defaultFolderData));
  }

  var store = JSON.parse(window.localStorage.getItem("task"));

  if (!(store instanceof Array)) {
    var defaultTaskData = [];
    window.localStorage.setItem("task", JSON.stringify(defaultTaskData));
  }
}

module.exports = {
  init: function init() {
    setDefaultDataStore(); // load stored data into memory

    var storeListName = Object.keys(__dataStore);
    storeListName.forEach(function (storeName) {
      RemoteStore.getDataList(storeName, function (remoteDataStore) {
        var __localStore = JSON.parse(window.localStorage.getItem(storeName));

        var dataStore = __localStore.concat(remoteDataStore); // @todo : check create time of item to set the most recent one


        dataStore.forEach(function (item) {
          var d = __dataStore[storeName].get(item.id); // check if previous item is recent


          if (!d || d.create_time < item.create_time) {
            __dataStore[storeName].set(item.id, item);
          }
        });
        saveLocalStore(storeName);
      });
    });
  },
  setItem: function setItem(storeName, item) {
    if (storeName === "folder" && item.id === "f1") {
      AppEvent.dispatch("error-default-folder-action", {
        info: "the default folder can not be edited"
      });
      return;
    } else {
      // required 
      var __copy = Object.assign({}, item);

      __dataStore[storeName].set(__copy.id, __copy); // __dataStore[storeName].push(item);


      saveLocalStore(storeName);
      console.log('set item'); // console.log(__dataStore[storeName]);

      console.log(Array.from(__dataStore[storeName].values()));
      RemoteStore.setItem(storeName, item);
      AppEvent.dispatch("update-".concat(storeName, "-list"), {
        item_id: item.id
      });
    }
  },
  removeItem: function removeItem(storeName, itemId) {
    var __error = "";

    if (storeName === "folder") {
      if (itemId !== "f1") {
        if (!__dataStore["folder"]["delete"](itemId)) {
          __error = "folder not found with id : " + itemId;
        } // delete related task


        __dataStore["task"].forEach(function (task) {
          if (task.folder_id === itemId) {
            // move task to default folder       
            task.folder_id = "f1";
          }
        });
      } else {
        AppEvent.dispatch("error-default-folder-action", {
          info: "the default folder can not be deleted"
        });
      }
    } else if (storeName === "task") {
      if (!__dataStore["task"]["delete"](itemId)) {
        __error = "task not found with id : " + itemId;
      }
    }

    if (__error) {
      alert(__error);
      console.error(__error);
      return;
    }

    saveLocalStore(storeName);
    RemoteStore.removeItem(storeName, itemId);
    AppEvent.dispatch("update-".concat(storeName, "-list"));
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
  }
};

},{"./eventstore":7,"./remotestore":8}],7:[function(require,module,exports){
"use strict";

var EventSet = require('eventset');

var AppEvent = EventSet.Topic('app.event');
AppEvent.addEvent("active-folder");
AppEvent.addEvent("edit-folder");
AppEvent.addEvent("add-folder");
AppEvent.addEvent("update-folder-list");
AppEvent.addEvent("error-default-folder-action"); ////////////////////////////////////////////

AppEvent.addEvent("get-task-detail");
AppEvent.addEvent("close-task-detail"); // AppEvent.addEvent("edit-item");
// AppEvent.addEvent("select-item");
// AppEvent.addEvent("modal-state");

AppEvent.addEvent("update-task-list"); // AppEvent.addEvent("update-task");

module.exports = {
  AppEvent: AppEvent
};

},{"eventset":1}],8:[function(require,module,exports){
"use strict";

function RemoteStore() {
  this.getDataList = function (storeName, callback) {
    var fakeData = {
      folder: [],
      task: []
    };
    callback(fakeData[storeName]); // var fakeData_2 = {folder : [] , task : []};
    // callback(fakeData_2[storeName]);
    // var url = "http://localhost:8080/" + storeName.toString() + "/list";
    // jQuery.ajax({
    //   url: url.toString(),
    //   method: "GET",
    //   dataType: "json"
    // }).done(function (data, textStatus, jqXHR) {
    //   callback(data);
    // }).fail(function (jqXHR, textStatus, errorThrown) {
    // });
  };

  this.removeItem = function removeItem(storeName, itemId) {// var url = "http://localhost:8080/" + storeName.toString() + "?" + "id=" + itemId
    // jQuery.ajax({
    //   url: url.toString(),
    //   method: "DELETE",
    //   dataType: "json"
    // }).done(function (data, textStatus, jqXHR) {
    //   console.log(data);
    // }).fail(function (jqXHR, textStatus, errorThrown) {
    // });
  };

  this.setItem = function setItem(storeName, itemData) {// var url = "http://localhost:8080/" + storeName.toString() ;
    // jQuery.ajax({
    //   url: url.toString(),
    //   method: "POST",
    //   dataType: "json",
    //   data : itemData
    // }).done(function (data, textStatus, jqXHR) {
    //   console.log(data);
    // }).fail(function (jqXHR, textStatus, errorThrown) {
    // });
  };
}

module.exports = new RemoteStore();

},{}],9:[function(require,module,exports){
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
  init: function init(anchorID) {
    var __folderForm = $("\n    <div class=\"modal fade\" role=\"document\">\n    <div class=\"modal-dialog\">\n      <div class=\"modal-content folder-form\">\n        <div class=\"modal-header\">\n          <h4 class=\"modal-title\">\n          Edit List\n          </h4>\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n        </div>\n\n        <form id=\"folder-form\">\n          <div class=\"modal-body\">\n\n            <label class=\"form-label\">Name</label>\n            <input id=\"folder-name\" type=\"text\" \n                  class=\"textfield textfield-default\" placeholder=\"List Name\" />\n\n            <label class=\"form-label\">Color</label>\n            <div id=\"color-panel\" class=\"color-panel\"></div>\n              \n          </div>\n          <div class=\"modal-footer\">\n            <input type=\"submit\" value=\"Save\" class=\"btn btn-primary\" />\n          </div>\n        </form>\n      </div>\n    </div>\n  </div>\n    "); // ============= COLOR PANEL ================================


    var __colorPanel = __folderForm.find("#color-panel");

    var __colorList = ["default", "red", "purple", "yellow", "green"];
    var __colorPanelContent = "";

    __colorList.forEach(function (color, index) {
      __colorPanelContent += "<label>\n        <input type=\"radio\" value=\"".concat(color, "\" name=\"color-panel-value\" \n        ").concat(color === 'default' ? "checked=\"chekced\"" : "", "/>\n        <span class=\"bg-color-").concat(color, "\"></span>\n      </label>");
    });

    __colorPanel.append(__colorPanelContent); // ===========================================================


    $("#" + anchorID).append(__folderForm);

    var textField = __folderForm.find('#folder-name');

    __folderForm.submit(function (event) {
      event.preventDefault();

      if (!__state.folder.id) {
        __state.folder.id = new Date().getTime().toString(); //return;
      } // add regex filter


      __state.folder.name = textField.val();

      if (!__state.folder.name) {
        alert("You can not set an empty list");
        return;
      } // set color


      __state.folder.color = event.target.elements['color-panel-value'].value;
      DataManager.setItem('folder', __state.folder);
      AppEvent.dispatch("active-folder", {
        folder_id: __state.folder.id
      });

      __folderForm.modal('hide');

      __state.folder = {};
      event.target.reset();
    });

    AppEvent.addListener("edit-folder", function (event) {
      __state.folder = DataManager.getItem('folder', event.message.folder_id);
      textField.val(__state.folder.name); // var inputList = __colorPanelContent.find('input[type="radio"]');

      __colorPanel.find('input[type="radio"]').each(function (index, __input) {
        if (this.value === __state.folder.color) {
          this.checked = "checked";
        }
      });

      __folderForm.modal('show');
    });
    AppEvent.addListener("add-folder", function (event) {
      __state.folder = {
        id: "",
        name: ""
      };
      textField.val("");

      __folderForm.modal('show');
    });
  }
};
module.exports = FolderForm;

},{"../service/datamanager":6,"../service/eventstore":7}],10:[function(require,module,exports){
"use strict";

/**
 * 
 */
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
    var __addFolder = $("<button id=\"get-folder-form\" class=\"btn btn-primary\" title=\"Create List\">                          \n                          List\n                        </button>");

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
    return "";
  },
  renderListItem: function renderListItem() {
    var content = "";

    if (!__state.list.length) {
      content = this.emptyState();
    } else {
      content = "<ul class=\"folder-list\">";

      __state.list.map(function (_item, index) {
        // init active folder at first element of the list
        var checked = _item.id === __state.active_folder ? "checked" : "";
        content += "\n                <li>\n                  <label\n                    class=\"folder-list-item border-color-".concat(_item.color, "\">\n                    <input id=\"radio-folder-").concat(_item.id, "\" type=\"radio\" \n                          name=\"folder-list\" ").concat(checked, "/>\n                    ").concat(_item.name, "          \n                    <span data-folder-id=\"").concat(_item.id, "\" \n                          class=\"item-color-").concat(_item.color, "\">").concat(_item.name, "</span>                      \n                  </label>\n                </li>");
      });

      content += "</ul>";
    }

    __listNode.html(content);
  }
};
module.exports = FolderList;

},{"../service/datamanager":6,"../service/eventstore":7}],11:[function(require,module,exports){
"use strict";

module.exports = function () {
  var boardContainer = $('#board-container');
  var __checked = true; // false if the boardContainer is Displayed

  $('#main-menu-btn').click(function (e) {
    __checked = !__checked;

    if (!__checked) {
      boardContainer.addClass('show-main-menu'); // boardContainer.show(300);
    } else {
      boardContainer.removeClass('show-main-menu'); // boardContainer.hide(300);
    }

    $(this).blur();
  }); // regex from stackoverflow
  // https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device?answertab=votes#tab-top

  var mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());

  if (mobile) {
    $('#main-menu').click(function () {
      // boardContainer.find('#main-menu-bkg-div').click(function(){
      __checked = true;
      boardContainer.removeClass('show-main-menu');
    });
  }
};

},{}],12:[function(require,module,exports){
"use strict";

var AppEvent = require('../service/eventstore').AppEvent;

var DataManager = require('../service/datamanager');

module.exports = function TaskDetail(anchorID) {
  var __state = {
    task: {}
  };

  var __div = $("\n    <div class=\"task-detail\">\n      <div class=\"inner-container\">\n        <div class=\"task-details-form\">\n        <h1>Task Details        \n        <button id=\"close-form\" class=\"close\">X</button>\n        </h1>\n        <form id=\"task-detail-form\" title=\"Edit Task Details\">\n          <label class=\"form-label\">Task</label>\n          <input class=\"textfield textfield-default\" type=\"text\" name=\"task_body\" />\n\n          <label class=\"form-label\">Status</label>\n          <select name=\"task_label\" class=\"textfield textfield-default\">\n            <option value=\"todo\">Todo</option>\n            <option value=\"completed\">Compeleted</option>\n          </select>\n\n          <label class=\"form-label\">Description</label>\n          <textarea class=\"textfield textfield-default\" name=\"task_description\"></textarea>\n\n          <input class=\"btn btn-sm btn-primary\" type=\"submit\" value=\"save\"/>\n\n          <button id=\"delete-item\" class=\"btn btn-sm btn-secondary\" type=\"button\" title=\"Delete task\">\n            Delete\n          </button>\n          </form>\n        </div> <!-- end task form -->\n\n      </div> <!-- end inner container -->\n    </div>");

  $("#" + anchorID).append(__div);

  var __form = __div.find('#task-detail-form');

  __form.submit(function (e) {
    e.preventDefault();

    __saveForm(e);

    __div.addClass('saved-form');

    setTimeout(function () {
      __div.removeClass('saved-form');
    }, 1000);
  });

  __div.find('#delete-item').click(function (e) {
    e.preventDefault();

    if (confirm("you are going to delete the task : are you sure ?")) {
      DataManager.removeItem('task', __state.task.id);

      __closeForm();
    }
  });

  __div.find('#close-form').click(function () {
    __closeForm();
  });

  AppEvent.addListener("active-folder", function (event) {
    // just close the task detail folder
    if (event.message.folder_id != "f1" && event.message.folder_id != __state.task.folder_id) {
      __closeForm();
    }
  });
  AppEvent.addListener("get-task-detail", function (event) {
    __state.task = Object.assign({}, event.message.task);

    __div.addClass('show-task-detail');

    var targetForm = __form.get(0);

    targetForm.elements['task_body'].value = __state.task.task_body;
    targetForm.elements['task_label'].value = __state.task.task_label;
    targetForm.elements['task_description'].value = __state.task.task_description;
  });

  function __saveForm(e) {
    var task_body = e.target.elements['task_body'].value;

    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }

    __state.task.task_body = task_body;
    __state.task.task_label = e.target.elements['task_label'].value;
    __state.task.task_description = e.target.elements['task_description'].value; //e.target.reset();

    DataManager.setItem('task', __state.task);
  }

  function __closeForm() {
    __div.removeClass('show-task-detail');

    __state.task = {};

    __form.trigger('reset');

    AppEvent.dispatch('close-task-detail');
  }
};

},{"../service/datamanager":6,"../service/eventstore":7}],13:[function(require,module,exports){
"use strict";

var DataManager = require('../service/datamanager');

var AppEvent = require('../service/eventstore').AppEvent;

function TaskForm(anchorID) {
  var __state = {
    task: {
      id: "",
      folder_id: "f1",
      task_body: "New Task",
      task_label: "todo",
      task_description: "Task Description"
    }
  };
  var self = this;

  var __form = $("\n    <div class=\"task-form\">\n      <form id=\"task-form\" title=\"add a new task to do\">\n        <input id=\"task-form-text\" class=\"textfield textfield-default\" type=\"text\" name=\"task_body\" \n              placeholder=\"Add New Task ...\" />       \n        <input type=\"submit\" value=\"Save\" class=\"btn btn-sm btn-blue\" name=\"task_save\"/>\n      </form>\n    </div>");

  $("#" + anchorID).append(__form);

  __form.submit(function (e) {
    e.preventDefault();

    __saveForm(e); // AppEvent.dispatch('get-task-detail', { task: __state.task });

  });

  AppEvent.addListener("active-folder", function (event) {
    __state.task.folder_id = event.message.folder_id;
    var folder = DataManager.getItem('folder', event.message.folder_id);

    var form = __form.find('form').get(0);

    form.elements['task_body'].className = "textfield textfield-".concat(folder.color);
    form.elements['task_save'].className = "btn btn-sm btn-".concat(folder.color);
  });

  function __saveForm(e) {
    var task_body = e.target.elements['task_body'].value;

    if (!task_body) {
      alert("You can not add an empty task");
      return;
    }

    var item = Object.assign({}, __state.task, {
      id: new Date().getTime().toString(),
      task_body: task_body
    });
    __state.task = item;
    e.target.reset();
    DataManager.setItem('task', item);
  }
}

module.exports = function (anchor_id) {
  return new TaskForm(anchor_id);
};

},{"../service/datamanager":6,"../service/eventstore":7}],14:[function(require,module,exports){
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
      __state.folder = DataManager.getItem('folder', event.message.folder_id); // $('#board-content-inner').attr('class' , `theme-color-${__state.folder.color}`);

      __headerContainer.attr('class', "list-header bg-color-".concat(__state.folder.color));

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
      var msg = "Do you realy want to delete this list : " + __state.folder.name + "\n";
      msg += "the tasks contained in this list will be moved to the \"All Tasks\" list";

      if (confirm(msg)) {
        DataManager.removeItem("folder", __state.folder.id); // activate the default folder afetr delete action

        AppEvent.dispatch("active-folder", {
          folder_id: "f1"
        });
      }
    }
  };
};

var List = function List() {
  var __listContainer;

  var __listState = {
    list: [],
    // list of item
    folder_id: null,
    active_task: ""
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
    AppEvent.addListener("close-task-detail", function (event) {
      __listState.active_task = "";
      self.renderListItem();
    });
    AppEvent.addListener("get-task-detail", function (event) {
      __listState.active_task = event.message.task.id;
      self.renderListItem();
    });
    this.renderListItem();
  };

  this.clickHandler = function (event) {
    switch (event.target.dataset.action) {
      case "edit-item":
        var task = __listState.list[event.target.dataset.taskIndex];
        AppEvent.dispatch('get-task-detail', {
          task: task
        });
        break;

      case "completed":
        var update_task = __listState.list[event.target.dataset.taskIndex];
        update_task.task_label = event.target.checked ? "completed" : "todo";
        DataManager.setItem('task', update_task);
        break;

      case "delete":
        var rm_task = __listState.list[event.target.dataset.taskIndex]; // if (confirm(`You are going to delete this task : \n "${rm_task.task_body}"`)) {
        //   DataManager.removeItem('task', rm_task.id);
        // }

        DataManager.removeItem('task', rm_task.id);
        break;

      default:
        break;
    }
  }; // this.editItem = function (item, itemIndex) {
  //   var li = __listContainer.find(`li[data-task-index="${itemIndex}"]`);
  //   li.addClass("hide-content");
  //   var itemInput = __listContainer.find(`#item-textfield-${item.id}`);
  //   itemInput.show();
  //   itemInput.val(item.task_body);
  //   itemInput.focus();
  //   itemInput.blur(function (e) {
  //     DataManager.setItem('task', Object.assign(item, { task_body: e.target.value }));
  //     itemInput.hide();
  //     li.removeClass("hide-content");
  //   });
  // }


  this.emptyState = function () {
    return "";
  };

  this.renderListItem = function () {
    var folderID = __listState.folder_id === "f1" ? null : __listState.folder_id;
    __listState.list = DataManager.getList('task', folderID).reverse();
    var content = "";

    if (!__listState.list.length) {
      content = this.emptyState();
    } else {
      content = "<ul class=\"mylist\">";

      __listState.list.map(function (_item, index) {
        var __label = _item.task_label === "completed" ? "<span class=\"badge badge-success\">completed</span>" : "<span class=\"badge badge-warning\">To Do</span>"; // todo


        var active_item = _item.id === __listState.active_task ? "active" : "";
        var checked = _item.task_label === "completed" ? "checked=\"checked\"" : "";
        content += "<li class=\"task-state-".concat(_item.task_label, " ").concat(active_item, "\" \n                        data-task-id=\"").concat(_item.id, "\" \n                        data-task-index=\"").concat(index, "\"\n                        data-action=\"edit-item\">      \n                        \n                        ").concat(_item.task_body, "\n\n                        <button data-task-index=\"").concat(index, "\" class=\"btn\" data-action=\"delete\">\n                          <i data-task-index=\"").concat(index, "\" \n                              class=\"fa fa-trash\" data-action=\"delete\" title=\"Delete this task\"></i>\n                        </button>\n\n                        <div class=\"checkbox\">\n                          <label>\n                          <input type=\"checkbox\" name=\"checkbox_btn\" ").concat(checked, "\n                          data-action=\"completed\" data-task-index=\"").concat(index, "\"/>\n                          <span></span>\n                          </label>\n                        </div>\n\n                    </li>");
      });

      content += "</ul>";
    }

    __listContainer.html("".concat(content)); // __listContainer.html(`<div class="mylist">${content}</div>`);

  };
};

module.exports = {
  List: new List(),
  Header: new Header()
};

},{"../service/datamanager":6,"../service/eventstore":7}]},{},[5]);
