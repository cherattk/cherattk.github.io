const AppEvent = require('../app/eventstore').AppEvent;

const __config = [
  { value: "todo", label: "To Do", checked: true },
  { value: "doing", label: "In Progress", checked: false },
  { value: "done", label: "Done", checked: false }
]

function TabNavigation() {

  var __element;

  this.init = function (anchorID) {
    __element = document.getElementById(anchorID);

    AppEvent.dispatch("navigate-list", {
      stage : "todo"
    });

    this.render();

    this.navigate();
  }

  this.navigate = function () {
    var input = __element.querySelectorAll("input[type=\"radio\"]");
    input.forEach(function(item){
      item.onchange = function (ev) {
        AppEvent.dispatch("navigate-list", {
          stage : ev.target.value
        });
      }
    })
  }

  this.render = function () {
    var tab = "";
    __config.map(function (item, idx) {
      tab += `<div>
                <input id="tab-${idx}" 
                      value=${item.value}
                      name="tab-nav"
                    type="radio" ${item.checked ? "checked" : ""}/>
                <label for="tab-${idx}">
                ${item.label}
                </label>
              </div>`;
    });


    __element.innerHTML = `<div class="tab-nav">
                              ${tab}
                            </div>`;
  }
}

module.exports = new TabNavigation();