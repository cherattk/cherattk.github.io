/**
 * 
 */
const AppEvent = require('../app/eventstore').AppEvent;

function ProjectList() {

  var _element;
  var _state = {
    projct_list: [
      { id : "1" , name :  "My Project -1 "},
      { id : "2" , name :  "My Project -2 "},
      { id : "3" , name :  "My Project -3 "}
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

  this.click = function(e) {
    if(e.target.tagName === 'LI'){
      alert('select project');
    }
  }

  this.emptyState = function(params) {
    return '<li class="empty-list">Empty List</li>';
  }

  this.renderList = function () {
    var list = `<ul class="list-group list-group-flush">`;
        _state.projct_list.map(function(project) {
          list += `<li class="list-group-item" id="prj-${project.id}">${project.name}</li>`;
        });

    return (_state.projct_list ? list : this.emptyState());

  }

  this.render = function () {
    _element.innerHTML = `
    <div id="project-list" class="project-list modal fade" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">My Projects</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          ${this.renderList()}
        </div>
      </div>

    </div>
  </div>
              ` ;
  }
}

module.exports = new ProjectList();