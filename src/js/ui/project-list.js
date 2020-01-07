/**
 * 
 */
const AppEvent = require('../app/eventstore').AppEvent;
const DataManager = require('../core/datamanager');

function ProjectList() {

  var _element;
  var _state = {
    edit_project : {
      id : "",
      name : "",
    },
    project_list: [
      { id: "1", name: "My Project -1 " }
      ,
      // { id : "2" , name :  "My Project -2 "},
      // { id : "3" , name :  "My Project -3 "}
    ]
  }

  this.init = function (anchorID) {

    _element = document.getElementById(anchorID);

    // browser event
    _element.onclick = this.click.bind(this);
    this.render();

    // customEvent
    //AppEvent.addListener("navigate-list", this.setItemStatus.bind(this));
  }

  // this.setStatus = function (customEvent) {
  //   _state.itemStatus = customEvent.eventMessage.stage;
  // }

  this.click = function (e) {
    if (e.target.tagName === 'LI') {
      alert('select project');
      return;
    }
    if (e.target.id === 'add-project') {
      
      DataManager.setProject({
        id : _state.edit_project.id,
        name : _state.edit_project.name
      });
      e.target.reset();
      return;
    }
  }

  this.emptyState = function (params) {
    return '<li class="empty-list">Empty List</li>';
  }

  this.renderList = function () {
    var list = `<ul class="list-group">`;
    _state.project_list.map(function (project) {
      list += `<li class="list-group-item" id="prj-${project.id}">${project.name}</li>`;
    });

    return (_state.project_list ? list : this.emptyState());

  }

  this.render = function () {
    _element.innerHTML = `
    <div id="project-list" class="modal fade project-list" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">My Projects</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <div class="modal-body form-add-project"> 
          <form id="add-project">
            <div class="form-group">
              <label for="project-name">Project name</label>
              <input type="text" value="${_state.project.name}"
                      class="form-control" 
                      id="project-name" 
                      name="project-name" aria-describedby="projectName">
              <small id="projectName" class="form-text text-muted">Enter you project name and click save.</small>
            </div>
            <button type="button" class="btn btn-primary">Save</button>
          </form>
        </div>
        <div class="modal-body">
          ${this.renderList()}          
        </div>
      </div>

    </div>
  </div>` ;
  }
}

module.exports = new ProjectList();