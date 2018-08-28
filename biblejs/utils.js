
function GetMonthStr(month, short)
{
	if (month == "01" || month == "1")
		return short?"Jan" : "January";
	else if (month == "02" || month == "2")
		return short?"Feb" : "February";
	else if (month == "03" || month == "3")
		return short?"Mar" : "March";
	else if (month == "04" || month == "4")
		return short?"Apr" : "April";
	else if (month == "05" || month == "5")
		return short?"May" : "May";
	else if (month == "06" || month == "6")
		return short?"Jun" : "June";
	else if (month == "07" || month == "7")
		return short?"July" : "July";
	else if (month == "08" || month == "8")
		return short?"Aug" : "August";
	else if (month == "09" || month == "9")
		return short?"Sep" : "September";
	else if (month == "10")
		return short?"Oct" : "October";
	else if (month == "11")
		return short?"Nov" : "November";
	else if (month == "12")
		return short?"Dec" : "December";
	return "Unknown";
}

var monthNames = new Array("January","February","March","April","May","June","July",
"August","September","October","November","December");

var dayNames = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");


//(2010-07-31 20:01:36)
function GetPresentableDateTimeString(rawDataTimeStr)
{
	var retstr = "";
	var dateTimeStr = rawDataTimeStr.split(' ');
	var dateStr = dateTimeStr[0];
	var timeStr = dateTimeStr[1];
	
	if (dateStr && timeStr)
	{
		var dateElems = dateStr.split('-');
		var timeElems = timeStr.split(':');
		
		retstr = GetMonthStr(dateElems[1]) + " " + dateElems[2] + ", " + dateElems[0];
		retstr += "  at  " + dateTimeStr[1];
	}
	return retstr;
}

function GetPresentableCurrentDate()
{
	var retStr = "";
	var now = new Date();
	if (now)
	{
		var date = now.getDate();
		if (date < 9)
			date = "0" + date;
		retStr = dayNames[now.getDay()] + ". " + monthNames[now.getMonth()] + ", " + date + ", " + now.getFullYear();
	}
	return retStr;
} //GetPresentableCurrentDate()

function GetPresentableCurrentTime()
{
	var retStr = "";
	var now = new Date();
	if (now)
	{
		var ampm = "AM";
		var hour = now.getHours();
		if (hour >= 12)
			ampm = "PM";
			
		if (hour > 12)
			hour = hour-12;
		else if (hour == 0)
			hour = 12;
		
		if (hour < 10)
			hour = "0" + hour;
		var minutes = now.getMinutes();
		if (minutes < 10)
			minutes = "0" + minutes;
		retStr = hour + ":" + minutes + " " + ampm;
	}
	return retStr;
} //GetPresentableCurrentTime()
