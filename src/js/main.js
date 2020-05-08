/**
 * @version 0.5.0
 */

/**/
require('../../patch/fixdatastore')();


const DataManager = require('./service/datamanager');

DataManager.init();

// SET COMPONENT =============================
const Form = require('./ui/task-form');
Form("task-form-container");

const TaskDetail = require('./ui/task-detail');
TaskDetail("task-detail-container");

const TaskList = require('./ui/list');
TaskList.Header.init("list-header-container");
TaskList.List.init("task-list-container");


// set it at the end to init task list
const FolderList = require('./ui/folder-list');
FolderList.init("folder-list-container");

const FolderForm = require('./ui/folder-form');
FolderForm.init();


// @todo move to its own component
// error warning message
const AppEvent = require('./service/eventstore').AppEvent;
AppEvent.addListener("error-default-folder-action", function (event) {
  window.alert(event.message.info);
});


// =================================================

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

