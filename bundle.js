(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const EventSet = require('eventset');

const customEvent = EventSet.Topic('custom.event');

customEvent.addEvent("save-task-form");
customEvent.addEvent("modal-state");

module.exports = {
    customEvent
}
},{"eventset":6}],2:[function(require,module,exports){
const customEvent = require('./event').customEvent;

function Form(){

  var __element;

  this.init = function(anchorID) {

    __element = document.getElementById(anchorID);

    // browser event
    __element.onsubmit = this.submit.bind(this);

    this.render();
  }

  this.submit = function(e){
    e.preventDefault();
    var value = e.target.elements['task_label'].value;
    if(!value){
      customEvent.dispatch("modal-state" , {
            show : true,
            message : "You can not add an empty task"
      });
      return;
    }

    var item = {
      status : "todo",
      label : value
    };
    customEvent.dispatch("save-task-form", {
      task: item
    });
    e.target.reset();
  }

  this.render = function() {
    __element.innerHTML = `
                <form id="task-form">
                  <input type="text" 
                        name="task_label" 
                        placeholder="Add your task"/>
                  <input type="submit" value="save"/>
                </form>
              ` ;
  }
}

module.exports = new Form();
},{"./event":1}],3:[function(require,module,exports){
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
},{"./event":1}],4:[function(require,module,exports){
const Form = require('./form');
const List = require('./list');
const Modal = require('./modal');

Form.init("anchor-form");
List.init("anchor-list");
Modal.init("anchor-modal");
},{"./form":2,"./list":3,"./modal":5}],5:[function(require,module,exports){
const customEvent = require('./event').customEvent;

function Modal(){

  var __element;
  var __state = {
    show : "hide",
    message : "Default Message"
  }

  this.init = function(anchorID) {

    __element = document.getElementById(anchorID);

    customEvent.addListener("modal-state" , this.modalState.bind(this));

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
},{"./event":1}],6:[function(require,module,exports){
/**
 * @module EventSet
 * @license MIT Licence
 * @copyright Copyright (c) 2018-2019 cheratt karim
 *                                              
 */

const Topic = require('./topic.js');
const Util = require('./util.js');

 /**
  * EventSet 
  */


function EventSet() {

    var _topicList = new Map();

    this.Topic = function(topicName) {
        
        if(!Util.isString(topicName)){
            var errorMsg = `EventSet.createTopic() : topicName argument must be of type string`;            
            throw new TypeError(errorMsg);
        }

        var _topic = null;
        var topicToken = Util.clean(topicName);   

        if(_topicList.has(topicToken)){
            _topic = _topicList.get(topicName);
        }
        else{
            _topic = new Topic(topicName);
            _topicList.set(topicName , _topic);
        }

        return _topic;
    }
}

module.exports = new EventSet();

},{"./topic.js":7,"./util.js":8}],7:[function(require,module,exports){
/**
 * @module Topic
 * @license MIT Licence
 * @copyright Copyright (c) 2018-2019 cheratt karim
 */

 const Util = require('./util.js');

 /**
  * 
  * @param {string} topicName
  * 
  * @retruns {Object} New Topic instance 
  */
function Topic(topicName){

    if(!Util.isString(topicName)){
        var errorMsg = `Topic.Topic() : topicName argument must be of type string`;            
        throw new TypeError(errorMsg);
    }

    var _eventMap = new Map();

    /**
     * Get Topic Name
     * 
     * @returns {string} topic name
     */
    this.getName = function(){
        return topicName;
    }


    /**
     * Get all registered events
     * 
     * @returns {Array<string>} An array of event names
     */
    this.getEvent = function (){
        var result = Array.from(_eventMap.keys());
        return result;
    }

    /**
     * Register the event to the topic
     * 
     * @param   {string} eventName - event name
     * 
     * @returns {Array<string>} An array of event names
     */
    this.addEvent = function (eventName){
        if(!Util.isString(eventName)){
            var errorMsg = `Topic.addEvent() : first argument must be of type string`;            
            throw new TypeError(errorMsg);
        }

        var eventToken = Util.clean(eventName);

        if(!_eventMap.has(eventToken)){
            _eventMap.set(eventToken , new Map());
        }
        return this.getEvent();
    }

    /**
     * Remove the event from the topic and all its event listeners
     * 
     * @param {string} eventName
     * 
     * @returns {Array<string>} An array of events names
     */

    this.removeEvent = function(eventName) {
        if(!Util.isString(eventName)){
            var errorMsg = `Topic.removeEvent() : first argument must be of type string`;            
            throw new TypeError(errorMsg);
        }

        var eventToken = Util.clean(eventName);

        if(_eventMap.has(eventToken)){
            _eventMap.delete(eventToken);
        }
        return this.getEvent();
    }

    /**
     * Register event listener
     * 
     * @param {string} eventName
     * @param {any} listener
     * 
     * @returns {string} listener identifier
     */
    this.addListener = function(eventName , listener){
        if(!Util.isString(eventName)){
            throw new TypeError(`Topic.addListener() : first argument must be a String type`);
        }

        if(typeof listener !== 'function'){
            throw new Error(`Topic.addListener() : second argument must be a Function type`);
        }

        var eventToken = Util.clean(eventName);
        if(!_eventMap.has(eventToken)){
            throw new Error( 'Invalid event name : ' + eventName);
        }

        var listenerMap = _eventMap.get(eventToken);
        var listenerId = eventToken + '/' + (listenerMap.size + 1).toString();
            listenerMap.set(listenerId , listener);
        
        return listenerId;
    }
    

    /**
     * Remove listener
     * 
     * @param {string} listenerId
     * 
     * @retruns {boolean} true if it succeeds, false otherwise
     */
    this.removeListener = function(listenerId){
        if(!Util.isString(listenerId)){
            var errorMsg = `Topic.removeListener() : listenerId argument must be of type string`;            
            throw new TypeError(errorMsg);
        }

        var eventToken = listenerId.split("/" , 1)[0];
        if(!_eventMap.has(eventToken)){
            throw new Error( 'Invalid listener identifier : ' + listenerId);
        }

        var listenerMap  = _eventMap.get(eventToken);
        var deleteResult = listenerMap.delete(listenerId);
        return deleteResult;
    }


    /**
     * Dispatch event
     * 
     * @returns {undefined}
     */
    this.dispatch = function(eventName , message){
        if(!Util.isString(eventName)){
            throw new TypeError(`Topic.dispatch() : first argument must be of type string`);
        }        
        var eventToken = Util.clean(eventName);
        if(!_eventMap.has(eventToken)){
            throw new Error('Invalid event name : ' + eventName);
        }

        var copyMessage = JSON.parse(JSON.stringify(message));
        var event  = {
            topicName    : topicName,
            eventName    : eventName, 
            eventMessage : copyMessage
        };
        
        var listenerMap = _eventMap.get(eventToken);
        listenerMap.forEach(function(listener){
            listener(event);
        });
    }
}

module.exports = Topic;
},{"./util.js":8}],8:[function(require,module,exports){
/**
 * @module Util
 * @license MIT Licence
 * @copyright Copyright (c) 2018-2019 cheratt karim
 */


const Util = {
    
    /**
     * Convert input string to lowercase and remove whitespaces and slashes
     * 
     * @param {string} value to clean 
     */
    clean : function(input){
        if(!this.isString(input)){
            var errorMsg = `Util.clean() : input argument must be of type string`;            
            throw new TypeError(errorMsg);
        }
        return input.toLowerCase().replace(/\s|\//g, "");
    },

    /**
     * 
     * @param {string} input
     */
    isString : function(input){
        return (typeof input === 'string' && input !== '');
    }

};

module.exports = Util;
},{}]},{},[4]);
