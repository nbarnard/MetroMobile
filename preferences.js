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
   if (!(fnLoadCookieArray())) {
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
   if (!(fnLoadCookieArray())) {
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
   if (!(fnLoadCookieArray())) {
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
   deleteditem = gvLocName[document.nmDeleteForm.nmLocList.selectedIndex];
   gvLocName.splice(document.nmDeleteForm.nmLocList.selectedIndex, 1);
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
   fnSaveCookieArray();
   fnShowHide('idDeleteAllFinalConfirmModal');
   fnShowHide('idDeleteAllSuccessModal');
}
