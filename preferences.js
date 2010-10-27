var gvCurrentlyLoaded = 'idPrefMenu';
var gvLocAddress = new Array();
var gvLocName = new Array();

function fnSaveCookieArray() {
   var temp;
   temp = gvLocAddress.join('`');
   fnCreateCookie('CkLocAddresses', temp);
   temp = gvLocName.join('`');
   fnCreateCookie('CkLocName', temp);
}

function fnCreateCookie(name, value) {
   document.cookie = name + "=" + value + "; expires=Wed, 10 Nov 9999 21:47:44 UTC; path=/";
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
   document.getElementById('idAddSuccessItem').innerHTML = document.nmAddForm.nmLocName.value;
   fnShowHide('idAddSuccessModal');
}

function fnSavePrefs() {
   fnCreateCookie('CkArrDept', document.nmPrefsForm.nmArriveDepart.value);
   fnCreateCookie('CkDaystoDisplay', document.nmPrefsForm.nmNumberDays.value);
   fnCreateCookie('CkMaximumWalking', document.nmPrefsForm.nmMaxWalking.value);
   fnCreateCookie('CkMostImportant', document.nmPrefsForm.nmMostImportant.value);
   fnCreateCookie('CkAccessability', document.nmPrefsForm.nmAccessablePull.value);
   fnCreateCookie('CkMinuteInterval', document.nmPrefsForm.nmMinuteInterval.value);
   fnShowHide('idPrefSuccessModal');
   return true;
}

function fnUpdatePage() {
   fnSetSelect('nmPrefsForm.nmArriveDepart', fnReadCookie('CkArrDept'));
   fnSetSelect('nmPrefsForm.nmMaxWalking', fnReadCookie('CkMaximumWalking'));
   fnSetSelect('nmPrefsForm.nmNumberDays', fnReadCookie('CkDaystoDisplay'));
   fnSetSelect('nmPrefsForm.nmMostImportant', fnReadCookie('CkMostImportant'));
   fnSetSelect('nmPrefsForm.nmAccessablePull', fnReadCookie('CkAccessability'));
   fnSetSelect('nmPrefsForm.nmMinuteInterval', fnReadCookie('CkMinuteInterval'));
   setTimeout("window.scroll(0,1)", 5);
}

function fnSwitchPage(loadpage) {
   var mm;
   var loc;
   document.getElementById(gvCurrentlyLoaded).style.display = 'none';
   document.getElementById(loadpage).style.display = 'block';
   gvCurrentlyLoaded = loadpage;
   mm = 'metro mobile: ';
   loc = ' location';
   switch (loadpage) {
   case 'idPrefMenu':
      document.title = mm + 'preferences';
      break;
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
   }
   setTimeout("window.scroll(0,1)", 5);
}

function fnModifyLoc() {
   gvLocName[document.nmModifyForm.nmLocList.selectedIndex] = document.nmModifyLocForm.nmLocName.value;
   gvLocAddress[document.nmModifyForm.nmLocList.selectedIndex] = document.nmModifyLocForm.nmLocAddress.value;
   fnSaveCookieArray();
   document.getElementById('idModifySuccessItem').innerHTML = document.nmModifyLocForm.nmLocName.value;
   fnShowHide('idModifySuccessModal');
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
   document.getElementById('idDeleteConfirmItem').innerHTML = gvLocName[document.nmDeleteForm.nmLocList.selectedIndex];
   fnShowHide('idDeleteConfirmModal');
}

function fnDeleteLoc() {
   var deleteditem;
   deleteditem = gvLocName.splice(document.nmDeleteForm.nmLocList.selectedIndex, 1);
   gvLocAddress.splice(document.nmDeleteForm.nmLocList.selectedIndex, 1);
   fnSaveCookieArray();
   fnShowHide('idDeleteConfirmModal');
   //different modals if we deleted the last item.
   if (gvLocName.length == 0) {
      document.getElementById('idDeleteSuccessLastItem').innerHTML = deleteditem;
      fnShowHide('idDeleteSuccessLastModal');
   } else {
      document.getElementById('idDeleteSuccessItem').innerHTML = deleteditem;
      fnShowHide('idDeleteSuccessModal');
   }
}

function fnDeleteAll() {
   gvLocName.length = 0;
   gvLocAddress.length = 0;
   fnCreateCookie('CkLocAddresses', '`');
   fnCreateCookie('CkLocName', '`');

   //   fnSaveCookieArray();
   fnShowHide('idDeleteAllFinalConfirmModal');
   fnShowHide('idDeleteAllSuccessModal');
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
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAKRJREFUeNpjYKAAMALxcSC2IEPvaSYgkQ7Ev8jQ3ADSfAmIN5OocQcQb2OCclKA+B2RGj8AcQaIwYQk0Eek5oVA/BBZMwi0AvF9AhpfAHEFjMOEJlkOxH/xaAZp/IFL82og3odD43GokxlwaQaBTBy2l6MLYNN8F4iXooktB+LDxGgGgWwgfg1lfwTiPGyKcGn+AsRNUPZsIH5DTtrfBcQcDLQAAAfKIBbPBlLWAAAAAElFTkSuQmCC';
      img.height = 15;
      img.width = 15;
      img.border = 0;
      if (dir == -1) {
         img.className = 'flippedimg';
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

function fnEmptyCookieArray(){
    if((gvLocAddress.length==0 && gvLocName==0)||(gvLocAddress[0]=='' && gvLocAddress[1]=='' && gvLocName[0]=='' && gvLocName[1]=='' && gvLocAddress.length==2 && gvLocName.length==2)){
	gvLocAddress.length=0;
	gvLocName.length=0;
	return true;
    } else {
	return false;
    }
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
    fnLoadModal('stock locations added');

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
    fnLoadModal('stock locations removed');
    // reload the delete page so we get the right items in the pulldown
    fnLoadDelete();
}
       

	