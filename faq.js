function fnShowHide(divId) {
    if (document.getElementById(divId).style.display == 'none') {
	document.getElementById(divId).style.display = 'block';
    } else {
	document.getElementById(divId).style.display = 'none';
    }
}


/* This script and many more are available free online at
The JavaScript Source!! http://javascript.internet.com
Copyright 1999 Idocs, Inc. http://www.idocs.com
Distribute this script freely but keep this notice in place */

function fnNumbersOnly(myfield, e, dec) {
    var key;
    var keychar;

    if (window.event) key = window.event.keyCode;
    else if (e) key = e.which;
    else return true;
    keychar = String.fromCharCode(key);

    // control keys
    if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13) || (key == 27)) return true;

    // numbers
    else if ((("0123456789.").indexOf(keychar) > -1)) return true;

    else return false;
}
