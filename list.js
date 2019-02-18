const customEvent = require('./event').customEvent;

function List(){
  
  var __state , __element;

  this.init =  function(anchorID) {
    __element =  document.getElementById(anchorID);
    __state = {
        list : [
              {
                id : 1,
                status : "done",
                label : "Add example usage for Component based UI"
              },
              {
                id : 2,
                status : "todo",
                label : "Render view by updating state"
              },
              {
                id : 3,
                status : "todo",
                label : "Add delete button"
              },
            ]
      };


    // browser event
    __element.onclick = this.toggleStatus;

    // custom event
    customEvent.addListener("save-task-form" , this.updateList.bind(this));

    this.render();
  }

  this.toggleStatus = function(ev){
    if (ev.target.tagName === 'LI') {
      // https://developer.mozilla.org/fr/docs/Web/API/Element/classList
      ev.target.classList.toggle('done');
    }
  }

  this.updateList = function(event) {
    var item = event.eventMessage.task;
        item.id = (__state.list.length + 1);
    __state.list.push(item);
    this.render();
  }

  this.render = function() {

    var list = "";
    __state.list.forEach(function(item){
      list += `<li class="${item.status}" data-taskid="${item.id}">
                ${item.label}
              </li>`;
    });
    var html = `
          <ul id="todo-list" class="todo-list">
            ${list}
        </ul>`;

    __element.innerHTML = html;

  }
}

module.exports = new List();