var gvCurrentlyLoaded = 'idPrefMenu';
var gvLocAddress = new Array();
var gvLocName = new Array();
var gvPageLoadId;

function fnSaveCookieArray() {
   var temp;
   temp = gvLocAddress.join('`');
   fnCreateCookie('CkLocAddresses', temp);
   temp = gvLocName.join('`');
   fnCreateCookie('CkLocName', temp);
}

function fnLoadModifyLoc() {
   document.nmModifyLocForm.nmLocName.value = gvLocName[document.nmModifyForm.nmLocList.selectedIndex];
   document.nmModifyLocForm.nmLocAddress.value = gvLocAddress[document.nmModifyForm.nmLocList.selectedIndex];
   fnSwitchPage('idModifyLoc');
}

function fnAddLoc() {
   var nextentry;
   if ((document.nmAddForm.nmLocAddress.value == "") && (document.nmAddForm.nmLocName.value == "")) {
      fnLoadModal('please enter a name and location');
      return false;
   }
   if (document.nmAddForm.nmLocAddress.value == "") {
      fnLoadModal('please enter a location');
      return false;
   }
   if (document.nmAddForm.nmLocName.value == "") {
      fnLoadModal('please enter a name');
      return false;
   }
   if ((document.nmAddForm.nmLocName.value.indexOf('`') !== -1) || (document.nmAddForm.nmLocAddress.value.indexOf('`') !== -1)) {
      fnLoadModal('sorry but the location and name cannot contain the ` character');
      return false;
   }
   //make sure we have the newest cookie
   fnLoadCookieArray();
   if(fnEmptyCookieArray()){
       nextentry = 0;
   } else {
   nextentry = gvLocAddress.length;
   }

   gvLocAddress[nextentry] = document.nmAddForm.nmLocAddress.value;
   gvLocName[nextentry] = document.nmAddForm.nmLocName.value;
   fnSaveCookieArray();

   fnLoadBackPrefModal('location "' + document.nmAddForm.nmLocName.value + '" added','add another location',function(){document.nmAddForm.nmLocAddress.value='';document.nmAddForm.nmLocName.value='';fnShowHide('idGenericModal');});
}

function fnSavePrefs() {
   fnCreateCookie('CkArrDept', document.nmPrefsForm.nmArriveDepart.value);
   fnCreateCookie('CkDaystoDisplay', document.nmPrefsForm.nmNumberDays.value);
   fnCreateCookie('CkMaximumWalking', document.nmPrefsForm.nmMaxWalking.value);
   fnCreateCookie('CkMostImportant', document.nmPrefsForm.nmMostImportant.value);
   fnCreateCookie('CkAccessability', document.nmPrefsForm.nmAccessablePull.value);
   fnCreateCookie('CkMinuteInterval', document.nmPrefsForm.nmMinuteInterval.value);
   if (navigator.geolocation) {
       fnCreateCookie('CkDebugTrackPull', document.nmPrefsForm.nmDebugTrackPull.value);
   }
   fnLoadBackPrefModal('trip defaults saved');
 
   return true;
}

function fnLoadTripDefaults() {
   fnSetSelect('nmPrefsForm.nmArriveDepart', fnReadCookie('CkArrDept'));
   fnSetSelect('nmPrefsForm.nmMaxWalking', fnReadCookie('CkMaximumWalking'));
   fnSetSelect('nmPrefsForm.nmNumberDays', fnReadCookie('CkDaystoDisplay'));
   fnSetSelect('nmPrefsForm.nmMostImportant', fnReadCookie('CkMostImportant'));
   fnSetSelect('nmPrefsForm.nmAccessablePull', fnReadCookie('CkAccessability'));
   fnSetSelect('nmPrefsForm.nmMinuteInterval', fnReadCookie('CkMinuteInterval'));
   fnSwitchPage('idTripDefaults');
}

function fnDebugTrackSelect(){
    if (navigator.geolocation) {
        document.write('<br />save location debug info:<br /><select name="nmDebugTrackPull"><option value="Y">yes</option><option value="N" selected="selected">no</option></select>');
        fnSetSelect('nmPrefsForm.nmDebugTrackPull', fnReadCookie('CkDebugTrackPull'));
    }
}

function fnLoadLogo(loadpage){
  var image;
   image=document.getElementById(gvCurrentlyLoaded+'idLogo')
       image.src='<!--#include virtual="logo-data.txt" -->';
   image.className='CSLogoImg';

}

function fnSwitchPage(loadpage) {
   var mm;
   var loc;
 
   document.getElementById(gvCurrentlyLoaded).style.display = 'none';
   document.getElementById(loadpage).style.display = 'block';
   gvCurrentlyLoaded = loadpage;
   fnLoadLogo(loadpage);
   mm = 'metro mobile: ';
   loc = ' location';
   switch (loadpage) {
   case 'idTripDefaults':
      document.title = mm + 'trip defaults';
      break;
   case 'idAddMain':
      document.title = mm + 'add' + loc;
      break;
   case 'idDeleteMain':
      document.title = mm + 'delete' + loc;
      break;
   case 'idModifyMain':
   case 'idModifyLoc':
      document.title = mm + 'edit' + loc;
      break;
   case 'idReorderMain':
      document.title = mm + 'reorder' + loc + 's';
      break;
   case 'idPrefMenu':
      document.title = mm + 'preferences';
      break;

   }

   if ('onhashchange' in window && loadpage!='idPrefMenu') {
       location.hash = '#' + gvPageLoadId + loadpage;
   }

   setTimeout("window.scroll(0,1)", 5);
}

function fnModifyLoc() {
   gvLocName[document.nmModifyForm.nmLocList.selectedIndex] = document.nmModifyLocForm.nmLocName.value;
   gvLocAddress[document.nmModifyForm.nmLocList.selectedIndex] = document.nmModifyLocForm.nmLocAddress.value;
   fnSaveCookieArray();
   fnLoadBackPrefModal('location "' + document.nmModifyLocForm.nmLocName.value + '" modified','edit another location',function(){fnShowHide('idGenericModal');fnLoadModify();});
}

function fnLoadModify() {
   var len;
   var i;
   //make sure we have the newest cookie
   fnLoadCookieArray();
   if(fnEmptyCookieArray()){
       fnLoadModal('there are no locations to edit');
       return false;
   }


   len = gvLocName.length;
   document.nmModifyForm.nmLocList.options.length = 0;
   for (i = 0; i < len; i++) {
      document.nmModifyForm.nmLocList.options[i] = new Option(gvLocName[i]);
   }
   fnSwitchPage('idModifyMain');
}

function fnLoadDelete() {
   var len;
   var i;
   //make sure we have the newest cookie
   fnLoadCookieArray();
   if(fnEmptyCookieArray()){
       fnLoadModal('there are no locations to delete');
       return false;
   }

   len = gvLocName.length;
   document.nmDeleteForm.nmLocList.options.length = 0;
   for (i = 0; i < len; i++) {
      document.nmDeleteForm.nmLocList.options[i] = new Option(gvLocName[i]);
   }
   fnSwitchPage('idDeleteMain');
}

function fnDeleteVerify() {
    fnCustomModal('delete location ' + gvLocName[document.nmDeleteForm.nmLocList.selectedIndex] + '"?','delete',fnDeleteLoc,'cancel',function(){fnShowHide('idGenericModal');});
}

function fnDeleteLoc() {
   var deleteditem;

   // clear the modal
   fnShowHide('idGenericModal');

   deleteditem = gvLocName.splice(document.nmDeleteForm.nmLocList.selectedIndex, 1);
   gvLocAddress.splice(document.nmDeleteForm.nmLocList.selectedIndex, 1);

   fnSaveCookieArray();

   //different modals if we deleted the last item, and properly handle deleting the last item
   if (gvLocName.length == 0) {
       // create cookies with just the dilemeters 
       fnCreateCookie('CkLocAddresses', '`');
       fnCreateCookie('CkLocName', '`');

       fnLoadBackPrefModal('last location "' +  deleteditem + '" deleted');
   } else {
       fnLoadBackPrefModal('location "' +  deleteditem + '" deleted','delete another',function(){fnLoadDelete();fnShowHide('idGenericModal');});
   }

}

function fnDeleteAll() {
   // create cookies with just the dilemeters 
   fnCreateCookie('CkLocAddresses', '`');
   fnCreateCookie('CkLocName', '`');
   fnShowHide('idGenericModal');
   fnLoadBackPrefModal('all locations deleted');
}

function fnUnloadReorder(){
    var x;
    var len;
    var row;

    len = gvLocName.length;

    for (x = 0; x < len; x++) {
	row	= document.getElementById('idReorderRow' + x);
    document.getElementById('idReorderList').removeChild(row);
    }
}

function fnLoadReorder() {
   var row;
   var x;
   var len;
   var rowcolor;
   var cell;
   var celltext;

   function insertarrow(item, dir) {
      var link;
      var img;

      link = document.createElement("a");
      link.href = 'javascript:fnMoveItem(' + item + ',' + dir + ');';
      img = document.createElement("img");
      img.src = '<!--#include virtual="uparrowimg-data.txt" -->';
      img.border = 0;
      if (dir == -1) {
         img.className = 'CSFlippedImg';
      }
      link.appendChild(img);
      cell.appendChild(link);
   }


   // start of the root function

   fnLoadCookieArray();

   if(fnEmptyCookieArray()){
       fnLoadModal('there are no locations to reorder');
       return false;
   }

   len = gvLocName.length;

   for (x = 0; x < len; x++) {
      row = document.createElement("tr");

      if (x % 2) {
         rowcolor = '#FFFFFF';
      } else {
         rowcolor = '#FF9D00';
      } 

      row.style.background = rowcolor;
      row.id = 'idReorderRow' + x;
      cell = document.createElement("td");

      if (x != 0) {
         insertarrow(x, -1);
      }

      row.appendChild(cell);

      celltext = document.createTextNode(gvLocName[x]);
      cell = document.createElement("td");
      cell.width = '60%';
      cell.id = 'idReorderRowItemLabel' + x;
      cell.appendChild(celltext);
      row.appendChild(cell);

      cell = document.createElement("td");
      if ((x + 1) != len) {
         insertarrow(x, 1);
      }
      row.appendChild(cell);

      document.getElementById('idReorderList').appendChild(row);
   }

   fnSwitchPage('idReorderMain');
}

function fnMoveItem(item, dir) {
   var xhtml;
   var xelement;
   var yelement;
   var xaddr;
   var xname;
   var newitem;

   newitem=item+dir

   // set the IDs
   xelement = 'idReorderRowItemLabel' + item;
   yelement = 'idReorderRowItemLabel' + newitem;

   // store the first location in variables
   xhtml = document.getElementById(xelement).innerHTML;
   xaddr = gvLocAddress[item];
   xname = gvLocName[item];
   
   // set the second location to the first location
   document.getElementById(xelement).innerHTML = document.getElementById(yelement).innerHTML;
   gvLocAddress[item] = gvLocAddress[newitem];
   gvLocName[item] = gvLocName[newitem];

   // save the variables to the second location
   document.getElementById(yelement).innerHTML = xhtml;
   gvLocAddress[newitem]=xaddr;
   gvLocName[newitem]=xname;

}

function fnAddStockLoc(){
    //make sure we have the newest cookie
    fnLoadCookieArray();

    if(fnEmptyCookieArray()){
	gvLocAddress=gvStockLocAddress;
	gvLocName=gvStockLocName;    
    } else {
    gvLocAddress=gvLocAddress.concat(gvStockLocAddress);
    gvLocName=gvLocName.concat(gvStockLocName);
    }


    fnSaveCookieArray();
   fnLoadBackPrefModal('starter locations added','add another location',function(){document.nmAddForm.nmLocAddress.value='';document.nmAddForm.nmLocName.value='';fnShowHide('idGenericModal');});
}

function fnDeleteStockLoc(){
    function combinearrays(arrayx,arrayy,arrayz){
	var x;

	for(x=0;x<arrayx.length;x++){
	    arrayz[x]=arrayx[x]+ '`' + arrayy[x];
	}
	user.length=arrayx.length;
    }
    var stock=new Array();
    var user=new Array();
    var x;
    var match;

    //make sure we have the newest cookie
    fnLoadCookieArray();

    // combine the arrays so we don't have to deal with a double comparison
    combinearrays(gvStockLocName, gvStockLocAddress,stock);
    combinearrays(gvLocName, gvLocAddress, user);

	            for(x=0;x<stock.length;x++){
	match=user.indexOf(stock[x]);
       	while(match!=-1){
	//  remove the offending entry from the actual arrays
            gvLocAddress.splice(match,1);
	    gvLocName.splice(match,1);
   //     recombine the user array so we've got the most current addresses
	    combinearrays(gvLocName, gvLocAddress,user);
	    match=user.indexOf(stock[x]);
	    }
        }
    fnSaveCookieArray();

    if (gvLocName.length == 0) {
	// create cookies with just the dilemeters
	fnCreateCookie('CkLocAddresses', '`');
	fnCreateCookie('CkLocName', '`');
	fnLoadBackPrefModal('starter locations, including last location deleted');
   } else {
       fnLoadBackPrefModal('starter locations deleted','delete another',function(){fnLoadDelete();fnShowHide('idGenericModal');});
    }

}

function fnRandomHash(){

    var x;
    var random;

    gvPageLoadId='';
    for(x=0;x<9;x++){
	random=Math.floor(Math.random()*63);

	random=random+48;
	if(random>57){
	    random=random+7;
	}

	if(random>90){
	    random=random+6;
	}

	gvPageLoadId=gvPageLoadId+String.fromCharCode(random);
    }

}


function fnHashChange() {
    var newloc;
    newloc=location.hash;

    if ((gvPageLoadId != newloc.substr(1, 9)) || newloc == '') {
	// if this is a new hash and/or there isn't one, switch to the main page.
	fnSwitchPage('idPrefMenu');
    } else {
	// load the location which is everything after the 10th character 
	fnSwitchPage(newloc.substr(10));
    }
}
       
// register the hash change function
window.onhashchange = fnHashChange;
