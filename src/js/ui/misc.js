module.exports = function () {

  var mainMenu = $('#main-menu');

  var __checked = true; // false if the mainMenu is Displayed
  $('#main-menu-btn').click(function (e) {
    __checked = !__checked;
    if (!__checked) {
      mainMenu.addClass('show-main-menu');
      // mainMenu.show(300);
    }
    else {
      mainMenu.removeClass('show-main-menu');
      // mainMenu.hide(300);
    }
  });

  // regex from stackoverflow
  // https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device?answertab=votes#tab-top
  var mobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
  if (mobile) {
    mainMenu.click(function () {
      // mainMenu.find('#main-menu-bkg-div').click(function(){
      __checked = true;
      mainMenu.removeClass('show-main-menu');
    });
  }

}