// global variable for the minute integers
         var gvMinuteInterval;

//global ariables for location arrays
         var gvLocAddress = new Array();
var gvLocName = new Array();

//post processing to update the form


function fnPreSubmit()
{
        var myDate;

	if ((document.FormName.nmOriginationCustomText.value == "") && (document.FormName.nmOriginationPull.options[document.FormName.nmOriginationPull.selectedIndex].value == 'blank') && (document.FormName.nmDestinationCustomText.value == "") && (document.FormName.nmDestinationPull.options[document.FormName.nmDestinationPull.selectedIndex].value == 'blank')) {
		fnLoadModal('please select or enter starting and ending addresses');
		return false;
	}
	//check the addresses then set them
		if (document.FormName.nmOriginationCustomText.value == "") {
		if (document.FormName.nmOriginationPull.options[document.FormName.nmOriginationPull.selectedIndex].value == 'blank') {
			fnLoadModal('please select or enter a starting address');
			return false;
		} else {
			document.FormName.Orig.value = document.FormName.nmOriginationPull.options[document.FormName.nmOriginationPull.selectedIndex].value;
		}
	} else {
		document.FormName.Orig.value = document.FormName.nmOriginationCustomText.value;
	}

	if (document.FormName.nmDestinationCustomText.value == "") {
		if (document.FormName.nmDestinationPull.options[document.FormName.nmDestinationPull.selectedIndex].value == 'blank') {
			fnLoadModal('please select or enter an ending address');
			return false;
		} else {
			document.FormName.Dest.value = document.FormName.nmDestinationPull.options[document.FormName.nmDestinationPull.selectedIndex].value;
		}
	} else {

		document.FormName.Dest.value = document.FormName.nmDestinationCustomText.value;
	}

	//convert the date to something proper for metro!
	    myDate = new Date();
	switch (document.FormName.nmDayPull.options[document.FormName.nmDayPull.selectedIndex].value) {
	case 't':
	    document.FormName.Date.value = (myDate.getMonth()+1) + '/' + myDate.getDate() + '/' + (myDate.getFullYear() - 2000);
	    break;
	case 'm':
	    myDate.setDate(myDate.getDate() + 1);
	    document.FormName.Date.value = (myDate.getMonth()+1) + '/' + myDate.getDate() + '/' + (myDate.getFullYear() - 2000);
	    break;
        default:
 		document.FormName.Date.value = document.FormName.nmDayPull.options[document.FormName.nmDayPull.selectedIndex].value;
		break;
	}

	//split the time up
		var mySplitResult = document.FormName.nmTimePull.value.split(" ");
	document.FormName.hour_time.value = mySplitResult[0];
	document.FormName.minute_time.value = mySplitResult[1];
	document.FormName.ampm_time.value = mySplitResult[2];
	//handle the accessibility pulldown
		if (document.FormName.nmAccessablePull.value == "Y") {
		document.FormName.atr.checked = true;
	} else {
		document.FormName.atr.checked = false;
	}
	//submit the form
		document.Formname.submit();
	return true;
}

function 
fnReadCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

/*
 * This script is adapted from a script available at The JavaScript Source ::
 * http://javascript.internet.com Created by: Francis Cocharrua ::
 * http://scripts.franciscocharrua.com/
 */

function 
fnSetSelect(SelectName, Value)
{
	eval('SelectObject = document.' + SelectName + ';');
	for (index = 0; index < SelectObject.length; index++) {
		if (SelectObject[index].value == Value) {
			SelectObject.selectedIndex = index;
		}
	}
}


//the page loading functions


function fnUpdatePage()
{
	var now = new Date();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var hint = 60 / gvMinuteInterval;
	var arrdep;

	//figure out what time it is and set the time pull down correctly
		arrdep = fnReadCookie('CkArrDept');
	if (arrdep == null) {
		arrdep = 'A';
	}
	if (arrdep == 'A') {
		document.FormName.nmTimePull.selectedIndex = hour * hint + Math.ceil(minute / gvMinuteInterval);
	} else {
		document.FormName.nmTimePull.selectedIndex = hour * hint + Math.floor(minute / gvMinuteInterval);
	}

	//set the preferences
	fnSetSelect('FormName.Arr', fnReadCookie('CkArrDept'));
	fnSetSelect('FormName.Walk', fnReadCookie('CkMaximumWalking'));
	fnSetSelect('FormName.Min', fnReadCookie('CkMostImportant'));
	fnSetSelect('FormName.nmAccessablePull', fnReadCookie('CkAccessability'));

	setTimeout("window.scroll(0,1)", 5);

	return true;
}


//Show hide function for extended options


		function fnShowHide(divId) {
	if (document.getElementById(divId).style.display == 'none') {
		document.getElementById(divId).style.display = 'block';
	} else {
		document.getElementById(divId).style.display = 'none';
	}
	}

function 
fnShowAdditional()
{
	fnShowHide('idAddtlOpt');
	fnShowHide('idNoOpt');
	setTimeout("window.scroll(0,150)", 5);
}

function 
fnHideAdditional()
{
	fnShowHide('idAddtlOpt');
	fnShowHide('idNoOpt');
	setTimeout("window.scroll(0,150)", 5);
}

//for formating integers with leading zeros
		function fnFormatInteger(num, length) {
	return (num / Math.pow(10, length)).toFixed(length).substr(2);
	}

function 
fnFillTime()
{
	//lets fill out the form with the times
	var m;
	var h;
	var merid;
	var ampm = new Array();
	ampm[0] = "am";
	ampm[1] = "pm";


	if (fnReadCookie('CkMinuteInterval') == null) {
		gvMinuteInterval = 15;
	} else {
		gvMinuteInterval = Number(fnReadCookie('CkMinuteInterval'));
	}

	for (merid = 0; merid < 2; merid = merid + 1) {
		for (h = 0; h < 12; h = h + 1) {
			for (m = 0; m < 60; m = m + gvMinuteInterval) {
				if (h == 0) {
					document.write('<option value="12 ' + fnFormatInteger(m, 2) + ' ' + ampm[merid] + '">12:' + fnFormatInteger(m, 2) + ampm[merid] + '</option>');
				} else {
					document.write('<option value="' + fnFormatInteger(h, 2) + ' ' + fnFormatInteger(m, 2) + ' ' + ampm[merid] + '">' + h + ':' + fnFormatInteger(m, 2) + ampm[merid] + '</option>');
				}
			}
		}
	}
}
function 
fnLoadModal(modalmessage)
{
	document.getElementById('idGenericModalText').innerHTML = modalmessage;
	fnShowHide('idGenericModal');

}

function 
fnLoadCookieArray()
{
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

function 
fnFillLoc()
{
	var len;
	var i;

	if (!fnLoadCookieArray()) {
		gvLocAddress =["customloc","Aurora Village Transit Center ","Bellevue Transit Center","Seattle Central Library","Green Lake Park","Northgate Transit Center","Overlake Transit Center","Renton Transit Center","700 Broadway E","Seattle Center South","E Pine St & Broadway","SeaTac Airport","University of Washington","West Seattle Library","Westlake Tunnel Station"];
		gvLocName =["Customize Locations...","Aurora Transit Ctr","Bellevue Transit Ctr","Downtown Library","Green Lake Park","Northgate Transit Ctr","Overlake Transit Ctr","Renton Transit Ctr","Roy Street Coffee","Seattle Center","Seattle Central College","Sea-Tac Airport","Univ of Washington","West Seattle Library","Westlake Tunnel"];

	}
	len = gvLocName.length;

	document.write('<option value="blank"></option>');

	if(navigator.geolocation){
	document.write('<option value="curloc">Current Location</option>');
	}


	for (i = 0; i < len; i++) {
		document.write('<option value="' + gvLocAddress[i] + '">' + gvLocName[i] + '</option>');
	}

}

function 
fnFillDay()
{
	var myDate = new Date();
	var day;
	var month;
	var date;
	var year;
	var i;
	var listlen;
	var daynames =['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
	var monthnames =['jan', 'feb', 'mar', 'apr', 'nay', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

	listlen = fnReadCookie('CkDaystoDisplay');
	if (listlen == null) {
		listlen = 5;
	}
	myDate.setDate(myDate.getDate() + 2);

	for (i = 0; i < listlen; i++) {
		month = myDate.getMonth();
		date = myDate.getDate();
		day = myDate.getDay();
		year = myDate.getFullYear() - 2000;
		document.write('<option value="' + (month + 1) + '/' + date + '/' + year + '">' + daynames[day] + ' ' + monthnames[month] + ' ' + date.ordinal() + '</option>');

		myDate.setDate(myDate.getDate() + 1);
	}

}



Number.prototype.ordinal = function()
{
	return this + (
		       (this % 10 == 1 && this % 100 != 11) ? 'st' :
		       (this % 10 == 2 && this % 100 != 12) ? 'nd' :
		       (this % 10 == 3 && this % 100 != 13) ? 'rd' : 'th'
		);
}

function fnLocSelect(){
 if ((document.FormName.nmOriginationPull.options[document.FormName.nmOriginationPull.selectedIndex].value == 'customloc') || (document.FormName.nmDestinationPull.options[document.FormName.nmDestinationPull.selectedIndex].value == 'customloc')) {
location.href='preferences.html';
}}
