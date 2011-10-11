       gvStockLocAddress=["Bellevue College","Gene Coulon Memorial Beach Park","Green Lake Park","Marymoor Park","Northgate Library","700 Broadway E","SeaTac Airport","Seattle Center South","Shoreline Community College","University of Washington","West Seattle Library"];
       gvStockLocName=["Bellevue College","Gene Coulon Park","Green Lake Park","Marymoor Park","Northgate Library","Roy St Coffee & Tea","SeaTac Airport","Seattle Center","Shoreline College","Univ of Washington","West Seattle Library"];


function fnLoadCookieArray() {
   var addresses;
   var names;

   //get location array
   addresses = fnReadCookie('CkLocAddresses');
   //get locname array
   names = fnReadCookie('CkLocName');
   if (!addresses || !names) {
       gvLocName=gvStockLocName;
       gvLocAddress=gvStockLocAddress;
       return false;
   } else {
       gvLocAddress = addresses.split('`');
       gvLocName = names.split('`');
       return true;
   }
}


/* Cookie functions adapted from http://www.quirksmode.org/js/cookies.html */

function fnCreateCookie(name, value) {
    document.cookie = name + "=" + value + "; expires=Wed, 10 Nov 9999 21:47:44 UTC; path=/";
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
    if (Value == null){
	return;
    }
   fnEvalWrapper('SelectObject = document.' + SelectName + ';');

   for (index = 0; index < SelectObject.length; index++) {
      if (SelectObject[index].value == Value) {
         SelectObject.selectedIndex = index;
      }
   }
}

function fnCustomModal(msg, btn1txt, btn1fn, btn2txt, btn2fn) {
    function createbutton(btntxt, btnfn, btnid) {
	var btn;

	btn = document.createElement('input');
	btn.setAttribute('type', 'button');
	btn.setAttribute('value', btntxt);
	btn.setAttribute('id', btnid);
	btn.onclick = btnfn;
	btn.className = 'CSModalButton';
	deletebutton(btnid);
        parent.appendChild(btn);
    }
    function deletebutton(btnid){
	var btnelement;
	btnelement = document.getElementById(btnid);
	if (btnelement) {
	    parent.removeChild(btnelement);
	}
    }

    // core of the root function
    var parent;

    //set the text
    document.getElementById('idGenericModalText').innerHTML = msg;

    // set what the parent of the buttons is
    parent = document.getElementById('idGenericModalButtons');


    // set up the first button
    createbutton(btn1txt, btn1fn, 'idGenericBtnOne');

    // if there is a second button, set it!
    if (btn2txt != undefined) {
	createbutton(btn2txt, btn2fn, 'idGenericBtnTwo');
    } else {
	deletebutton('idGenericBtnTwo');
    }

    fnShowHide('idGenericModal');

}

function fnLoadModal(modalmessage) {
    fnCustomModal(modalmessage,'okay',function(){fnShowHide('idGenericModal');});
}

function fnLoadBackPrefModal(msg, btn1txt, btn1fn){
    if(btn1txt==undefined){
	fnCustomModal(msg,'back to preferences',function(){fnShowHide('idGenericModal');fnSwitchPage('idPrefMenu');});
    }else{
	fnCustomModal(msg,btn1txt,btn1fn,'back to preferences',function(){fnShowHide('idGenericModal');fnSwitchPage('idPrefMenu');});
    }
}

function fnShowHide(divId) {
   if (document.getElementById(divId).style.display == 'none') {
      document.getElementById(divId).style.display = 'block';
   } else {
      document.getElementById(divId).style.display = 'none';
   }
}

function fnEvalWrapper(c) {
    return eval(c);
}

function fnEmptyCookieArray(){
    if((gvLocAddress.length==0 && gvLocName==0)||(gvLocAddress[0]=='' && gvLocAddress[1]=='' && gvLocName[0]=='' && gvLocName[1]=='' && gvLocAddress.length==2 && gvLocName.length==2)){
        gvLocAddress.length=0;
        gvLocName.length=0;
        return true;
    } else {
        return false;
    }
}
