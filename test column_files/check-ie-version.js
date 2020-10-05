//--DOCUMENT READY FUNCTION BEGIN
jQuery(function () {
     // IE 10 only CSS properties
     var ie10Styles = [
         'msTouchAction',
         'msWrapFlow',
         'msWrapMargin',
         'msWrapThrough',
         'msOverflowStyle',
         'msScrollChaining',
         'msScrollLimit',
         'msScrollLimitXMin',
         'msScrollLimitYMin',
         'msScrollLimitXMax',
         'msScrollLimitYMax',
         'msScrollRails',
         'msScrollSnapPointsX',
         'msScrollSnapPointsY',
         'msScrollSnapType',
         'msScrollSnapX',
         'msScrollSnapY',
         'msScrollTranslation',
         'msFlexbox',
         'msFlex',
         'msFlexOrder'];

     var ie11Styles = [
         'msTextCombineHorizontal'];

     /*
      * Test all IE only CSS properties
      */
     var d = document;
     var b = d.body;
     var s = b.style;
     var ieVersion = null;
     var property;

     // Test IE10 properties
     for (var i = 0; i < ie10Styles.length; i++) {
         property = ie10Styles[i];
         if (s[property] != undefined) {
             ieVersion = "ie10";
         }
     }

     // Test IE11 properties
     for (var i = 0; i < ie11Styles.length; i++) {
         property = ie11Styles[i];
         if (s[property] != undefined) {
             ieVersion = "ie11";
         }
     }

     if (ieVersion) {
         b.className = ieVersion;
         document.body.className = ieVersion;
     }
});     