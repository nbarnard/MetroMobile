function fnLoadCookieArray() {
   var temp;
   //get location array
   temp = fnReadCookie('CkLocAddresses');
   if (!temp) {
      return false;
   }
   gvLocAddress = temp.split('`');
   //get locname array
   temp = fnReadCookie('CkLocName');
   if (!temp) {
      return false;
   }
   gvLocName = temp.split('`');
   return true;
}
function fnReadCookie(name) {
   var nameEQ = name + "=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ')
      c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
   }
   return null;
}
/*
 * This script is adapted from a script available at The JavaScript Source ::
 * http://javascript.internet.com Created by: Francis Cocharrua ::
 * http://scripts.franciscocharrua.com/
 */

function fnSetSelect(SelectName, Value) {
   fnEvalWrapper('SelectObject = document.' + SelectName + ';');
   for (index = 0; index < SelectObject.length; index++) {
      if (SelectObject[index].value == Value) {
         SelectObject.selectedIndex = index;
      }
   }
}

function fnLoadModal(modalmessage) {
   document.getElementById('idGenericModalText').innerHTML = modalmessage;
   fnShowHide('idGenericModal')
}

function fnShowHide(divId) {
   if (document.getElementById(divId).style.display == 'none') {
      document.getElementById(divId).style.display = 'block';
   } else {
      document.getElementById(divId).style.display = 'none';
   }
}

function fnEvalWrapper(code) {
    return eval(code);
}
