/**
 * @version 0.4.0
 */

/**/
require('../../patch/fixdatastore.js')();

const DataManager = require('./app/datamanager.js');
DataManager.init();

const Form = require('./ui/task-form.js');
// Form.init("task-form");

const List = require('./ui/list.js');
List.init("task-list");

const Modal = require('./ui/modal.js');
Modal.init("task-modal");

const ActionBar = require('./ui/actionbar.js');
ActionBar.init("task-action");

const TabNavigation = require('./ui/tabnav.js');
TabNavigation.init("task-nav");

const ProjectList = require('./ui/project-list.js');
ProjectList.init("div-project-list");

/**
 * 
 */
(function () {
  var bootstrap = [
    {
      src: "https://code.jquery.com/jquery-3.4.1.slim.min.js",
      integrity: "sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n",
      crossorigin: "anonymous"
    },
    {
      src: "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js",
      integrity: "sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo",
      crossorigin: "anonymous"
    },
    {
      src: "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js",
      integrity: "sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6",
      crossorigin : "anonymous"
    }
  ]
  bootstrap.map(function(item) {
    var tag = document.createElement("script");
    tag.src = item.src;
    // tag.crossorigin = item.crossorigin;
    // tag.integrity = item.integrity;
    document.getElementsByTagName("head")[0].appendChild(tag);
  })
})();

