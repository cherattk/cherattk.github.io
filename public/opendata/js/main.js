function myStatOne() {

  var __state = {
    viewData: {
      totalRecords: 0,
      businessInMontreal: 0,
      secteurValue: new Map()
    }
  };

  this.init = function () {

    var dataUrl = 'data/requetes_entreprises_covid-19.csv';

    var self = this;
    $.get({
      //url: 'https://montreal.l3.ckan.io/api/3/action/datastore_search',
      // dataType: 'json',
      // data: data,
      url: dataUrl,
      dataType: 'text',
      success: function (csvContent) {
        var data = d3.csvParse(csvContent);
        __state.viewData.totalRecords = data.length;
        self.generateStatData(data);
        self.renderData();

         console.log(data);
      }
    });
  }

  /**
   * 
   */
  this.generateStatData = function (itemArray) {

    itemArray.map(function (item) {
      if (item["Localisation à Montréal"].toLowerCase() === 'oui') {
        __state.viewData.businessInMontreal++;
      }

      // update secteur value
      if (__state.viewData.secteurValue.has(item["Secteur d'activité de l'entreprise"])) {
        __state.viewData.secteurValue.get(item["Secteur d'activité de l'entreprise"]).nbBusinessByCategorie++;
      }
      // if secteur name does not exists in the array, add it
      else {
        __state.viewData.secteurValue.set(item["Secteur d'activité de l'entreprise"],
          { name: item["Secteur d'activité de l'entreprise"], nbBusinessByCategorie: 1 });
      }
    });

  }

  /**
   * 
   */

  this.renderData = function () {

    // ========================================================
    $('#total-business').append(__state.viewData.businessInMontreal);

    // ========================================================
    $('#total-request').append(__state.viewData.totalRecords);

    // ========================================================
    var __viewList = "";
    __state.viewData.secteurValue.forEach(function (_secteur) {
      __viewList += '<p>- <label>' + _secteur.name + ' : </label>' +
        '<span>'+ _secteur.nbBusinessByCategorie +'</span>' +
        '</p>';
    });
    $('#stat-secteur').append(__viewList);
  }

}

$(document).ready(function () {

  var __myStatOne = new myStatOne();
  __myStatOne.init();

});