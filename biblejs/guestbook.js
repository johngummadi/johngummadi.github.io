// Guestbook related code
$gxmlhttpGuestbookGet=null;
$gxmlhttpGuestbookAdd=null;

function LoadGuestComments(guestCommentsDivID, guestbookTitleDivID)
{
	var guestCommentsDiv = document.getElementById(guestCommentsDivID);
	if (!guestCommentsDiv)
		return false;
	
	var guestbookTitleText = "<b>Guest Book</b>";
	var guestbookTitleDiv = document.getElementById(guestbookTitleDivID);
	if (guestbookTitleDiv)
		guestbookTitleText = guestbookTitleDiv.innerHTML;
	
	$url = "./biblejs/guestbook.php?t=get";
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		$gxmlhttpGuestbookGet=new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		$gxmlhttpGuestbookGet=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	$gxmlhttpGuestbookGet.open("GET",$url,true);
	// IE.8 is returning cache (ignoring the new comments), therefore the below line. 
	//	This worked well with Chrome too
	$gxmlhttpGuestbookGet.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
	$gxmlhttpGuestbookGet.send(null);
	
	$gxmlhttpGuestbookGet.onreadystatechange = (function guestCommentsReceived() {
		if ($gxmlhttpGuestbookGet.readyState==4)
		{
			var fullText = "";
			lines = $gxmlhttpGuestbookGet.responseText.split('^');
			var index=0;
			guestCommentsDiv.style.autoScroll = "true";
			guestCommentsDiv.style.overflowX = "hidden";
			guestCommentsDiv.style.overflowY = "auto";
			while (lines && lines[index])
			{
				results = lines[index].split('|');
				if (results && results[2] && results[4])
				{
					var nameSpanStr = "<div style=\"position:relative; paddingLeft:2em; paddingTop:2em; width:500px; \">" + "<br><b>" + results[2] + ":</b>" + "</div>"
					var commentSpanStr = "<div style=\"position:relative; paddingLeft:2em; \">" + results[4] + " <br></div>"
					var datespanStr = "<div style=\"font-size:9px; color:#555555\">" + GetPresentableDateTimeString(results[3]) + "</div>";
					var divstr;
					if (index == 0)
					{
						divstr = "<div id=\"GuestComment_" + results[2] + "\" style=\"position:relative; paddingTop:2em; padding-bottom:.3em; border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc; background-color:#ffffff;\">" + nameSpanStr + commentSpanStr + datespanStr + "</div>";
					}
					else
					{
						divstr = "<div id=\"GuestComment_" + results[2] + "\" style=\"position:relative; paddingTop:2em; padding-bottom:.3em; border-bottom: 1px solid #cccccc; background-color:#ffffff;\">" + nameSpanStr + commentSpanStr + datespanStr + "</div>";
					}
					fullText += divstr;
				}
				++index;
			}
			guestCommentsDiv.innerHTML = fullText;
			if (guestbookTitleDiv)
				guestbookTitleDiv.innerHTML = guestbookTitleText;
		}
		else
		{
			if (guestCommentsDiv.innerHTML == "")
				guestCommentsDiv.innerHTML = "Loading...";
			
			if (guestbookTitleDiv)
				guestbookTitleDiv.innerHTML = "Guest Book - Loading...";
		}
	});
} //LoadGuestComments()

function AddGuestComment(guestCommentsDivID, guestbookErrorMsgDiv , userID, guestName, commentTextDiv)
{
	var comment = commentTextDiv.value;
	var guestCommentsDiv = document.getElementById(guestCommentsDivID);
	if (!guestCommentsDiv)
		return false;
	
	$url = "./biblejs/guestbook.php?t=add&uid=" + userID + "&n=" + guestName + "&c=" + comment;
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		$gxmlhttpGuestbookAdd=new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		$gxmlhttpGuestbookAdd=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	$gxmlhttpGuestbookAdd.open("GET",$url,true);
	$gxmlhttpGuestbookAdd.send(null);
	
	$gxmlhttpGuestbookAdd.onreadystatechange = (function guestCommentsReceived() {
		if ($gxmlhttpGuestbookAdd.readyState==4)
		{
			var errDiv = document.getElementById(guestbookErrorMsgDiv);
			results = $gxmlhttpGuestbookAdd.responseText.split('|');
			if (results && results[0] == 'true')
			{
				if (errDiv)
					errDiv.innerHTML = "Thanks for your comments.";
				commentTextDiv.value = "";
				guestCommentsDiv.innerHTML = "<b>Loading...</b>";
				LoadGuestComments(guestCommentsDivID);
			}
		}
		else
		{
			if (errDiv)
				errDiv.innerHTML = "Oops, looks like some bug, please let me know by email.";
			//guestCommentsDiv.innerHTML += "<br><b>Adding...</b>";
		}
	});
} //LoadGuestComments()

