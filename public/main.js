const DataManager = require('../src/app/datamanager.js');
DataManager.init();

const Form = require('../src/ui/form.js');
const List = require('../src/ui/list.js');
const Modal = require('../src/ui/modal.js');
const Action = require('../src/ui/action.js');

Form.init("anchor-form");
List.init("anchor-list");
Modal.init("anchor-modal");
Action.init("anchor-action");