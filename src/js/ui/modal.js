const AppEvent = require('../service/eventstore').AppEvent;

var __element;

const Modal = {

  emptyState: function () {
    // __element.find(".modal-body").html('<h3>Empty Content</h3>');
    //__element.modal("hide");
  },

  setContent: function (contentElement) {
    contentElement.appendTo(__element.find(".modal-body"));    
    __element.modal("show");
    
  },

  init: function (anchorID) {

    __element = $(`<div class="modal fade" role="dialog">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">My Modal</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">                
              </div>
            </div>

          </div>
        </div>`);

    this.emptyState();

    $("#" + anchorID).html(__element);
  }
}

module.exports = Modal;