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