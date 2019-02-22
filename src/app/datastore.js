const demoData = [
    {
        id : "6",
        stage : "doing",
        label : "Sanitize input data"
    },
    {
        id : "1",
        stage : "todo",
        label : "Update Changelog file"
    },
    {
        id : "4",
        stage : "todo",
        label : "Update README.md file"
    },
    {
        id : "5",
        stage : "todo",
        label : "Update package.json file"
    },
    {
        id : "2",
        stage : "doing",
        label : "Fix Bugs"
    },
    {
        id : "3",
        stage : "done",
        label : "Version 0.3.0"
    }
];


function DataStore(storeList , storeDriver){

    var __storeArray = [];
    
    for (let index = 0; index < storeList.length; index++) {
        __storeArray.push(
            {
                name : storeList[index],
                // data : []
                data : demoData
            }
        )       
    }

    this.getStore = function(name){
        var store = __storeArray.filter(function(store){
            return (store.name === name);
        });
        return Object.assign({} , store[0]);
    }

    this.saveStore = function(store){
        for (let index = 0; index < __storeArray.length; index++) {
            if(__storeArray[index].name === store.name){
                __storeArray[index] = store;
                break;
            }            
        }
    }

    this.genID = function(){
        return Math.random().toString(36).substring(2, 13);
    }
}

module.exports = DataStore;


