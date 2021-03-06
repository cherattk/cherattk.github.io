/**
 * Fix the structure of the task object
 */

const PATCH_VERSION = "patch_v2";

module.exports = function FixDataStore() {

  // return;
  if (!window.localStorage) {
    return;
  }

  const storeList = [
    {
      name: "task",
      version: "v2",
      action: {
        rename: [
          [
            // rename "task_id" property to "id"
            "task_id", "id"
          ]
        ],
        add: [
          // add new properties
          // [0] = field name , [1] = field value
          ["folder_id" ,  "f1"],
          ["task_description" ,  "Task Decsription"]
        ]
      }
    },
    {
      name: "folder",
      version: "v1",
      action: {
        rename: [],
        add: [ 
          // add new properties
          // [0] = field name , [1] = field value
          ["color" , "default"]
        ]
      }
    }
  ];

  var __originData,
    __copyData,
    patchName,
    patchDone;

  storeList.map(function (patchStoreConfig) {

    // 1 - check if the data store is patched
    patchName = ("patch." + patchStoreConfig.name + ".store");
    patchDone = window.localStorage.getItem(patchName);
    if (patchStoreConfig.version === patchDone) {
      return;
    }

    // 2 - the data store is not patched
    var storeData = window.localStorage.getItem(patchStoreConfig.name);
    if (storeData) {
      __originData = JSON.parse(storeData);

      // apply change and return the the new item
      __copyData = __originData.map(function (item) {
        // create a new field named field[1].value and
        // assign to a new created field the value of 
        // the previous field named field[0]
        var __itemData = Object.assign({}, item);

        if (patchStoreConfig.action.rename) {
          patchStoreConfig.action.rename.map(function (field_item) {
            if (typeof item[field_item[0]] !== "undefined") {
              __itemData[field[1]] = item[field_item[0]].toString();
              delete __itemData[field[0]];
            }
          });
        }

        if (patchStoreConfig.action.add) {
          patchStoreConfig.action.add.map(function (field_item) {
            if (typeof item[field_item[0]] === "undefined") {
              __itemData[field_item[0]] = field_item[1].toString();              
            }
          });
        }

        // no need to store it
        // delete __itemData.checked;
        return __itemData;
      });


      window.localStorage.setItem(
        `${patchStoreConfig.name}`,
        JSON.stringify(__copyData)
      );

      window.localStorage.setItem(patchName, patchStoreConfig.version);

    }

  });

}