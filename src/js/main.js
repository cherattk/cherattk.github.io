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
      src: 'https://code.jquery.com/jquery-3.3.1.slim.min.js',
      integrity: "sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo",
      crossorigin: "anonymous"
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js",
      integrity: "sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1",
      crossorigin: "anonymous"
    },
    {
      src: "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js",
      integrity: "sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM",
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

