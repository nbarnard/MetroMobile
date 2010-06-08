// global variable for the minute integers
var mint;

// global ariables for location arrays
var locloc=new Array();
var locname=new Array();

// post processing to update the form


function presubmit() {
  var myDate = new Date();
  var day;
  var month;
  var year;
  var dwkday;

if((document.FormName.origcust.value == "")&&(document.FormName.origpull.options[document.FormName.origpull.selectedIndex].value == 'blank')&&(document.FormName.destcust.value == "") && (document.FormName.destpull.options[document.FormName.destpull.selectedIndex].value == 'blank') ){
loadgenericmodal('please select or enter starting and ending addresses');
return false;
}

  // check the addresses then set them
  if (document.FormName.origcust.value == "") {
    if (document.FormName.origpull.options[document.FormName.origpull.selectedIndex].value == 'blank') {
loadgenericmodal('please select or enter a starting address');
      return false;
    } else {
      document.FormName.Orig.value = document.FormName.origpull.options[document.FormName.origpull.selectedIndex].value;
    }
  } else {
    document.FormName.Orig.value = document.FormName.origcust.value;
  }

  if (document.FormName.destcust.value == "") {
    if (document.FormName.destpull.options[document.FormName.destpull.selectedIndex].value == 'blank') {
loadgenericmodal('please select or enter an ending address');
      return false;
    } else {
      document.FormName.Dest.value = document.FormName.destpull.options[document.FormName.destpull.selectedIndex].value;
    }
  } else {

    document.FormName.Dest.value = document.FormName.destcust.value;
  }
  //find the next calendar day that matches the requested date
  switch (document.FormName.daypull.value) {
  case 'wk':
    dwkday = 1;
    break;
  case 'sat':
    dwkday = 6;
    break;
  case 'sun':
    dwkday = 0;
    break;
  }
  while (myDate.getDay() != dwkday) {
    myDate.setDate(myDate.getDate() + 1);
  }
  // format it for metro
  day = myDate.getDate();
  month = myDate.getMonth() + 1;
  year = myDate.getFullYear() - 2000;
  document.FormName.Date.value = month + '/' + day + '/' + year;
  //split the time up
  var mySplitResult = document.FormName.fulltime.value.split(" ");
  document.FormName.hour_time.value = mySplitResult[0];
  document.FormName.minute_time.value = mySplitResult[1];
  document.FormName.ampm_time.value = mySplitResult[2];
  // handle the accessibility pulldown
  if (document.FormName.atrpull.value == "Y") {
    document.FormName.atr.checked = true;
  } else {
    document.FormName.atr.checked = false;
  }
  // submit the form
  document.Formname.submit();
  return true;
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/* This script is adapted from a script available at
The JavaScript Source :: http://javascript.internet.com
Created by: Francis Cocharrua :: http://scripts.franciscocharrua.com/ */

function Select_Value_Set(SelectName, Value) {
  eval('SelectObject = document.' + SelectName + ';');
  for (index = 0; index < SelectObject.length; index++) {
    if (SelectObject[index].value == Value) {
      SelectObject.selectedIndex = index;
    }
  }
}


// the page loading functions


function updatepage() {
  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var day = now.getDay();
  var hint = 60 / mint;
  var arrdep;

  //figure out what time it is and set the time pull down correctly
  arrdep = readCookie('arrdep');
  if (arrdep == null) {
    arrdep = 'A';
  }

  if (arrdep == 'A') {
    document.FormName.fulltime.selectedIndex = hour * hint + Math.ceil(minute / mint);
  } else {
    document.FormName.fulltime.selectedIndex = hour * hint + Math.floor(minute / mint);
  }

  //figure out what day of the week it is and set the day pull down correctly
  switch (day) {
  case 0:
    document.FormName.daypull.selectedIndex = 2;
    break;
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    document.FormName.daypull.selectedIndex = 0;
    break;
  case 6:
    document.FormName.daypull.selectedIndex = 1;
    break;
  }

  // set the preferences
  Select_Value_Set('FormName.Arr', readCookie('arrdep'));
  Select_Value_Set('FormName.Walk', readCookie('walk'));
  Select_Value_Set('FormName.Min', readCookie('mimp'));
  Select_Value_Set('FormName.atrpull', readCookie('atr'));

  setTimeout("window.scroll(0,1)", 5);

  return true;
}


// Show hide function for extended options 


function ShowHide(divId) {
  if (document.getElementById(divId).style.display == 'none') {
    document.getElementById(divId).style.display = 'block';
  }
  else {
    document.getElementById(divId).style.display = 'none';
  }
}

function showadditional() {
  ShowHide('optblock');
  ShowHide('showblock');
  setTimeout("window.scroll(0,150)", 5);
}

function hideadditional() {
  ShowHide('optblock');
  ShowHide('showblock');
  setTimeout("window.scroll(0,150)", 5);
}

// for formating integers with leading zeros
function FormatInteger(num, length) {
  return (num / Math.pow(10, length)).toFixed(length).substr(2);
}

function filltime(){
// lets fill out the form with the times
var m;
var h;
var merid;
var ampm = new Array();
ampm[0] = "am";
ampm[1] = "pm";


if (readCookie('minterval') == null) {
  mint = 15;
  } else{
  mint = Number(readCookie('minterval'));
}

for (merid = 0; merid < 2; merid = merid + 1) {
  for (h = 0; h < 12; h = h + 1) {
    for (m = 0; m < 60; m = m + mint) {
      if (h == 0) {
        document.write('<option value="12 ' + FormatInteger(m, 2) + ' ' + ampm[merid] + '">12:' + FormatInteger(m, 2) + ampm[merid] + '</option>');
      } else {
        document.write('<option value="' + FormatInteger(h, 2) + ' ' + FormatInteger(m, 2) + ' ' + ampm[merid] + '">' + h + ':' + FormatInteger(m, 2) + ampm[merid] + '</option>');
      }
    }
  }
}
}
function loadgenericmodal(modalmessage){
document.getElementById('generictext').innerHTML=modalmessage;
ShowHide('genericmodal');

}

function getCookieArrays() {
  var temp;

  // get location array
  temp = readCookie('locloc');

  if (!temp) {
    return false;
  }

  locloc = temp.split('`');

  // get locname array
  temp = readCookie('locname');

  if (!temp) {
    return false;
  }

  locname = temp.split('`');

  return true;
}

function fillloc(){
var len;
var i;

if(!getCookieArrays()){
locloc=["Pike Place Market", "Seattle Center South", "Westlake Tunnel Station", "700 Broadway E", "SeaTac Airport", "Bellevue Transit Center", "University of Washington", "E Pine St & Broadway"];
locname=["Pike Place Market", "Seattle Center", "Westlake Tunnel Station", "Roy Street Coffee & Tea", "Seattle-Tacoma International Airport", "Bellevue Transit Center", "University of Washington", "Seattle Central Community College"];
} 

len=locname.length;

document.write('<option value="blank"></option>');

for(i=0;i<len;i++){
document.write('<option value="' + locloc[i] +'">' + locname[i] + '</option>');
}

}
