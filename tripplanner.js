// global variable for the minute integers
var gvMinuteInterval;

//global ariables for location arrays - multiple functions use this.
var gvLocAddress = new Array();
var gvLocName = new Array();

// need to be globals due to callback
var gvBestLatAbs;
var gvBestLonAbs;
var gvTimeoutID;

//post processing to update the form

function fnPreSubmit() {
    var myDate;
    var myTimeSplit;
    var OrigCust;
    var OrigSelected;
    var DestCust;
    var DestSelected;
    var OrigFinal;
    var DestFinal;
    var SelectedDate;
    var FinalDate;

    // setting these as variables so they compress better
    OrigCust = document.FormName.nmOriginationCustomText.value;
    OrigSelected = document.FormName.nmOriginationPull.options[document.FormName.nmOriginationPull.selectedIndex].value;
    DestCust = document.FormName.nmDestinationCustomText.value;
    DestSelected = document.FormName.nmDestinationPull.options[document.FormName.nmDestinationPull.selectedIndex].value;
    SelectedDate = document.FormName.nmDayPull.options[document.FormName.nmDayPull.selectedIndex].value;



    //convert the date to something proper for metro!
    myDate = new Date();
    switch (SelectedDate) {
    case 't':
	FinalDate = (myDate.getMonth() + 1) + '/' + myDate.getDate() + '/' + (myDate.getFullYear() - 2000);
	break;
    case 'm':
	myDate.setDate(myDate.getDate() + 1);
	FinalDate = (myDate.getMonth() + 1) + '/' + myDate.getDate() + '/' + (myDate.getFullYear() - 2000);
	break;
    default:
	FinalDate = SelectedDate;
	break;
    }

    document.FormName.Date.value = FinalDate;

    //split the time up
    myTimeSplit = document.FormName.nmTimePull.value.split(" ");
    document.FormName.hour_time.value = myTimeSplit[0];
    document.FormName.minute_time.value = myTimeSplit[1];
    document.FormName.ampm_time.value = myTimeSplit[2];

    //handle the accessibility pulldown
    if (document.FormName.nmAccessablePull.value == "Y") {
    document.FormName.Atr.checked = true;
     } else {
    document.FormName.Atr.checked = false;
    }

    if ((OrigCust == "") && (OrigSelected == 'blank') && (DestCust == "") && (DestSelected == 'blank')) {
	fnLoadModal('please select or enter starting and ending addresses');
	return false;
    }
    //check the addresses then set them
    if (OrigCust == "") {
	if (OrigSelected == 'blank') {
	    fnLoadModal('please select or enter a starting address');
	    return false;
	} else {
	    OrigFinal = OrigSelected;
	}
    } else {
	OrigFinal = OrigCust;
    }

    if (DestCust == "") {
	if (DestSelected == 'blank') {
	    fnLoadModal('please select or enter an ending address');
	    return false;
	} else {
	    DestFinal = DestSelected;
	}
    } else {
	DestFinal = DestCust;
    }

    if(OrigFinal == DestFinal){
    fnLoadModal('starting and ending addresses are the same');
    return false;
    }

    // set the locations in the form to be submitted
    document.FormName.Orig.value = OrigFinal;
    document.FormName.Dest.value = DestFinal;

    // If one of the locations is current location, fire off to find the stop.
    if((OrigFinal == 'curloc') || (DestFinal == 'curloc')){
    fnFindLoc();
    return false;
    }

    //submit the form
    return true;
}

//the page loading functions

function fnUpdatePage() {
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

function fnFillTime() {
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

function fnFillLoc() {
   var len;
   var i;

   if (!fnLoadCookieArray()) {
      gvLocAddress = ["customloc", "Aurora Village Transit Center ", "Bellevue Transit Center", "Seattle Central Library", "Green Lake Park", "Northgate Transit Center", "Overlake Transit Center", "Renton Transit Center", "700 Broadway E", "Seattle Center South", "E Pine St & Broadway", "SeaTac Airport", "University of Washington", "West Seattle Library", "Westlake Tunnel Station"];
      gvLocName = ["Customize Locations...", "Aurora Transit Ctr", "Bellevue Transit Ctr", "Downtown Library", "Green Lake Park", "Northgate Transit Ctr", "Overlake Transit Ctr", "Renton Transit Ctr", "Roy Street Coffee", "Seattle Center", "Seattle Central College", "Sea-Tac Airport", "Univ of Washington", "West Seattle Library", "Westlake Tunnel"];

   }
   len = gvLocName.length;

   document.write('<option value="blank"></option>');

   if (navigator.geolocation) {
      document.write('<option value="curloc">Current Location</option>');
   }

   for (i = 0; i < len; i++) {
      document.write('<option value="' + gvLocAddress[i] + '">' + gvLocName[i] + '</option>');
   }

}

function fnFillDay() {
   var myDate = new Date();
   var day;
   var month;
   var date;
   var year;
   var i;
   var listlen;
   var daynames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
   var monthnames = ['jan', 'feb', 'mar', 'apr', 'nay', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

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


function fnFindLoc() {
   var bestlat;
   var bestlon;
   var bestacc;
   var dupaccx;

   function gotLoc(position) {
      var accuracy;

      // assigning accuracy to it own variable so we can compress further.
      accuracy = position.coords.accuracy;

      // check to see if user pressed cancel or we bailed out in another way
      if (gvTimeoutID == -1) {
         return false;
      }

      // count the number of times we get duplicate accuracies
      if (accuracy == bestacc) {
         dupaccx++;
      } else {
         // set the duplicate accuracy to 0 if we just got a different resolution
         dupaccx = 0;
      }

      // using less than or equal to to adjust for scenarios where accuracy is 65,500,65,65,65 so that we get the last set of coords, not the first one.
      if (accuracy <= bestacc) {
         bestlat = position.coords.latitude;
         bestlon = position.coords.longitude;
         bestacc = accuracy;
      }

      // if we get the same accuracy three times in a row and we're at less than 200m, call it good and use it.
      if ((dupaccx == 3) && (accuracy < 200)) {
         clearTimeout(gvTimeoutID);
         fnProgressModal('Locating Nearest Stop');
         calloba();
         return false;
      }

      navigator.geolocation.getCurrentPosition(gotLoc, handleError, {enableHighAccuracy: true});
   }

   function loctimeout() {
       // set the timeoutid to -1 so gotloc knows we've timed out
       gvTimeoutID = -1;
      if (bestacc < 400) {
         calloba();
      } else {
	  fnLoadModal('unable to determine location with sufficent accuracy');
      }
   }

   function calloba() {
      var script_id;
      var script;

      script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', 'http://api.onebusaway.org/api/where/stops-for-location.json?key=ad884e87-542e-4def-af8c-240583690870&version=2&callback=fnGotStop&includeReferences=false&lat=' + bestlat + '&lon=' + bestlon);
      script.setAttribute('id', 'script_id');

      script_id = document.getElementById('script_id');
      if (script_id) {
         document.getElementsByTagName('head')[0].removeChild(script_id);
      }

      gvBestLatAbs = Math.abs(bestlat);
      gvBestLonAbs = Math.abs(bestlon);

      // set timeout for oba
      gvTimeoutID = setTimeout(obatimeout, 30000);
      // Insert <script> into DOM
      document.getElementsByTagName('head')[0].appendChild(script);
   }

   function handleError(error) {
      clearTimeout(gvTimeoutID);

      switch(error.code) 
	  {
	  case error.TIMEOUT:
	      fnLoadModal('timed out while obtaining location');break;
	  case error.POSITION_UNAVAILABLE:
	      fnLoadModal('Position not available');
	      break;
	  case error.PERMISSION_DENIED:
	      fnLoadModal('Location Permission denied');
	      break;
	  case error.UNKNOWN_ERROR:
	      fnLoadModal('Unknown error obtaining location');
	      break;
	  }
   }

   function obatimeout() {
      gvTimeoutID = -1;
      fnLoadModal('unable to obtain list of stops');
   }

// the root of the location finding function
   gvTimeoutID = setTimeout(loctimeout, 30000);
   bestacc = 100000;
   dupaccx = 0;
   fnProgressModal('Finding Location');
   navigator.geolocation.getCurrentPosition(gotLoc, handleError, {enableHighAccuracy: true});
}

function fnGotStop(locdata) {
   var stoploc;
   var x;
   var bestlocdiff;
   var bestlocname;
   var diff;

   // check to see if user pressed cancel or we bailed out in some other way
   if (gvTimeoutID == -1) {
      return false;
   }

   clearTimeout(gvTimeoutID);

   //we're wrapping eval in its own function so this function will be compressed
   stoploc = fnEvalWrapper(locdata);
   bestlocdiff = 200;

   if(stoploc.data.outOfRange){
       fnLoadModal('location is outside of trip planner's range'); 
   return;
   }

   //lets cycle through all the locations and figure out which is closest.
   for (x = 0; x < stoploc.data.list.length; x++) {
      // get the diff from the actual location
      diff = Math.abs(Math.abs(stoploc.data.list[x].lon) - gvBestLonAbs) + Math.abs((Math.abs(stoploc.data.list[x].lat) - gvBestLatAbs));
      // document.mooreport.oba.value = document.mooreport.oba.value + '\n' + stoploc.data.list[x].name + ',' + stoploc.data.list[x].lon + ',' + stoploc.data.list[x].lat + ',' + diff; 
      if (diff < bestlocdiff) {
         bestlocdiff = diff;
         bestlocname = stoploc.data.list[x].name;
      }
   }
   // Clear modal
    fnShowHide('idProgressModal');  

   // set best location and submit
   if(document.FormName.Orig.value == 'curloc'){
      document.FormName.Orig.value = bestlocname;
   } else {
      document.FormName.Dest.value = bestlocname;
   }
    document.FormName.submit();
}

function fnCancelLoc(){
// clear the timeout
clearTimeout(gvTimeoutID);
// let other functions know we cleared the timeout
gvTimeoutID=-1;
//pull down the progress modal
fnShowHide('idProgressModal');
}


Number.prototype.ordinal = function () {
   return this + ((this % 10 == 1 && this % 100 != 11) ? 'st' : (this % 10 == 2 && this % 100 != 12) ? 'nd' : (this % 10 == 3 && this % 100 != 13) ? 'rd' : 'th');
}

function fnEvalWrapper(code) {
   return eval(code);
}

function fnProgressModal(modalmessage) {   
document.getElementById('idProgressModalText').innerHTML = modalmessage;
document.getElementById('idProgressModal').style.display = 'block';
}

function fnShowAdditional() {
   fnShowHide('idAddtlOpt');
   fnShowHide('idNoOpt');
   setTimeout("window.scroll(0,150)", 5);
}

function fnHideAdditional() {
   fnShowHide('idAddtlOpt');
   fnShowHide('idNoOpt');
   setTimeout("window.scroll(0,150)", 5);
}

//for formating integers with leading zeros
function fnFormatInteger(num, length) {
   return (num / Math.pow(10, length)).toFixed(length).substr(2);
}

function fnLocSelect() {
   if ((document.FormName.nmOriginationPull.options[document.FormName.nmOriginationPull.selectedIndex].value == 'customloc') || (document.FormName.nmDestinationPull.options[document.FormName.nmDestinationPull.selectedIndex].value == 'customloc')) {
      location.href = 'preferences.html';
   }
}
