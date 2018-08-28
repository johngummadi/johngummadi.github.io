
$gxmlhttpBuzz=null;

// The "buzz" typically include all social activity on Cloud Study Bible.

// Like: comments, guestbook comments, birthday reminders, etc.,

// For now, we'll just load comments.

function LoadBuzzOld(updatesPanel, onSuccess, onFail)
{
	if (!updatesPanel)
		return false;
	
	var updatesUrlStr = "./biblejs/getupdates.php?t=raw";
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		$gxmlhttpBuzz = new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		$gxmlhttpBuzz = new ActiveXObject("Microsoft.XMLHTTP");
	}
	$gxmlhttpBuzz.open("GET", updatesUrlStr, true);
	$gxmlhttpBuzz.send(null);
	$gxmlhttpBuzz.onreadystatechange=(function stateChanged() 
	{ 
		if ($gxmlhttpBuzz.readyState==4) 
		{
			if (gxmlhttpBuzz.status >= 400)
			{
				if (onFail)
					onFail();
			}
			else
			{
				//updatesPanel.contentHTML = $gxmlhttpBuzz.responseText;
				updatesPanel.contentHTML = ParseBuzz($gxmlhttpBuzz.responseText);
				contentDiv.style.autoScroll = "true";
				contentDiv.style.overflowY = "auto";
				updatesPanel.titleText = "Updates";
				updatesPanel.Refresh();
				if (onSuccess)
					onSuccess();
			}
		}
	});
	return true;
} //LoadBuzzOld()


var gHttpGetCommentSeed = null;
// New JSON loading
function LoadBuzz(updatesPanel, onSuccess, onFail)
{
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		gHttpGetComments = new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		gHttpGetComments = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	var url = "http://cloudstudybible.com/biblejs/getupdates.php?t=json";
	gHttpGetComments.open('GET', url, true);
	gHttpGetComments.onreadystatechange = function handleHttpValidateLogin() {
		// did the connection work?
		if (gHttpGetComments.readyState == 4) 
		{
			if (gHttpGetComments.status >= 400)
			{
				if (onFail)
					onFail();
			}
			else
			{
				updatesPanel.contentHTML = ParseBuzz(gHttpGetComments.responseText);
				contentDiv.style.autoScroll = "true";
				contentDiv.style.overflowY = "auto";
				updatesPanel.titleText = "Updates";
				updatesPanel.Refresh();
				if (onSuccess)
					onSuccess();
			} // else - if (gHttpGetComments.status >= 400)
		} //readyState==4
	}
	gHttpGetComments.send(null);
}// LoadBuzz() //JSON loading



//ParseBuzz: This function parses the buzz from the server and presents 

// it in a way that can be 

function ParseBuzz(buzzJSONText)
{
	var commentsJSONObject = JSON.parse(buzzJSONText);
	var html = "";
	var i=0;
	for (i=0; i<commentsJSONObject.CommentedVerses.length; i++)
	{
		html += "<div class=\"\" style=\"background-color:#ffffff; border-bottom:solid 2px #86B8F4; margin-left:2em; margin-right:2em; margin-top:.3em; padding-left:1em; padding-right:1em; padding-top:1em; padding-bottom:1em;\">";
		var verse = commentsJSONObject.CommentedVerses[i];
		html += "<div class=\"\" style=\"margin-bottom:.4em; color:#333333;\"><span title=\"Click here to go to " + verse.BookName + " " + verse.ChapterNumber + ":" + verse.VerseNumber + "\" style=\"color:#000090; padding-left:.2em; padding-right:.2em;\" onclick=\"javascript:goToVerse('"+verse.BookName + "','" + verse.BookID + "','" + verse.ChapterNumber + "','" + verse.VerseNumber + "',2);\" onMouseOver=\"this.style.color='#bb0000'; this.style.cursor='pointer';\" onMouseOut=\"this.style.color='#000090';\"><b>" + verse.BookName + " " + verse.ChapterNumber + ":" + verse.VerseNumber + "  " + verse.VerseText + "</b> </span></div>";
		//var verseDiv = "<div style=\"margin:.5em; border-bottom:solid 2px;\">" + verse.BookName + " " + verse.ChapterNumber + ":" + verse.VerseNumber + " \"" + verse.VerseText + "\"</div>";
		//html += verseDiv;
		
		// if more than one comment, add a div that allows show/hide all comments
		if (verse.Comments.length>1)
		{
		  html += "<div style=\"background-color:#DFEFFF; padding:.5em; font-family:courier; font-size:12px; color:#d50000; border-bottom:solid 2px #ffffff;\" id=\"ShowVerseComments_" + verse.VerseID + "\" CommentCount=\"" + verse.VerseID + "\" onMouseOver=\"this.style.cursor='pointer';\" onMouseOut=\"this.style.cursor='default';\" onclick=\"javascript:ShowBuzzComments('HiddenCommentsID_" + verse.VerseID + "', 'ShowVerseComments_" + verse.VerseID + "');\">View all " + verse.Comments.length + " comments</div>";
		  // Hidden comments container div
		  html += "<div id=\"HiddenCommentsID_" + verse.VerseID + "\" style=\"display:none;\">";
		}
		
		var j=0;
		for (j=0; j<verse.Comments.length; j++)
		{
			if ((verse.Comments.length>1) && (j==verse.Comments.length-1))
			{
				// Close hidden comments container div
				html += "</div>";
			}
			var comment = verse.Comments[j];
			var userLine = "<b>" + comment.UserFullName + ":</b> ";
			var fullCommentDivLine = "<div class=\"\" id=\"BuzzCommentID_" + comment.CommentID + "\" onMouseOver=\"this.style.color='#222222';\" onMouseOut=\"this.style.color='#555555';\" style = \"background-color:#DFEFFF; padding:.5em; font-family:courier; font-size:14px; color:#555555; border-bottom:solid 2px #ffffff;\">" + userLine + comment.CommentText + "<div style=\"padding-top:.2em; font-size:11px; color:#888888; \">" + "<b>" + comment.Date + "  at " + comment.Time + "</b>" + "</div>" + "</div>";
			html += fullCommentDivLine;
		} //for - inner
		html += "</div>";
	} // for - outer
	return html;
} //ParseBuzz()

function ShowBuzzComments(hiddenCommentsID, ShowVerseComments)
{
	if (!hiddenCommentsID)
		return false;
	var commentdiv = document.getElementById(hiddenCommentsID);
	var ShowVerseCommentsDiv = document.getElementById(ShowVerseComments);
	if (commentdiv && ShowVerseCommentsDiv)
	{
		if (commentdiv.style.display == "none")
		{
			commentdiv.style.display="block";
			ShowVerseCommentsDiv.innerHTML = "View only latest comment";
		}
		else
		{
			commentdiv.style.display = "none";
			var commentCount = ShowVerseCommentsDiv.getAttribute("CommentCount");
			ShowVerseCommentsDiv.innerHTML = "View all " + commentCount + " comments";
		}
	}
	
	/*
	var ShowVerseCommentsDiv = document.getElementById(ShowVerseComments);
	var ShowVerseCommentsParentDiv=null;
	if (ShowVerseCommentsDiv)
		ShowVerseCommentsParentDiv = ShowVerseCommentsDiv.parentNode;
	if (ShowVerseCommentsDiv && ShowVerseCommentsParentDiv)
	{
		ShowVerseCommentsParentDiv.removeChild(ShowVerseCommentsDiv);
		ShowVerseCommentsDiv = null;
	}
	*/
} //ShowBuzzComments()
