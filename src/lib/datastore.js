function DataStore(storeList){

    var __storeArray = [];

    if (typeof Storage !== "undefined") {
        var storeContent;
        storeList.map(function(storeName){
            storeContent = window.localStorage.getItem(storeName);
            if(storeContent){
                // save in memory
                __storeArray.push(
                    {
                        name : storeName,
                        data : JSON.parse(storeContent)
                    }
                );
            }
            else{
                let __store = {
                    name : storeName,
                    data : []
                };
                // save in memory
                __storeArray.push(__store);

                // save in browser
                window.localStorage.setItem(storeName , "[]");
            }
        });
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

        window.localStorage.setItem(store.name , JSON.stringify(store.data));
    }

    this.genID = function(){
        return Math.random().toString(36).substring(2, 13);
    }
}

module.exports = DataStore;


