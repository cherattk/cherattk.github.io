var PAPER = {
  A3: {
    ratio: "",
    width: 297,
    height: 420
  }
}

// @see CSS .image-paper
// A3 SCALEDOWN
var SCREEN_PAPER_AREA = { width: 230, height: 324 };

var viewportScaleFactor = function (ppi) {
  var mmToInch = 0.0393701;
  return (PAPER.A3.width * mmToInch * ppi) / SCREEN_PAPER_AREA.width;
};

function selectImage() {
  document.getElementById('select-image').click();
}

function resizeImage(width, height, ppi) {
  return {
    w: width / viewportScaleFactor(ppi),
    h: height / viewportScaleFactor(ppi)
  }
}

function changeImage(el) {
  document.getElementById('image-output-background').src = el.src;
}

var imageLayer = [];
function getImage(files) {
  if (files.length === 0) {
    return;
  }
  var file = files[0];
  $('#image-output').addClass('edit-mode');
  image = new Image();
  image.id = "user-image-" + (new Date()).getTime();
  image.className = "design-image edit-mode";
  image.file = file;
  $(image).on('click mousedown', function (e) {
    // console.log(e.target.id);
    e.stopPropagation();
    if (imageLayer.length > 1) {
      var previous = imageLayer[imageLayer.length - 1];
      var selectedIndex = imageLayer.findIndex((imgLayer) => {
        return imgLayer.id === e.target.id;
      });
      var imageData = imageLayer[selectedIndex];
      imageLayer[imageLayer.length - 1] = imageData;  // push to the last position
      // set scale and rotation to control
      setControlValue('rotation' , imageData.rotation);
      setControlValue('scale' , imageData.scale);
      
      // switch the "previous element" with the "selected element"
      imageLayer[selectedIndex] = previous;

      $('#' + e.target.id).insertAfter('#' + previous.id);
      // var printingArea = $('#image-output');

      editMode(true, e.target.id);
    }
    else {
      editMode(true, e.target.id);
    }
    console.log(imageLayer);
  });

  var reader = new FileReader();
  reader.onload = function (e) {
    image.src = e.target.result;
    image.onload = function () {
      // console.log(image.width);
      // console.log(image.height);
      var imgLayerData = {
        id : image.id,
        width : 0,
        height : 0,
        rotation : 0,
        scale : 1
      };
      var imgSize = resizeImage(image.width, image.height, 96 /** ppi */);
      image.width = imgSize.w;
      image.height = imgSize.h;
      // initial dimension
      imgLayerData.width = imgSize.w;
      imgLayerData.height = imgSize.h;
      imageLayer.push(imgLayerData);

      // reset all editor button 
      var rotateDeg = 0;
      document.getElementById('imageRotation').value = rotateDeg;
      image.style.transform = `rotate(${rotateDeg}deg)`;

      var scaling = 1;
      document.getElementById('imageScale').value = scaling;

      dragElement(image);
      editMode(true, image.id);
    }
    
  };

  $('#image-output').append(image);
  reader.readAsDataURL(file);
}

function setControlValue(control , value){
  if(control === 'rotation'){
    document.getElementById('imageRotation').value = value;
    document.getElementById('rotateValue').innerHTML = `${value}&deg;`;
  }
  else if(control === 'scale'){
    document.getElementById('imageScale').value = value;
    document.getElementById('scaleValue').innerHTML = `x${value}`;
  }
  else {
    throw new Error();
  }
}

function rotateImage(el) {
  if (!imageLayer.length) {
    return;
  }
  var imageData = imageLayer[imageLayer.length - 1];
  imageData.rotation = el.value;
  var img = document.getElementById(imageData.id); // get last layer
  img.style.transform = `rotate(${el.value}deg)`;
  document.getElementById('rotateValue').innerHTML = `${el.value}&deg;`;
}

function scaleImage(el) {
  if (!imageLayer.length) {
    return;
  }
  var scale = parseFloat(el.value);
  if (!scale) return;
  var imageData = imageLayer[imageLayer.length - 1];
  imageData.scale = scale;
  var w = imageData.width * scale;
  var h = imageData.height * scale;
  // get the last one in the array
  var image = document.getElementById(imageLayer[imageLayer.length - 1].id);
  image.style.width = w + 'px';
  image.style.height = h + 'px';
  document.getElementById('scaleValue').innerHTML = `x${scale}`;
}

function disablePreviousImage(activeLayer) {
  if (imageLayer.length) {
    imageLayer.forEach((image, idx) => {
      if (image.id !== activeLayer) {
        var layer = document.getElementById(image.id);
        layer.style.zIndex = idx + 1;
        $(layer).removeClass('edit-mode');
      }
    });
  }
}

function editMode(editMode, activeElement) {
  var printingArea = $('#image-output');
  if (editMode) {
    printingArea.addClass('edit-mode');
    var image = $('#' + activeElement);
    image.addClass('edit-mode');
    document.getElementById(activeElement).style.zIndex = 10;
    disablePreviousImage(activeElement);
    document.getElementById('imageRotation').disabled = false;
    document.getElementById('imageScale').disabled = false;
  }
  else {
    // preview mode
    printingArea.removeClass('edit-mode');
    disablePreviousImage(null);
    // disable image control
    document.getElementById('imageRotation').disabled = true;
    document.getElementById('imageScale').disabled = true;
  }
}

//////////////////////////////////////////////////////////////
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id).onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//////////////////////////////////////////////////////////////
$(document).ready(function () {
  $(".slider").on('click', function (e) {
    e.stopPropagation();
  });
});

$(document).click(function () {
  editMode(false);
});

// function showHelp() {
// }