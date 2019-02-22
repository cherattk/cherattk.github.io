const DataManager = require('../src/app/datamanager.js');
DataManager.init();

const Form = require('../src/ui/form.js');
const List = require('../src/ui/list.js');
const Modal = require('../src/ui/modal.js');
const ActionBar = require('../src/ui/action.js');
const NavBar = require('../src/ui/navbar.js');

Form.init("anchor-form");
List.init("anchor-list");
Modal.init("anchor-modal");
ActionBar.init("anchor-action");
NavBar.init("anchor-navbar"); 