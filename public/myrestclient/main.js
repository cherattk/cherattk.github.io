function restClient(params) {

  var __form = document.getElementById('request-form');

  this.init = function () {

    var self = this;
    __form.onsubmit = function (e) {
      e.preventDefault();
      self.runRequest();
    }
  }

  this.runRequest = function (params) {

    // 1 - check request params value
    var __input = __form.elements;
    var __method = __input['request_verb'].value;

    // @todo : check protocol : "http" or "https" => add "http" if none provide 
    var __url = __input['endpoint_url'].value;
    var __data = __input['request_data'].value.replace("\n" , "&");
    // var __header = __input['request_header'].value;

    if (!__method) { alert('method can not be empty'); return; }
    if (!__url) { alert('endpoint url can not be empty'); return; }

    // run request
    $.ajax({
      method: __method,
      url: __url,
      data: __data
    }).done(function (data, textStatus, jqXHR) {
      var resultView = document.getElementById('result-view');

      resultView.value = JSON.stringify({
        status : textStatus,
        data : data
      }, null , 4);

    }).fail(function (jqXHR, textStatus, errorThrown) {
      var resultView = document.getElementById('result-view');
      resultView.value = JSON.stringify({
        status : textStatus,
        error : errorThrown
      }, null , 4);
    });

  }

}

$(document).ready(function () {
  (new restClient()).init();
});