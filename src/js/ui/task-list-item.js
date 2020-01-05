function TaskListItem() {

  this.render = function (item) {
    
    var checked = false;
    
    checked = (typeof item.checked !== "undefined" && !!item.checked);
    return `<li class="${item.stage}">
              <div class="checkbox">
                <input id="item-${item.id}"
                      data-item-id="${item.id}"
                      data-action="select-item"
                      type="checkbox"
                      ${checked ? "checked" : ''}/>
                <label for="item-${item.id}">
                  <span></span>
                </label>
              </div>
              <p>${item.label}</p>
            </li>`;
  }

}

module.exports = new TaskListItem();