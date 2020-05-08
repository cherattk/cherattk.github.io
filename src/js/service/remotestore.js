
function RemoteStore() {

  this.getDataList = function (storeName, callback) {

    var fakeData = {
      folder: [
        {
          id: "folder-1",
          name: "my fake folder v3",
          create_time: "1588882204630"
        }
      ],
      task: [
        {
          id: (new Date('2020-01-01')).getTime().toString(),
          folder_id: "f1",
          task_body: "New Task 1 - v3",
          task_label: "todo",
          task_description: "Task Description",
          create_time: (new Date('2020-01-03')).getTime().toString()
        },
        {
          id: (new Date('2020-01-02')).getTime().toString(),
          folder_id: "f1",
          task_body: "New Task 2 - v5",
          task_label: "todo",
          task_description: "Task Description",
          create_time: (new Date('2020-01-05')).getTime().toString()
        }
      ]
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