module.exports = function () {

  var boardContainer = $('#board-container');

  var __checked = true; // false if the boardContainer is Displayed
  $('#main-menu-btn').click(function (e) {
    __checked = !__checked;
    if (!__checked) {
      boardContainer.addClass('show-main-menu');
      // boardContainer.show(300);
    }
    else {
      boardContainer.removeClass('show-main-menu');
      // boardContainer.hide(300);
    }
    $(this).blur();
  });

  // regex from stackoverflow
  // https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device?answertab=votes#tab-top
  var mobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
  if (mobile) {
    $('#main-menu').click(function () {
      // boardContainer.find('#main-menu-bkg-div').click(function(){
      __checked = true;
      boardContainer.removeClass('show-main-menu');
    });
  }

}