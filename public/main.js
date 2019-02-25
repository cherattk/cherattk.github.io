/**
 * @version 0.3.0
 */
require('../patch/fixdatastore.js')();

const DataManager = require('../src/app/datamanager.js');
DataManager.init();

const Form = require('../src/ui/form.js');
const List = require('../src/ui/list.js');
const Modal = require('../src/ui/modal.js');
const MoveTo = require('../src/ui/moveto.js');
const TabNavigation = require('../src/ui/tabnav.js');

Form.init("anchor-form");
List.init("anchor-list");
Modal.init("anchor-modal");
MoveTo.init("anchor-action");
TabNavigation.init("anchor-tabnav"); 