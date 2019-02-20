const DataStore = require('./datastore');

const AppEvent = require('../event').AppEvent;

function DataManager(){

  var __dataStore = new DataStore(['task']);
  
  this.init = function(){ 
    AppEvent.addListener("save-form" , this.save.bind(this));
    AppEvent.addListener("fetch-list" , this.getList.bind(this));
    AppEvent.addListener("remove-item" , this.remove.bind(this));
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

  this.remove = function(customEvent){
    var storeName = customEvent.eventMessage.name;
    var idArray = customEvent.eventMessage.list_id;
    var store = __dataStore.getStore(storeName);

    var copyStore = {
      name : store.name,
      data : []
    };

    store.data.forEach(function(item){
      if((idArray.indexOf(item.id) < 0)){
        copyStore.data.push(item);
      }
    })
    __dataStore.saveStore(copyStore);

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