
var LOGIN_URL = "biblejs/userlogin.php?";
var COMMENT_URL = "biblejs/comment.php?"; 
var REASON_POST_COMMENT = 1;

var REASON_GET_COMMENTS = 2;

var gHttpGetCommentSeed = null;
var gHttpGetCommentCount = null;
var gHttpGetComments = null;
var gHttpPostComment = null;

var gCommentsDivID="";

var gPostCommentSuccessfulCallback = 0;
var gPostCommentFailedCallback = 0;

var gGetCommentsSuccessfulCallback = 0;
var gGetCommentsFailedCallback = 0;

var gCommentSeedId = 0;
var gCommentSeed = 0;

var gUserForPostComment = "";
var gPasswordForPostComment = "";

var gVerseDivPretext="";

var gBookID="";
var gChapterID="";
var gVerseID="";
var gCommentText="";
var gDivID="";

function doGetComments(username, password, bookID, chapterID, verseID, commentsDivID, verseDivPretext, 
	getCommentsSuccessfulCallback, getCommentsFailedCallback, divID)
{
	gUserForPostComment = username;
	gPasswordForPostComment = password;
	
	gDivID = divID;
	
	gVerseDivPretext = verseDivPretext;
	
	gBookID = bookID;
	gChapterID = chapterID;
	gVerseID = verseID;
	gCommentsDivID = commentsDivID;
	
	gGetCommentsSuccessfulCallback = getCommentsSuccessfulCallback;
	gGetCommentsFailedCallback = getCommentsFailedCallback;
	
	getCommentSeed(REASON_GET_COMMENTS);
}


// Returns formatted format text:
function formatCommentText(commentText)
{
	commentText = commentText.replace(/\r\n/gi,"<br>");
	commentText = commentText.replace(/\n/gi,"<br>");	
	return commentText;
}

function doPostComment(username, password, bookID, chapterID, verseID, commentText, 
	postCommentSuccessfulCallback, postCommentFailedCallback, verseDivPretext, divID)
{
	gUserForPostComment = username;
	gPasswordForPostComment = password;
	
	gDivID = divID;
	gBookID = bookID;
	gChapterID = chapterID;
	gVerseID = verseID;
	if (commentText != null)
	{
		gCommentText = formatCommentText(commentText);
	}
	gVerseDivPretext = verseDivPretext;
	
	gPostCommentSuccessfulCallback = postCommentSuccessfulCallback;
	gPostCommentFailedCallback = postCommentFailedCallback;
	
	getCommentSeed(REASON_POST_COMMENT);
}



// getCommentSeed method:  gets a seed from the server for this transaction
function getCommentSeed(reason) 
{
	// only get a seed if we're not logged in and we don't already have one
	// open up the path
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		gHttpGetCommentSeed = new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		gHttpGetCommentSeed = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	gHttpGetCommentSeed.open('GET', LOGIN_URL + "t=getseed", true);
	gHttpGetCommentSeed.onreadystatechange = function handleHttpGetCommentSeed() {
		// if there hasn't been any errors
		if (gHttpGetCommentSeed.readyState == 4) {
			// split by the divider |
			results = gHttpGetCommentSeed.responseText.split('|');
			
			// id is the first element
			gCommentSeedId = results[0];
			
			// seed is the second element
			gCommentSeed = results[1];
			
			// now we have the comment seed, post comment now.
			if (reason == REASON_POST_COMMENT)			
				postComment();
			else if (reason == REASON_GET_COMMENTS)
				getComments();
		}
		else
		{
			//if (gPostCommentFailedCallback)
				//gPostCommentFailedCallback("Post comment in progress, seed state =" + gHttpGetCommentSeed.readyState + "");
		}
	}; //handleHttpGetCommentSeed()
	gHttpGetCommentSeed.send(null);
} //getCommentSeed()

function onMouseOverCommentBtn(commentBtnDivID)
{
	var commentBtnDiv = document.getElementById(commentBtnDivID);
	if (commentBtnDiv)
	{
		var commentCount = commentBtnDiv.getAttribute('commentCount');
		commentBtnDiv.style.cursor = "pointer";
		var bkImagePath = "";
		if (commentCount > 0)
		{
			bkImagePath = "biblejs/images/comments_show_mouseover_small.png";
		}
		else
		{
			bkImagePath = "biblejs/images/comments_add_small.png";
		}
		commentBtnDiv.style.backgroundImage = "url(" + bkImagePath + ")";
	}
} //onMouseOverCommentBtn()

function onMouseOutCommentBtn(commentBtnDivID)
{
	var commentBtnDiv = document.getElementById(commentBtnDivID);
	if (commentBtnDiv)
	{
		var commentCount = commentBtnDiv.getAttribute('commentCount');
		commentBtnDiv.style.cursor = "pointer";
		
		if (commentCount > 0)
		{
			bkImagePath = "biblejs/images/comments_show_small.png";
		}
		else
		{
			bkImagePath = "biblejs/images/comments_normal_small.png";
		}
		commentBtnDiv.style.backgroundImage = "url(" + bkImagePath + ")";
	}
} //onMouseOutCommentBtn()

function UpdateCommentCount(divID, bookID, chapterID, bookCommentCount, chapterCommentCount, verseCommentCount) //commentCount)
{
	var commentBtnKJVDiv = document.getElementById("KjvNewCommentBtnId" + divID);
	var commentBtnASVDiv = document.getElementById("AsvNewCommentBtnId" + divID);
	
	if (commentBtnKJVDiv || commentBtnASVDiv)
	{
		if (commentBtnKJVDiv)
		{
			var bookName = commentBtnKJVDiv.getAttribute('bookName');
			var chapterNumber = commentBtnKJVDiv.getAttribute('chapterNumber');
			var verseNumber = commentBtnKJVDiv.getAttribute('verseNumber');
			commentBtnKJVDiv.setAttribute('commentCount', verseCommentCount);
			
            
			if (verseCommentCount > 0)
			{
				commentBtnKJVDiv.innerHTML = "<span style=\"position:relative; top:-4px; font-size:9px; font-weight:bold; color:#aa0000;\">&nbsp;&nbsp; " + verseCommentCount + " &nbsp;&nbsp;</span>";
				
				commentBtnKJVDiv.style.backgroundImage = "url('biblejs/images/comments_show_small.png')";
				commentBtnKJVDiv.title = verseCommentCount + " comment(s) on " + bookName + " " + chapterNumber + ":" +verseNumber + ", click to view or add a new comment on this verse.";
			}
			else
			{
				commentBtnKJVDiv.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
				
				commentBtnKJVDiv.style.backgroundImage = "url('biblejs/images/comments_normal_small.png')";
				commentBtnKJVDiv.title = "Click here to comment on " + bookName + " " + chapterNumber + ":" +verseNumber + ".";
			}
		}
		
		if (commentBtnASVDiv)
		{
			var bookName = commentBtnASVDiv.getAttribute('bookName');
			var chapterNumber = commentBtnASVDiv.getAttribute('chapterNumber');
			var verseNumber = commentBtnASVDiv.getAttribute('verseNumber');
			commentBtnASVDiv.setAttribute('commentCount', verseCommentCount);
			
			if (verseCommentCount > 0)
			{
				commentBtnASVDiv.innerHTML = "<span style=\"position:relative; top:-4px; font-size:9px; font-weight:bold; color:#aa0000;\">&nbsp;&nbsp; " + verseCommentCount + " &nbsp;&nbsp;</span>";
				
				commentBtnASVDiv.style.backgroundImage = "url('biblejs/images/comments_show_small.png')";
				commentBtnASVDiv.title = verseCommentCount + " comment(s) on " + bookName + " " + chapterNumber + ":" +verseNumber + ", click to view or add a new comment on this verse.";
			}
			else
			{
				commentBtnASVDiv.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
				
				commentBtnASVDiv.style.backgroundImage = "url('biblejs/images/comments_normal_small.png')";
				commentBtnASVDiv.title = "Click here to comment on " + bookName + " " + chapterNumber + ":" +verseNumber + ".";
			}
		}
        
        var bookCommentCountSpan = document.getElementById("BookCommentCount_"+bookID);
        if (bookCommentCountSpan)
        {
            if (bookCommentCount>0)
            {
                bookCommentCountSpan.style.visibility="visible";
				bookCommentCountSpan.style.backgroundColor = "#f58d15";
                bookCommentCountSpan.innerHTML = "<b>" + bookCommentCount + "</b>";
            }
            else
            {
                bookCommentCountSpan.style.visibility="hidden";
				bookCommentCountSpan.style.backgroundColor = "transparent";
                bookCommentCountSpan.innerHTML = "";
            }
            // Set command span's title (i.e., tooltip)
            if (bookCommentCount==1)
                bookCommentCountSpan.title = bookCommentCount + " comment in " + bookCommentCountSpan.getAttribute('bookname');
            else if (bookCommentCount>1)
                bookCommentCountSpan.title = bookCommentCount + " comments in " + bookCommentCountSpan.getAttribute('bookname');
        }
        
        
        // Update chapter comments count
        var chapterCommentCountSpan = document.getElementById("ChapterCommentCount_"+chapterID);
        if (chapterCommentCountSpan)
        {
            if (chapterCommentCount>0)
            {
                chapterCommentCountSpan.style.visibility="visible";
				chapterCommentCountSpan.style.backgroundColor = "#f58d15";
                chapterCommentCountSpan.innerHTML = "<b>" + chapterCommentCount + "</b>";
            }
            else
            {
                chapterCommentCountSpan.style.visibility="hidden";
				chapterCommentCountSpan.style.backgroundColor = "transparent";
                chapterCommentCountSpan.innerHTML = "";
            }
                
            // Set command span's title (i.e., tooltip)
            if (chapterCommentCount==1)
                chapterCommentCountSpan.title = chapterCommentCount + " comment in " + chapterCommentCountSpan.getAttribute('bookname') + " " + chapterCommentCountSpan.getAttribute('chapternumber');
            else if (chapterCommentCount>1)
                chapterCommentCountSpan.title = chapterCommentCount + " comments in " + chapterCommentCountSpan.getAttribute('bookname') + " " + chapterCommentCountSpan.getAttribute('chapternumber');
        }
	}
} //UpdateCommentCount()

function GetCommentCount(divID, PostCommentSuccessfulCallback, commentid)
{
	var commentBtnKJVDiv = document.getElementById("KjvNewCommentBtnId" + divID);
	var commentBtnASVDiv = document.getElementById("AsvNewCommentBtnId" + divID);
	if (commentBtnKJVDiv || commentBtnASVDiv)
	{
		var verseID = commentBtnKJVDiv.getAttribute('verseiddb');
		var chapterID = commentBtnKJVDiv.getAttribute('chapteriddb');
		var bookID = commentBtnKJVDiv.getAttribute('bookiddb');
		if (verseID == null)
			verseID = commentBtnASVDiv.getAttribute('verseiddb');
		if (verseID == null)
			return;
		
		// open the http connection
		var url = COMMENT_URL + "t=getcommentcount&vid="+verseID + "&cid=" +chapterID +"&bid=" +bookID;
		
		if (window.XMLHttpRequest)
		{
			// code for IE7+, Firefox, Chrome, Opera, Safari
			gHttpGetCommentCount = new XMLHttpRequest();
		}
		else
		{
			// code for IE6, IE5
			gHttpGetCommentCount = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		gHttpGetCommentCount.open('GET', url, true);
		// where to go
		gHttpGetCommentCount.onreadystatechange = function Handler()
		{
			// did the connection work?
			if (gHttpGetCommentCount.readyState == 4)
			{
				// Format: VerseID|CommentCount
				var results = gHttpGetCommentCount.responseText.split('|');
				//if (results[0] == verseID) //make sure the comment-count is for this verseid.
				{
                    var bookCommentCount = results[3];
                    var chapterCommentCount = results[4];
                    var verseCommentCount = results[5];
					//var commentCount = results[1];
					//UpdateCommentCount(divID, gBookID, gChapterID, commentCount);
                    UpdateCommentCount(divID, gBookID, gChapterID, bookCommentCount, chapterCommentCount, verseCommentCount);
				}
				if (PostCommentSuccessfulCallback)
					PostCommentSuccessfulCallback(commentid, gBookID, gChapterID, gVerseID, gVerseDivPretext, divID);
			}
			else
			{
				// ignore other responses...
			}
		}
		gHttpGetCommentCount.send(null);
		return true;
	}
	else
	{
		return false;
	}
}

function postComment()
{
	if (gCommentSeedId == 0 || gCommentSeed == 0 || gUserForPostComment == '' || gPasswordForPostComment  == '')
	{
		if (gPostCommentFailedCallback)
			gPostCommentFailedCallback("Failed to post the comment, please re-login and try posting agian.");
		return;
	}
	
	// compute the hash of the hash of the password and the seed
	hash = hex_md5(hex_md5(gPasswordForPostComment) + gCommentSeed);
	
	// open the http connection
	var commentTextToSend = gCommentText.replace("%","_PERCENTSYMBOL_");
	var url = COMMENT_URL + "t=postcomment&uname="+gUserForPostComment+"&sid="+gCommentSeedId+"&h="+hash+"&bid="+gBookID+"&cid="+gChapterID+"&vid="+gVerseID+"&c="+commentTextToSend+"&ispub=1";
	
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		gHttpPostComment = new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		gHttpPostComment = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	gHttpPostComment.open('GET', url, true);
	
	// where to go
	gHttpPostComment.onreadystatechange = function handleHttpValidateLoginForComments(){
		// did the connection work?
		if (gHttpPostComment.readyState == 4) 
		{
			//if (gPostCommentFailedCallback)
				//gPostCommentFailedCallback("Got response");
			// split by the pipe
			results = gHttpPostComment.responseText.split('|');
			if (results[0] == 'true')
			{
				hasSeed = false;
				loggedIn = true;
				gFullname = results[1];
				commentid = results[1];
				var success = GetCommentCount(gDivID, gPostCommentSuccessfulCallback, commentid);
				//if (gPostCommentSuccessfulCallback)
					//gPostCommentSuccessfulCallback(commentid, gBookID, gChapterID, gVerseID, gVerseDivPretext, gDivID);
				if (success==false) // it is ok, still send success event (as by now we're done posting)
				{
					if (gPostCommentSuccessfulCallback)
						gPostCommentSuccessfulCallback(commentid, gBookID, gChapterID, gVerseID, gVerseDivPretext, gDivID);
				}
			}
			else
			{
				messages = results[1];
				if (gPostCommentFailedCallback)
					gPostCommentFailedCallback(messages);
			}
		}
		else
		{
			//if (gPostCommentFailedCallback)
				//gPostCommentFailedCallback("Posting comment (State = " + gHttpPostComment.readyState + ")");
		}
	};
	////////////////////////////////////////////////////////////
	gHttpPostComment.send(null);
} //postComment()



function getComments()
{
	if (gCommentSeedId == 0 || gCommentSeed == 0 || gUserForPostComment == '' || gPasswordForPostComment  == '')
	{
		if (gPostCommentFailedCallback)
			gPostCommentFailedCallback("Failed to post the comment, please re-login and try posting agian.");
		return;
	}
	
	// Get comment div
	var commentsDiv = document.getElementById(gCommentsDivID);
	if (!commentsDiv)
	{
		if (gGetCommentsFailedCallback)
			gGetCommentsFailedCallback("Comment box not found, something is wrong!");
		return;
	}
	
	// compute the hash of the hash of the password and the seed
	hash = hex_md5(hex_md5(gPasswordForPostComment) + gCommentSeed);
	
	// open the http connection
	var url = COMMENT_URL + "t=getcomments&uname="+gUserForPostComment+"&sid="+gCommentSeedId+"&h="+hash+"&bid="+gBookID+"&cid="+gChapterID+"&vid="+gVerseID;
	
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
	
	gHttpGetComments.open('GET', url, true);
	
	// where to go
	gHttpGetComments.onreadystatechange = function handleHttpValidateLogin(){
		// did the connection work?
		if (gHttpGetComments.readyState == 4) 
		{
			//var gGetCommentsSuccessfulCallback = 0;
			//var gGetCommentsFailedCallback = 0;
			
			// split by the pipe
			rows = gHttpGetComments.responseText.split('^');
			var index = 0;
			//var commentCount = 0;
            var bookCommentCount = 0;
            var chapterCommentCount=0;
            var verseCommentCount=0;
			if (rows.length)
			{
                counts = rows[0].split('|');
				//commentCount = rows[0];
                bookCommentCount = counts[0];
                chapterCommentCount = counts[1];
                verseCommentCount = counts[2];
				index = 1;
			}
			commentsDiv.innerHTML = "";
			var foundComment = false;
			while (index < rows.length)
			{
				//commentsDiv.innerHTML += rows[index];
				line = rows[index].split('|');
				if (line == "")
				{
					index++;
					continue;
				}
				foundComment = true;
				var userFullName = line[10];
				var isHidden = line[6];
				var dateTime = line[7];
				var comment = line[8];
				var formatedDateTime = GetPresentableDateTimeString(dateTime);
				var topLine = "<div style=\"font-size:10px; font-weight:normal; color:#444444;\">" + userFullName + " on " + formatedDateTime + ":</div>";
				var bottomLine = "";
				if (isHidden == "1")
					bottomLine = "<div style=\"font-size:12px; font-weight:normal; color:#cc0000;\">" + comment + "</div>";
				else
					bottomLine = "<div style=\"font-size:12px; font-weight:normal; color:#000066;\">" + comment + "</div>";
				if (index == 1)
				{
					commentsDiv.innerHTML += "<div style=\"position:relative; padding:.5em;\">" + topLine + bottomLine + "</div>";
				}
				else if (index == rows.length-2)
				{
					//var closeStr = "<span style=\"position:relative; font-size:9px; font-weight:normal; float:right; color:#0000aa;\" onMouseOver=\"style.cursor = 'pointer';\" onclick=\"javascript:onCloseComments('"+gVerseDivPretext+"');\">" + "Close" + "</span>";
					//bottomLine = "<div style=\"font-size:11px; font-weight:normal; color:#cc0000;\">" + comment + closeStr + "</div>";
					//bottomLine = "<div style=\"color:#cc0000;\">" + comment + "</div>";
					commentsDiv.innerHTML += "<div style=\"position:relative; padding:.5em; border-top:solid 1px #ffffff;\">" + topLine + bottomLine + "</div>";
				}
				else
				{
					commentsDiv.innerHTML += "<div style=\"position:relative; padding:.5em; border-top:solid 1px #ffffff;\">" + topLine + bottomLine + "</div>";
				}
				index++;
			}
			
			//UpdateCommentCount(gDivID, gBookID, gChapterID, commentCount);
            UpdateCommentCount(gDivID, gBookID, gChapterID, bookCommentCount, chapterCommentCount, verseCommentCount);
			
			if (foundComment == false)
			{
				var nocommentsText = "";
				if (isLoggedIn())
				{
					nocommentsText = "No comments posted so far on this verse, be the first of your friends to comment";
				}
				else
				{
					nocommentsText = "No public comments posted so far on this verse, please login to see your private comments or protected comments of your friends.";
				}
				var closeStr = "<span style=\"position:relative; font-size:11px; font-weight:normal; color:#0000aa;\" onMouseOver=\"style.cursor = 'pointer';\" onclick=\"javascript:onCloseComments('"+gVerseDivPretext+"');\">" + "Close" + "</span>";
				commentsDiv.innerHTML = "<div style=\"position:relative; padding:.5em; font-size:11px; font-weight:normal; color:#aa0000;\">" + nocommentsText + "</div>";
			}
			else
			{
				var closeStr = "<span style=\"position:relative; font-size:11px; font-weight:normal; float:right; color:#0000aa;\" onMouseOver=\"style.cursor = 'pointer';\" onclick=\"javascript:onCloseComments('"+gVerseDivPretext+"');\">" + "Close" + "</span>";
				var bottomLine2 = "<div style=\"color:#cc0000; padding:.5em;\">" + "</div>";
				commentsDiv.innerHTML += "<div style=\"position:relative; padding:.5em; border-top:solid 1px #ffffff;\">" + bottomLine2 + "</div>";
			}
			
			//var closeStr = "<div style=\"position:relative; font-size:9px; font-weight:normal; float:right; width:50px; color:#0000aa;\" onMouseOver=\"style.cursor = 'pointer';\" onclick=\"javascript:onCloseComments('"+gVerseDivPretext+"');\">" + "Close" + "</div>";
			//commentsDiv.innerHTML += "<div style=\"position:relative; padding:.5em; border-top:solid 1px #ffffff; color:#0000aa; font-size:9px; font-weight:normal;\">" + closeStr + "</div>";
		}
		else
		{
			if (commentsDiv)
				commentsDiv.innerHTML = "<div style=\"position:relative; padding:.5em; font-size:11px; font-weight:normal; color:#444444;\">" + "Loading..." + "</div>";
		}
	};
	gHttpGetComments.send(null);
} //getComments()
