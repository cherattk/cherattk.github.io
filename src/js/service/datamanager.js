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
  AppEvent.dispatch(`update-${storeName}-list`);
}

const DataManager = {

  init: function () {

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

  getList: function (storeName, criteria) {
    return Array.from(__dataStore[storeName].values());
  },

  getItem: function (storeName , item_id) {
    return result = __dataStore[storeName].get(item_id);
  },

  removeItem : function (storeName , selectedList) {
    selectedList.forEach(function (selected) {
      __dataStore[storeName].delete(selected.id);
    })
    saveStore(storeName);
  },

  setItem: function (storeName , item) {
    __dataStore[storeName].set(item.id, item);
    saveStore(storeName);
  }

}

DataManager.init();
module.exports = DataManager;
