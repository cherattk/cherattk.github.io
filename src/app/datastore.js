const devSata = [
    {
        id : "1",
        label : "task todo",
        status : "todo"
    },
    {
        id : "2",
        label : "task in progresss",
        status : "progress"
    },
    {
        id : "3",
        label : "task done",
        status : "done"
    },
];


function DataStore(storeList , storeDriver){

    var __storeArray = [];
    
    for (let index = 0; index < storeList.length; index++) {
        __storeArray.push(
            {
                name : storeList[index],
                // data : []
                data : devSata
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


