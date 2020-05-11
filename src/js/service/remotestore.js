
function RemoteStore() {

  this.getDataList = function (storeName, callback) {

    var fakeData = {
      folder: [],
      task: []
    }
    callback(fakeData[storeName]);
    
    // var fakeData_2 = {folder : [] , task : []};
    // callback(fakeData_2[storeName]);

    // var url = "http://localhost:8080/" + storeName.toString() + "/list";
    // jQuery.ajax({
    //   url: url.toString(),
    //   method: "GET",
    //   dataType: "json"

    // }).done(function (data, textStatus, jqXHR) {
    //   callback(data);
    // }).fail(function (jqXHR, textStatus, errorThrown) {

    // });
  }

  this.removeItem = function removeItem(storeName, itemId) {

    // var url = "http://localhost:8080/" + storeName.toString() + "?" + "id=" + itemId
    // jQuery.ajax({
    //   url: url.toString(),
    //   method: "DELETE",
    //   dataType: "json"

    // }).done(function (data, textStatus, jqXHR) {
    //   console.log(data);
    // }).fail(function (jqXHR, textStatus, errorThrown) {

    // });

  }

  this.setItem = function setItem(storeName, itemData) {
    // var url = "http://localhost:8080/" + storeName.toString() ;
    // jQuery.ajax({
    //   url: url.toString(),
    //   method: "POST",
    //   dataType: "json",
    //   data : itemData

    // }).done(function (data, textStatus, jqXHR) {
    //   console.log(data);
    // }).fail(function (jqXHR, textStatus, errorThrown) {

    // });
  }

}

module.exports = new RemoteStore();