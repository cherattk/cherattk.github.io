function myStatOne() {

  var __state = {
    viewData: {
      totalRecords: 0,
      businessInMontreal: 0,
      secteurValue: new Map()
    }
  };

  this.init = function (dataPathFile) {

    var dataUrl = dataPathFile;

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
        self.renderStatData();
        self.renderGraph();
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

  this.renderStatData = function () {

    // ========================================================
    $('#total-business').append(__state.viewData.businessInMontreal);

    // ========================================================
    $('#total-request').append(__state.viewData.totalRecords);

    // ========================================================
    var __viewList = "";
    __state.viewData.secteurValue.forEach(function (_secteur) {
      __viewList += '<p>- <label>' + _secteur.name + ' : </label>' +
        '<span>' + _secteur.nbBusinessByCategorie + '</span>' +
        '</p>';
    });
    $('#stat-secteur').append(__viewList);
  }

  this.renderGraph = function (params) {

    // // set the dimensions and margins of the graph
    // var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    //   width = 460 - margin.left - margin.right,
    //   height = 400 - margin.top - margin.bottom;

    // // append the svg object to the body of the page
    // var svg = d3.select("#my_dataviz")
    //   .append("svg")
    //   .attr("width", width + margin.left + margin.right)
    //   .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //   .attr("transform",
    //     "translate(" + margin.left + "," + margin.top + ")");

  }

}




$(document).ready(function () {

  var __myStatOne = new myStatOne();
  var dataDate = '2020-aout-27';
  document.getElementById('data-date').innerHTML = dataDate;
  var dataPath = 'data/data-' + dataDate + '.csv';
  __myStatOne.init(dataPath);

});