const AppEvent = require('./eventstore').AppEvent;

const __dataStore = {
  task: new Map(),
  folder: new Map()
}

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

  removeItem: function (storeName, selectedList) {
    if (storeName === "folder") {
      selectedList.forEach(function (folderID) {
        if (folderID !== "f1") {
          __dataStore[storeName].delete(folderID);
          // delete related task
          __dataStore["task"].forEach(function (item) {
            if(item.folder_id === folderID){
              __dataStore["task"].delete(item.id);
          }           
          });
        }
        else{
          AppEvent.dispatch("error-default-folder-action" , {info : "the default folder can not be deleted"});
        }
      });
    }
    if (storeName === "task") {
      selectedList.forEach(function (selected) {
        __dataStore[storeName].delete(selected.id);
      });
    }

    saveStore(storeName);
    AppEvent.dispatch(`update-${storeName}-list`);
  },

  setItem: function (storeName, item) {
    if (storeName === "folder" && item.id === "f1") {
      AppEvent.dispatch("error-default-folder-action" , {info : "the default folder can not be edited"});
      return;
    }
    else{
      __dataStore[storeName].set(item.id, item);
      saveStore(storeName);
      AppEvent.dispatch(`update-${storeName}-list`, { item_id: item.id });
    }
   
  }

}

DataManager.init();
module.exports = DataManager;
