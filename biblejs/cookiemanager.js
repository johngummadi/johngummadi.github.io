// Author: John K Gummadi
// Date: 5:01 PM 6/18/2010

function SaveUserPassword(username, password, expiredays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	var expiryStr = ((expiredays==null) ? "" : "; expires="+exdate.toUTCString());
	
	document.cookie = "UserName=" + username + expiryStr;
	document.cookie = "Password=" + password + expiryStr;
	document.cookie = "LoginExpires=" + exdate.getTime() + expiryStr;
	
} //SaveUserPassword()

function DeleteUserPassword()
{
	document.cookie = "UserName=" + "; " + "expires=Thu, 01-Jan-70 00:00:01 GMT";
	document.cookie = "Password=" + "; " + "expires=Thu, 01-Jan-70 00:00:01 GMT";
	document.cookie = "LoginExpires=" + "; " + "expires=Thu, 01-Jan-70 00:00:01 GMT";
} //DeleteUserPassword()

function GetSavedUserName()
{
	var username = getCookie('UserName');
	return username;
} //GetSavedUserName()

function GetSavedPassword()
{
	var password = getCookie('Password');
	return password;
} //GetSavedPassword()

function GetBuzzOnStartup()
{
	var ret = 1;
	var buzzOnStartup = getCookie('BuzzOnStartup');
	if (buzzOnStartup == "0")
		ret = 0;
	return ret;
} //GetBuzzOnStartup()

function SetBuzzOnStartup(flag)
{
	var expiredays = 30;
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	var expiryStr = ((expiredays==null) ? "" : "; expires="+exdate.toUTCString());
	
	if (flag)
		document.cookie = "BuzzOnStartup=1" + expiryStr;
	else
		document.cookie = "BuzzOnStartup=0" + expiryStr;
} //SetBuzzOnStartup()


function SaveScrollPosKjv(pos)
{
	var expiredays = 365;
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	var expiryStr = "; expires="+exdate.toUTCString();
	
	document.cookie = "LastScrollPosKjv=" + pos + expiryStr;
} //SaveScrollPosKjv()

function SaveScrollPosAsv(pos)
{
	var expiredays = 365;
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	var expiryStr = "; expires="+exdate.toUTCString();
	
	document.cookie = "LastScrollPosAsv=" + pos + expiryStr;
} //SaveScrollPosAsv()

function SaveScrollPosWeb(pos)
{
	var expiredays = 365;
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	var expiryStr = "; expires="+exdate.toUTCString();
	
	document.cookie = "LastScrollPosWeb=" + pos + expiryStr;
} //SaveScrollPosWeb()

function SaveCurrentPosition(lastBookID, lastChapterNumber, lastVerseNumber)
{
	var expiredays = 365;
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	var expiryStr = "; expires="+exdate.toUTCString();
	
	document.cookie = "LastBookID=" + lastBookID + expiryStr;
	document.cookie = "LastChapterNumber=" + lastChapterNumber + expiryStr;
	document.cookie = "LastVerseNumber=" + lastVerseNumber + expiryStr;
} //SaveCurrentPosition()

function GetLastBookID()
{
	var lastBookID = getCookie('LastBookID');
	if (lastBookID == "failed")
		lastBookID = 1;
	return lastBookID;
} //GetLastBookID()

function GetLastChapterNumber()
{
	var lastChapterNumber = getCookie('LastChapterNumber');
	if (lastChapterNumber == "failed")
		lastChapterNumber = 1;
	return lastChapterNumber;
} //GetLastChapterNumber()

function GetLastVerseNumber()
{
	var lastVerseNumber = getCookie('LastVerseNumber');
	if (lastVerseNumber == "failed")
		lastVerseNumber = 1;
	return lastVerseNumber;
} //GetLastVerseNumber()

function GetLastScrollPosKjv()
{
	var lastScrollPosKjv = getCookie('LastScrollPosKjv');
	return lastScrollPosKjv;
} //GetLastScrollPosKjv()

function GetLastScrollPosAsv()
{
	var lastScrollPosAsv = getCookie('LastScrollPosAsv');
	return lastScrollPosAsv;
} //GetLastScrollPosAsv()

function GetLastScrollPosWeb()
{
	var lastScrollPosWeb = getCookie('LastScrollPosWeb');
	return lastScrollPosWeb;
} //GetLastScrollPosWeb()


function GetSavedExpiryDate()
{
	var exdate = new Date();
	var exDateStr = getCookie('LoginExpires');
	exdate.setTime(exDateStr);
	return exdate;
} //GetSavedExpiryDate()

function IsLoginExpired()
{
	var curDate = new Date();
	var exdate = GetSavedExpiryDate();
	// If no cookie, treate it as expired
	if (!exdate)
		return true;
	//document.body.innerHTML += "Comparing " + curDate.getTime() + "and" + exdate.getTime();
	if (curDate.getTime() < exdate.getTime())
		return false;
	return true;
} //IsLoginExpired()

function GetBrowsingHistory()
{
	var browsingHistoryStr = getCookie('BrowsingHistory');
	if (browsingHistoryStr == "failed")
		return null;
	//browsingHistoryStr = browsingHistoryStr.evalJSON(true);
	var browsingHistory = JSON.parse(browsingHistoryStr);
	return browsingHistory;
} //GetBrowsingHistory()

function SaveBrowsingHistory(browsingHistory)
{
	var expiredays = 365;
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	var expiryStr = "; expires="+exdate.toUTCString();
	document.cookie = "BrowsingHistory=" + JSON.stringify(browsingHistory) + expiryStr;
} //SaveBrowsingHistory()

function getCookie(c_name)
{
	if (document.cookie.length>0)
	{
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1)
		{
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "failed";
} //getCookie()