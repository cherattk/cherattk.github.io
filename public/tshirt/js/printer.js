var viewportScaleFactor;

window.onload = function(){

  // const mmToPixel = 3.779;
  // // set paper size ratio
  // const PAPER_LETTER = {
  //   width : 216 * mmToPixel, // convert 216mm to pixel
  //   height : 279 * mmToPixel, // convert 279mm to pixel
  //   ratio : 1.2941 // w:h => 1:1.2941
  // };
  // var paper = document.getElementById('printer-paper');
  // var paperHeight = paper.clientWidth * PAPER_LETTER.ratio;
  // paper.style.height = paperHeight + 'px';

  // // SCALING FACTOR
  // viewportScaleFactor = paper.clientWidth / PAPER_LETTER.width;

}

function printOrder() {

  $.getJSON("/order/123", function (data) {
        var img = document.getElementById('printer-image');
        img.src = data.imageUrl;
        // apply viewportScaleFactor to the IMAGE;
        // img.style.width = (data.width * viewportScaleFactor) + 'px';
        // img.style.height = (data.height * viewportScaleFactor) + 'px';


      })
  .done(function () {
    console.log("second success");
  })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    console.log("complete");
  });

}