function LocalStore(){

    this.loadStore = function(storeList) {

        if (!window.localStorage) {
            return;
        }

        var __storeArray = [];
        var storeData;
        storeList.map(function(storeName){
            storeData = window.localStorage.getItem(storeName);
            if(storeData){
                __storeArray.push(
                    {
                        name : storeName,
                        data : JSON.parse(storeData)
                    }
                );
            }
            else{
                let __store = {
                    name : storeName,
                    data : []
                };
                __storeArray.push(__store);

                // save in browser
                window.localStorage.setItem(
                    __store.name , 
                    JSON.stringify(__store.data)
                );
            }
            });

        return __storeArray;        
    }

    this.save = function(store){
        window.localStorage.setItem(
            store.name , 
            JSON.stringify(store.data)
        );
    }
}

module.exports = new LocalStore();


