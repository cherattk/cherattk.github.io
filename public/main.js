/**
 * @version 0.3.0
 */
require('../patch/fixdatastore.js')();

const DataManager = require('../src/app/datamanager.js');
DataManager.init();

const Form = require('../src/ui/form.js');
Form.init("anchor-form");

const List = require('../src/ui/list.js');
List.init("anchor-list");

const Modal = require('../src/ui/modal.js');
Modal.init("anchor-modal");

const ActionBar = require('../src/ui/actionbar.js');
ActionBar.init("anchor-action");

const TabNavigation = require('../src/ui/tabnav.js');
TabNavigation.init("anchor-tabnav"); 