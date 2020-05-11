module.exports = function(anchorId){

  $('#' + anchorId).click(function(e){
    
    var mainMenu = $('#main-menu');
    if(e.target.checked){
      mainMenu.show(300);
      // board.removeClass('expend-board');      
    }
    else{
      // board.addClass('expend-board');
      $('#main-menu').hide(300);
    }
    
  });
}