/**
 * Fix the structure of the task object
 */
module.exports = function FixDataStore(){

  // return;
  if (!window.localStorage) {
    return;
  }

  const storeList = [
    {
      name : "task",
      field : [
        [
          // rename "task_id" property to "id"
          "task_id", "id"
        ]
      ]
    }
  ];

  var __originData , 
      __copyData , 
      patchName , 
      patchDone;

  storeList.map(function(store){
    
    // 1 - check if the data store is patched
    patchName = ("patch." + store.name + ".store");
    patchDone = window.localStorage.getItem(patchName);
    if(patchDone === "done"){
      return;
    }

    // 2 - the data store is not patched
    var storeData = window.localStorage.getItem(store.name);
    if(storeData){
      __originData = JSON.parse(storeData);

      //apply change
      __copyData = __originData.map(function(item){
        // create a new field named field[1].value and
        // assign to a new created field the value of 
        // the previous field named field[0]
        var __item = Object.assign({} , item);
        store.field.map(function(field){          
          if(typeof item[field[0]] !== "undefined"){
            __item[field[1]] = item[field[0]].toString();
            delete __item[field[0]];
          }
        });

         // no need to store it
        delete __item.checked;
        return __item;
      });

      window.localStorage.setItem(
        `${store.name}`, 
        JSON.stringify(__copyData)
      );

      window.localStorage.setItem(patchName , "done");

    }

  });

}