const AppEvent = require('./eventstore').AppEvent;

var __taskStore = new Map();
function saveStore() {
  var data = [];
  __taskStore.forEach(function (item) {
    data.push(item);
  });
  window.localStorage.setItem('task', JSON.stringify(data));
  AppEvent.dispatch("update-task-list");
}

const DataManager = {

  init: function () {
    var data = JSON.parse(window.localStorage.getItem('task'));
    // if defined
    if (data instanceof Array) {
      data.forEach(function (item) {
        __taskStore.set(item.task_id, item);
      });
    }
  },

  getTaskList: function (storeName, criteria) {
    return Array.from(__taskStore.values());
  },

  getTask: function (task_id) {
    return result = __taskStore.get(task_id);
  },

  removeTask: function (selectedList) {
    selectedList.forEach(function (selected) {
      __taskStore.delete(selected.task_id);
    })
    saveStore();
  },

  setTask: function (task) {
    __taskStore.set(task.task_id , task);
    saveStore();
  }
}

DataManager.init();
module.exports = DataManager;
