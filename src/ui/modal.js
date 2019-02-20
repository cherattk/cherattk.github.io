const AppEvent = require('../event').AppEvent;

function Modal(){

  var __element;
  var __state = {
    show : "hide",
    message : "Default Message"
  }

  this.init = function(anchorID) {

    __element = document.getElementById(anchorID);

    AppEvent.addListener("modal-state" , this.modalState.bind(this));

    // browser event
    __element.onclick = this.close.bind(this);
    this.render();
  }

  this.modalState = function(event) {
    __state.show = event.eventMessage.show ? "show" : "hide";
    __state.message = event.eventMessage.message;
    this.render();
  }

  this.close = function(e){
    e.preventDefault();
    if(e.target.className === "modal-close"){
      __state.show = "hide";
      this.render();
    }
  }

  this.render = function() {

    __element.innerHTML = `
                <div class="modal ${__state.show}">
                  <div class="overlay"></div>
                  <div class="modal-content">
                  <div class="modal-close">X</div>
                  <h3>Message</h3>
                  <p>${__state.message}</p>
                  </div>
                </div>
              ` ;
  }
}

module.exports = new Modal();