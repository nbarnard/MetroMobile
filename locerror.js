function debugdump()
{
  var debugloc = new Array();
  Number.prototype.ordinal = function ()
  {
    return this + ((this % 10 == 1 && this % 100 != 11) ? 'st' : (this % 10 == 2 && this % 100 != 12) ? 'nd' : (this % 10 == 3 && this % 100 != 13) ? 'rd' : 'th');
  }

  function addrow(recordtime, submitcontent, loc)
  {
    var row;
    var cell;
    var celltext;
    var img;
    var hr;
    var rowcolor;
    var createClickHandler =

    function (element)
    {
      return function ()
      {
        document.idLocAttemptReportForm.debugdata.value = element;
        fnShowHide('idLocAttemptMain');
        document.getElementById('idLocAttemptReport').style.display = 'block';
      };
    };

    row = document.createElement("tr");
    row.onclick = createClickHandler(recordcontent);

    if (rownum % 2)
    {
      rowcolor = '#FFFFFF';
    }
    else
    {
      rowcolor = '#FF9D00';
    }

    cell = document.createElement("td");

    cell.style.background = rowcolor;
    cell.style.backgroundImage = 'url(<!--#include virtual="rightarrowimg-data.txt" -->)';
    cell.style.backgroundPosition = 'right center';
    cell.style.backgroundRepeat = 'no-repeat';

    celltext = document.createTextNode('time');
    cell.appendChild(celltext);

    cell.appendChild(document.createElement("br"));

    celltext = document.createTextNode(recordtime);
    cell.appendChild(celltext);

    hr = document.createElement("hr");
    hr.className = 'CSMidEntryHR';

    cell.appendChild(hr);

    celltext = document.createTextNode("stop");
    cell.appendChild(celltext);

    cell.appendChild(document.createElement("br"));

    celltext = document.createTextNode(loc);
    cell.appendChild(celltext);

    row.appendChild(cell);

    document.getElementById('idLocAttempt').appendChild(row);

    rownum++;
    recordcontent = '';

  }

  var monthnames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  var temp;
  var x;
  var year;
  var month;
  var day;
  var hour;
  var minute;
  var ampm;
  var entrystatus;
  var rownum;
  var recordtime;
  var recordcontent;

  temp = fnReadCookie('CkDebugInfo');
  // if we don't have any info in the cookie set error page
  if (temp == null)
  {
    fnSetSelect('nmPrefsForm.nmDebugTrackPull', fnReadCookie('CkDebugTrackPull'));
    document.getElementById('idLocAttemptFail').style.display = 'block';
    return;
  }

  debugloc = temp.split(':');
  entrystatus = 0;
  recordcontent = '';
  rownum = 0;

  // lets loop through each of the entries in the cookie
  for (x = 0; x < debugloc.length; x++)
  {
    recordcontent = recordcontent + ':' + debugloc[x];
    // if the 15th character is 0 we're at the beginning of a new record.
    if (debugloc[x].substr(15, 1) == '0')
    {

      // check to see if we wrote out the old record, if not write it out.
      if (entrystatus == 1)
      {
        addrow(recordtime, recordcontent, 'no stop found');
      }
      month = monthnames[parseInt(debugloc[x].substr(4, 2)) - 1];
      day = parseInt(debugloc[x].substr(6, 2)).ordinal();
      year = debugloc[x].substr(0, 4);
      hour = parseInt(debugloc[x].substr(8, 2));
      minute = debugloc[x].substr(10, 2);

      if (hour > 12)
      {
        hour = hour - 12;
        ampm = 'pm';
      }
      else
      {
        ampm = 'am';
      }


      // lets deal with the exceptions.. sigh.
      if (hour == 12)
      {
        ampm = 'pm';
      }

      if (hour == 0)
      {
        hour = 12;
        ampm = 'am';
      }


      recordtime = month + ' ' + day + ', ' + year + ' at ' + hour + ':' + minute + ' ' + ampm;
      entrystatus = 1;

    }

    // if the 15th character is an L we got a location, write it out.
    if (debugloc[x].substr(15, 1) == 'L')
    {
      addrow(recordtime, recordcontent, debugloc[x].substr(16));
      entrystatus = 0;
    }

  } // end of loop
  // if we didn't write out the last entry, write it out now.
  if (entrystatus == 1)
  {
    addrow(recordtime, recordcontent, 'no stop found');
  }
  document.getElementById('idLocAttemptMain').style.display = 'block';
}
