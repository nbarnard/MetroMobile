var curload='menu';
var locloc=new Array();
var locname=new Array();

function saveCookieArrays() {
  var temp;

  temp = locloc.join('`');
  createCookie('locloc', temp);

  temp = locname.join('`');
  createCookie('locname', temp);

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

function createCookie(name, value) {
  document.cookie = name + "=" + value + "; expires=Wed, 10 Nov 9999 21:47:44 UTC; path=/";
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

function loadmodifyloc() {
document.modifylocform.locname.value = locname[document.modifyform.list.selectedIndex];
document.modifylocform.locloc.value = locloc[document.modifyform.list.selectedIndex];

switchpage('modifyloc');
}

function addloc() {
var nextentry;

if((document.add.locloc.value == "")&&(document.add.locname.value == "")){
loadgenericmodal('please enter a name and location');
return false;
}

if(document.add.locloc.value == ""){
loadgenericmodal('please enter a location');
return false;
}

if(document.add.locname.value == ""){
loadgenericmodal('please enter a name');
return false;
}

if((document.add.locname.value.indexOf('`') !== -1) || (document.add.locloc.value.indexOf('`') !== -1)){
loadgenericmodal('sorry but the location and name cannot contain the ` character');
return false;
}

// make sure we have the newest cookie
if(!(getCookieArrays())){
nextentry=0;
} else {
nextentry=locloc.length;
}
locloc[nextentry]=document.add.locloc.value;
locname[nextentry]=document.add.locname.value;

saveCookieArrays();

document.getElementById('addsuccessitem').innerHTML= document.add.locname.value;

ShowHide('addsuccess');
}

function saveprefs() {
  createCookie('arrdep', document.prefs.Arr.value);
  createCookie('walk', document.prefs.Walk.value);
  createCookie('mimp', document.prefs.Min.value);
  createCookie('atr', document.prefs.atrpull.value);
  createCookie('minterval', document.prefs.minterval.value);
  document.getElementById('changesaved').style.display = 'block';
  document.getElementById('notsaved').style.display = 'none';
  return true;
}

function hidesave(name) {
  document.getElementById('changesaved').style.display = 'none';
  document.getElementById('notsaved').style.display = 'block';
  return true;
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

function updatepage() {
  Select_Value_Set('prefs.Arr', readCookie('arrdep'));
  Select_Value_Set('prefs.Walk', readCookie('walk'));
  Select_Value_Set('prefs.Min', readCookie('mimp'));
  Select_Value_Set('prefs.atrpull', readCookie('atr'));
  Select_Value_Set('prefs.minterval', readCookie('minterval'));
  setTimeout("window.scroll(0,1)",5);
}

function switchpage(loadpage){
document.getElementById(curload).style.display = 'none';
document.getElementById(loadpage).style.display = 'block';
curload=loadpage;

switch (loadpage){
case 'menu':
document.title = "metro mobile: preferences";
break;
case 'tripdefaults':
document.title = "metro mobile: trip defaults";
break;
case 'add':
document.title = "metro mobile: add location";
break;
case 'delete':
document.title = "metro mobile: delete location";
break;
case 'modify':
case 'modifyloc':
document.title = "metro mobile: modify location";
break;
}
  setTimeout("window.scroll(0,1)",5);
}

function ShowHide(divId) {
  if (document.getElementById(divId).style.display == 'none') {
    document.getElementById(divId).style.display = 'block';
  }
  else {
    document.getElementById(divId).style.display = 'none';
  }
}

function modifyloc() {
locname[document.modifyform.list.selectedIndex] = document.modifylocform.locname.value;
locloc[document.modifyform.list.selectedIndex] = document.modifylocform.locloc.value;

saveCookieArrays();

document.getElementById('modifysuccessitem').innerHTML= document.modifylocform.locname.value;

ShowHide('modifysuccess');

}

function loadmodify() {
var len;
var i;

// make sure we have the newest cookie
if(!(getCookieArrays())){
loadgenericmodal('there are no locations to modify');
return false;
}

len=locname.length;

document.modifyform.list.options.length=0;


for(i=0;i<len;i++){
document.modifyform.list.options[i]=new Option(locname[i]);
}

switchpage('modify');

}

function loaddelete() {
var len;
var i;

// make sure we have the newest cookie
if(!(getCookieArrays())){
loadgenericmodal('there are no locations to delete');
return false;
}

len=locname.length;

document.deleteform.list.options.length=0;


for(i=0;i<len;i++){
document.deleteform.list.options[i]=new Option(locname[i]);
}

switchpage('delete');

}

function deleteverify() {
document.getElementById('deleteconfirmitem').innerHTML=locname[document.deleteform.list.selectedIndex];
ShowHide('deleteverify');
}

function deleteloc() {
var deleteditem;

deleteditem = locname[document.deleteform.list.selectedIndex];

locname.splice(document.deleteform.list.selectedIndex,1);
locloc.splice(document.deleteform.list.selectedIndex,1);

saveCookieArrays();

ShowHide('deleteverify');

// different modals if we deleted the last item.
if(locname.length == 0)
{
document.getElementById('deletesuccesslastitem').innerHTML= deleteditem;
ShowHide('deletesuccesslast');
} else {
document.getElementById('deletesuccessitem').innerHTML= deleteditem;
ShowHide('deletesuccess');
}
}

function loadgenericmodal(modalmessage){
document.getElementById('generictext').innerHTML=modalmessage;
ShowHide('genericmodal');

}