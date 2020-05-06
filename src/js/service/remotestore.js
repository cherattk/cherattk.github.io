
function RemoteStore() {

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