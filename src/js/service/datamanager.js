const AppEvent = require('./eventstore').AppEvent;
const RemoteStore = require('./remotestore');

const __dataStore = {
  task: new Map(),
  folder: new Map()
}

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
    var defaultData = [{ id: "f1", name: "All Tasks" }];
    window.localStorage.setItem("folder", JSON.stringify(defaultData));
  }

}

const DataManager = {

  init: function () {

    setDefaultDataStore();

    // load stored data into memory
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

  getList: function (storeName, folderId) {
    var result = [];
    if (folderId) {
      __dataStore[storeName].forEach(function (item) {
        if (item.folder_id === folderId) {
          result.push(item);
        }
      });
      return result;
    }
    else {
      return Array.from(__dataStore[storeName].values());
    }
  },

  getItem: function (storeName, item_id) {
    var result = __dataStore[storeName].get(item_id);
    return result;
  },

  removeItem: function (storeName, itemId) {
    var __error = "";
    if (storeName === "folder") {
      if (itemId !== "f1") {
        if (! __dataStore["folder"].delete(itemId)) {
          __error = "folder not found with id : " + itemId;
        }
        // delete related task
        __dataStore["task"].forEach(function (task) {
          if (task.folder_id === itemId) { 
            // move task to default folder       
            task.folder_id = "f1";            
          }
        });
      }
      else {
        AppEvent.dispatch("error-default-folder-action", { info: "the default folder can not be deleted" });
      }
    } 
    else if (storeName === "task") {
      if (!__dataStore["task"].delete(itemId)) {
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
    AppEvent.dispatch(`update-${storeName}-list`);
  },

  setItem: function (storeName, item) {
    if (storeName === "folder" && item.id === "f1") {
      AppEvent.dispatch("error-default-folder-action", { info: "the default folder can not be edited" });
      return;
    }
    else {
      __dataStore[storeName].set(item.id, item);
      saveLocalStore(storeName);
      RemoteStore.setItem(storeName, item);
      AppEvent.dispatch(`update-${storeName}-list`, { item_id: item.id });
    }
  }

}

DataManager.init();
module.exports = DataManager;
