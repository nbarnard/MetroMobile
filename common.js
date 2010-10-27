       gvStockLocAddress=["Bellevue College","Gene Coulon Park","Green Lake Park","Marymoor Park","Northgate Library","Roy St Coffee & Tea","SeaTac Airport","Seattle Center","Shoreline College","Univ of Washington","West Seattle Library"];
       gvStockLocName=["Bellevue College","Gene Coulon Memorial Beach Park","Green Lake Park","Marymoor Park","Northgate Library","700 Broadway E","SeaTac Airport","Seattle Center South","Shoreline Community College","University of Washington","West Seattle Library"];


function fnLoadCookieArray() {
   var addresses;
   var names;

   //get location array
   addresses = fnReadCookie('CkLocAddresses');
   //get locname array
   names = fnReadCookie('CkLocName');
   if (!addresses || !names) {
       gvLocName=gvStockLocAddress;
       gvLocAddress=gvStockLocName;
       return false;
   } else {
       gvLocAddress = addresses.split('`');
       gvLocName = names.split('`');
       return true;
   }
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
