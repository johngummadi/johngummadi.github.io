// presentbible.js - Version: v.1.4.9
$gVersionStr = "Cloud Study Bible v.0.9 beta";

var FROM_SEARCH = 1;
var FROM_BUZZ = 2;

$gcontentTabs = null;

$gBookChapterCountArray = new Array(67);

$gbooksDivID="";
$gdateDiv="";
gtimeDiv="";
$gchaptersDivID="";

$gversesDivID="";
$gversesDivIDASV="";

$gcontentHeaderDivID="";
$gcontentHeaderDivIDASV="";

$gfooterDivID="";
$gloginButtonDivID="";
$gregistrationLineDivID="";
$gloginBoxDiv="";

// Scroll positions
var gTabScrollPosKjvY=0;
var gTabScrollPosAsvY=0;
var gTabScrollPosSearchY=0;

// social
$gPlusOneBtnDivID="";
$gPlusOnePageBtnDivID="";
$gFacebookBtnDivID="";
$gFacebookPageBtnDivID="";
$gDiggDivID="";
$gDiggBtnDivID="";
$gStumbleuponBtnDivID="";
$gGoogleBtnDivID="";
$gTweetBtnDivID="";
$gTwitterBtnDivID="";
$gSocialButtonsLoaded=false;

$gMaximizeBtnDiv="";
$ghighlightVerseBtnID="";


var gClickedOn = 0; //1=login, 2=guestbook, 3=socialbox, 4=chapterbox, 5=historybox

// Digg is no longer working. So disabling it!
var gEnableDigg = false;

// HTTP request objects
$gxmlhttpBooks = null;
$gxmlhttpBookChapters = null;
$gxmlhttpVerses = null;
$gxmlhttpSearch = null;
$gxmlhttpLogin = null;
$gcurrentBookName = "";
$gcurrentBookID = 0;
$gcurrentChapterNumber = 0;
$gcurrentVerseNumber = 0;
$gprevVerseClicked = "";

$unselectedVerseColor = "#00000";
$selectedVerseColor = "black";
$mouseOnVerseBkColor = "#E0F0D0";
$selectedVerseBkColor = "#eeeeee";

$gPrevStyle=0;
$gPrevBackColor="#ffffff";
$gPrevBackColorClicked="#ffffff";

$g_theme = "blue";

$gChaptersBoxVisible=0;
$gGuestbookVisible=0;
$gSocialBoxVisible=0;
$gloginBoxVisible=0;
$gHistoryboxVisible=0;

$gIsMaximized = 0;

$gSocialButtonNormal = null;

$gBackButtonNormal = null;
$gBackButtonPressed = null;
$gForwardButtonNormal = null;
$gForwardButtonPressed = null;
$gHistoryButtonNormal = null;

$gmaxButton = null;
$gmaxButtonDown = null;
$gminButton = null;
$gminButtonDown = null;
//$gguestBookButton = null;
//$gguestBookButtonDown = null;
$gcloseBtn = null;
$gcloseBtnDown = null;
$gArrowBtnLeft = null;
$gArrowBtnTop = null;
$gFacebookLogoImg = null;
$gTwitterLogoSmallImg = null;
$gGooglePlusLogoImg = null;

$gHighLightVerseOnMouseOver = true;

var gBrowsingHistory = null;

var g_regPanel = null;

var gFirstTimeLoading = true; //Make this false from loadVerses()
function BrowsingState()
{
	this.BookName;
	this.BookID;
	this.ChapterNumber;
	this.VerseNumber;
} //BrowsingState()

function BrowsingHistory()
{
	this.History = new Array();
	this.CurrentIndex = -1;
	
	this.Initialize = function(browsingHistoryObject)
	{
		if (browsingHistoryObject==null)
			return;
		if (browsingHistoryObject.CurrentIndex!=null && browsingHistoryObject.CurrentIndex!=undefined)
			this.CurrentIndex = browsingHistoryObject.CurrentIndex;
		
		if (browsingHistoryObject.History!=null && browsingHistoryObject.History!=undefined)
			this.History = browsingHistoryObject.History;
	} //Initialize()
	
	this.SetCurrentBrowsingStateIndex = function(index)
	{
		if (this.History==null || this.History.length<=0)
			return false;
		
		if (index<0 || index>=this.History.length)
			return false;
			
		this.CurrentIndex = parseInt(index);
	} //SetCurrentBrowsingStateIndex()
	
	this.Add = function(bookName, bookID, chapterNumber, verseNumber, setCurrent)
	{
		var browsingState = new BrowsingState();
		browsingState.BookName = bookName;
		browsingState.BookID = bookID;
		browsingState.ChapterNumber = chapterNumber;
		browsingState.VerseNumber = verseNumber;
		this.History.push(browsingState);
		
		if (setCurrent == true)
			this.CurrentIndex = parseInt(this.History.length) - 1;
	} //Add()
	
	this.DeleteHistoryAfterCurrent = function()
	{
		if (this.History==null || this.History.length<=0 || this.CurrentIndex<0)
			return false;
		var indexFrom = parseInt(this.CurrentIndex) + 1;
		this.History.splice(indexFrom, this.History.length-indexFrom); //remove history on the right
	}
	
	this.GetPrevious = function(setCurrent)
	{
		var index = parseInt(this.CurrentIndex) - 1;
		return this.GetBrowsingStateByIndex(index, setCurrent);
	}
	
	this.GetNext = function(setCurrent)
	{
		var index = parseInt(this.CurrentIndex) + 1;
		return this.GetBrowsingStateByIndex(index, setCurrent);
	}
	
	this.GetCurrent = function()
	{
		return this.GetBrowsingStateByIndex(parseInt(this.CurrentIndex), setCurrent);
	}
	
	this.GetBrowsingStateByIndex = function(index, setCurrent)
	{
		if (this.History==null || this.History.length<=0)
			return null;
		
		if (index<0 || index>=this.History.length)
			return null;
		
		if (setCurrent)
			this.CurrentIndex = parseInt(index);
		
		return this.History[index];
	} //GetBrowsingStateByIndex()
} //BrowsingHistory()

function onHistoryBack()
{
	var state = gBrowsingHistory.GetPrevious(true);
	if (state!=null)
	{
		goToVerseInHistory(state);
	}
}

function onHistoryForward()
{
	var state = gBrowsingHistory.GetNext(true);
	if (state!=null)
	{
		goToVerseInHistory(state);
	}
}

// Call this when browing from history
function goToVerseInHistory(browsingState) 
{
	loadBookChapterNumbers(browsingState.BookID, browsingState.BookName, 
		1, browsingState.ChapterNumber, browsingState.VerseNumber, 0, false);
	scrollToBook(browsingState.BookID);
    scrollToChapter(browsingState.ChapterNumber);
	scrollToVerse(browsingState.VerseNumber);
} //goToVerseInHistory()


function onHistoryView()
{
	PreventDefaultAction(window.event);
	ShowHistory();
}

function ShowHistory()
{
	gClickedOn = 5; //1=login, 2=guestbook, 3=socialbox, 4=chapterbox, 5=historybox
	var historyBox = document.getElementById("HistoryBox");
	var historyContent = document.getElementById("HistoryContent");
	if (historyBox==null || historyContent==null)
		return;
	historyContent.innerHTML = "No history to display";
	historyContent.style.autoScrollY = true;
	historyContent.style.overflowY = "auto";
	historyContent.style.overflowX = "hidden";
	if (historyBox.style.visibility == "hidden")
	{
		if (gBrowsingHistory.History.length>0)
			historyContent.innerHTML = "";
		for (var i=gBrowsingHistory.History.length-1; i>=0; i--)
		{
			var browsingState = gBrowsingHistory.GetBrowsingStateByIndex(i, false);
			if (browsingState==null)
				continue;
			var elemDiv = document.createElement('div');
			var elemDivID = browsingState.BookName + "_" + browsingState.BookID + "_" + browsingState.ChapterNumber + "_" + browsingState.VerseNumber;
			elemDiv.setAttribute('id', elemDivID);
			elemDiv.style.position = "relative";
			elemDiv.style.width = "100%";
			elemDiv.style.height = "20px";
			elemDiv.style.padding = "3px";
			if (i>0)
				elemDiv.style.borderBottom = "solid 1px #cccccc";
			elemDiv.style.fontSize = "12px";
			elemDiv.style.color = "#333333";
			if (i==gBrowsingHistory.CurrentIndex)
				elemDiv.style.fontWeight = "bold";
			else
				elemDiv.style.fontWeight = "normal";
			elemDiv.innerHTML = browsingState.BookName + " " + browsingState.ChapterNumber + ":" + browsingState.VerseNumber;
			elemDiv.setAttribute("HistoryIndex", i);
			elemDiv.style.cursor="pointer";
			elemDiv.onclick = (function() 
			{
				var selectedIndex = this.getAttribute("HistoryIndex");
				var selectedBrowseItem = null;
				if (selectedIndex!=null)
					selectedBrowseItem = gBrowsingHistory.GetBrowsingStateByIndex(selectedIndex, true);
				if (selectedBrowseItem!=null)
				{
					//loadVerses(selectedBrowseItem.BookName, selectedBrowseItem.BookID, selectedBrowseItem.ChapterNumber, 1, selectedBrowseItem.VerseNumber, 0, false);
					goToVerseInHistory(selectedBrowseItem);
				}
				ShowHistory(); //this should hide the box
			});
			elemDiv.onmouseover = (function() 
			{
				this.style.backgroundColor = "#eeeeee";
				//this.style.color = "#999999";
			});
			elemDiv.onmouseout = (function() 
			{
				this.style.backgroundColor = "transparent";
				//this.style.color = "#333333";
			});
			historyContent.appendChild(elemDiv);
		}
		historyBox.style.visibility = "visible";
		$gHistoryboxVisible = 1;
		if (gBrowsingHistory.History.length>10)
			historyContent.style.height = "250px";
	}
	else
	{
		historyBox.style.visibility = "hidden";
		$gHistoryboxVisible = 0;
	}
}


function toggleShowComment(divID)
{
	var titleDivID = divID + "_title";
	var contentDivID = divID + "_content";
	var divElement = document.getElementById(divID);
	var titleDiv = document.getElementById(titleDivID);
	var contentDiv = document.getElementById(contentDivID);
	
	if (divElement != null)
	{
		if (divElement.style.visibility == "visible")
		{
			divElement.style.visibility = "hidden";
			titleDiv.style.visibility = "hidden";
			contentDiv.style.visibility = "hidden";
		}
		else
		{
			divElement.style.visibility = "visible";
			titleDiv.style.visibility = "visible";
			contentDiv.style.visibility = "visible";
		}
	}
}

var gCurrentAudioVerse = 1;
var gReadingTimer = null;

function PlayEnded()
{
	alert("Ended");
}

function ReadVerses()
{
	if (gReadingTimer != null)
		clearInterval(gReadingTimer);
	var audioDiv = document.getElementById("audiodiv");
	var verseDiv = null;
	do
	{
		verseDiv = document.getElementById("kjvVerseId" + gCurrentAudioVerse);
		gCurrentAudioVerse++;
		var text = "Sorry, failed to get the verse. Please try again.";
		if (verseDiv)
		{
			text = verseDiv.getAttribute('verse');
			audioDiv.innerHTML = "<embed src=\"http://translate.google.com/translate_tts?tl=en&q=" + text + "\" autostart=\"true\" ended=\"javascript:PlayEnded();\" loop=\"false\" width=\"2\" height=\"0\">";
			//var srcText = "http://translate.google.com/translate_tts?tl=en&q=" + text;
			//audioDiv.innerHTML = "<embed ended=\"javascript:PlayEnded();\"> <source src=\"" + srcText + "\"></embed>";
			//audioDiv.innerHTML = "<audio onended=\"javascript:PlayEnded();\" src=\"http://translate.google.com/translate_tts?tl=en&q=" + text + "\" autostart=\"true\" loop=\"false\" width=\"2\" height=\"0\">";
			verseDiv = document.getElementById("kjvVerseId" + gCurrentAudioVerse);
		}
		else
		{
			//audioDiv.innerHTML = "<embed src=\"http://translate.google.com/translate_tts?tl=en&q=" + text + "\" autostart=\"true\" loop=\"true\" width=\"2\" height=\"0\">";
		}
	} while (0);
}

function OnPlayPause(divID)
{
	// The following code needs to be added to index.html for this code to execute.
	/*
	<span style="padding-left:.5em;">
		<img id="PlayPauseDiv" src="images\play.png" mode="paused" width="25" Height="20" onclick="javascript:OnPlayPause('PlayPauseDiv');"/>
		<span id="audiodiv" style="visibility:hidden"> </span>
	</span>
	*/
	var div = document.getElementById(divID);
	var audioDiv = document.getElementById("audiodiv");
	if (div && audioDiv)
	{
		//<img id="PlayPauseDiv" src=".\images\play.png" width="25" Height="20" onclick="javascript:OnPlayPause('PlayPauseDiv');"/>
		var mode = div.getAttribute('mode');
		if (mode == "paused")
		{
			div.src = "images/pause.png";
			div.setAttribute('mode', "playing");
			ReadVerses();
			// Keep reading
			//gReadingTimer = setInterval('ReadVerses()', 500);
			
			/*
			// TODO: Distinguish between KJV and ASV
			var verseDiv = document.getElementById("kjvVerseId" + gCurrentAudioVerse);
			var text = "Sorry, failed to get the verse. Please try again.";
			if (verseDiv)
			{
				text = verseDiv.getAttribute('verse');
			}
			//audioDiv.innerHTML = "<embed src=\"http://translate.google.com/translate_tts?tl=en&q=My%20name%20is%20JOhn\" autostart=\"true\" loop=\"true\" width=\"2\" height=\"0\">";
			audioDiv.innerHTML = "<embed src=\"http://translate.google.com/translate_tts?tl=en&q=" + text + "\" autostart=\"true\" loop=\"true\" width=\"2\" height=\"0\">";
			*/
		}
		else //"playing"
		{
			div.src = "images/play.png";
			div.setAttribute('mode', "paused");
			audioDiv.innerHTML = "";
			// Stop the loop
			if (gReadingTimer != null)
			{
				gReadingTimer = null;
			}
		}
	}
}

function createCommentBox(divID, parentDiv, left, top, width, height, show)
{
	var commentDiv;

	commentDiv = document.getElementById(divID);
	
	if (!commentDiv)
	{	
		commentDiv = document.createElement('div');
		commentDiv.setAttribute('id', divID);
		
		var titleDivID = divID + "_title";
		var contentDivID = divID + "_content";
		
		if (left>0)
			commentDiv.style.left = left;
		
		if (top>0)
			commentDiv.style.top = top;
		
		if (width>0)
			commentDiv.style.width = width + "px";
		
		if (height>0)
			commentDiv.style.height = height + "px";
		
		commentDiv.style.position = "relative";
		
		var titleDiv = document.createElement('div');
		titleDiv.setAttribute('id', titleDivID);
		titleDiv.setAttribute('class', "commenttitle");
		titleDiv.innerHTML = "Comment";
		
		var contentDiv = document.createElement('div');
		contentDiv.setAttribute('id', contentDivID);
		contentDiv.setAttribute('class', "commentarea");
		contentDiv.innerHTML = "Please enter your comments here";
		
		
		commentDiv.appendChild(titleDiv);
		commentDiv.appendChild(contentDiv);
		
		document.getElementById(parentDiv).appendChild(commentDiv);;
	}
} //createCommentBox()

function ParseJSONBuzz(buzzJSONText)
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
		  html += "<div style=\"background-color:#DFEFFF; padding:.5em; font-family:courier; font-size:12px; color:#d50000; border-bottom:solid 2px #ffffff;\" id=\"ShowVerseComments_" + verse.VerseID + "\" CommentCount=\"" + verse.Comments.length + "\" onMouseOver=\"this.style.cursor='pointer';\" onMouseOut=\"this.style.cursor='default';\" onclick=\"javascript:ShowBuzzComments('HiddenCommentsID_" + verse.VerseID + "', 'ShowVerseComments_" + verse.VerseID + "');\">View all " + verse.Comments.length + " comments</div>";
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
		
		// TODO: This is almost done, finish this!
		// Add comment section right here for each commented verse
		var commentContainer = "";
		if (isLoggedIn())
		{
			var userFullName = getFullName();
			var commentboxID = "BuzzcommentBox_" + verse.VerseID;
            var verseAttribsStr = " bookid=\""+ verse.BookID + "\"";
            verseAttribsStr += " bookname=\"" + verse.BookName + "\"";
            verseAttribsStr += " chapterid=\"" + verse.ChapterID + "\"";
            verseAttribsStr += " chapternumber=\"" + verse.ChapterNumber + "\"";
            verseAttribsStr += " verseid=\"" + verse.VerseID + "\"";
			commentContainer = "<div onclick=\"javascript:CloseBuzzCommentBox('"+commentboxID+"');\" style = \"position:relative; background-color:#DFEFFF; color:#d50000; padding:.5em; font-family:courier; font-size:14px; color:#555555; padding:5px; \">" + 
			
				"<div style=\"position:relative; margin-top:3px; \"><b>" + userFullName + ":</b> </div>" + 
				
				"<div id=\"" + commentboxID + "\"" + verseAttribsStr + "onclick=\"javascript:ShowBuzzCommentBox('"+commentboxID+"');\" onMouseOver=\"this.style.cursor='text';\" style = \"position:relative; padding:5px; left:0px; right:10px; background-color:#ffffff;\"> Add a comment... </div>" + 
				
			"</div>";
		}
		else
		{
			commentContainer = "<div onMouseOver=\"this.style.cursor='text';\" style = \"background-color:#dddddd; color:#d50000; padding:.5em; font-family:courier; font-size:14px; color:#555555; border:solid 8px #DFEFFF;\">Please login to comment</div>";
		}
		html += commentContainer;
		
		html += "</div>";
	} // for - outer
	return html;
} //ParseJSONBuzz()


function CloseBuzzCommentBox(commentboxID)
{
	return;
	var commentboxDiv = document.getElementById(commentboxID);
	var commentboxTextAreaDiv = document.getElementById(commentboxID + "_TextArea");
	if (commentboxDiv && commentboxTextAreaDiv)
	{
		if (commentboxTextAreaDiv.value == "")
			commentboxDiv.innerHTML = "";
	}
} //CloseBuzzCommentBox()

function PostBuzzComment(boxid)
{
    PreventDefaultAction(window.event);
    var commentText = "";
    var boxTextDivId = boxid+"_TextArea";
    var boxTextDiv = document.getElementById(boxTextDivId);
    if (boxTextDiv)
    {
        commentText = boxTextDiv.value;
    }
    
    var boxDiv = document.getElementById(boxid);
    if (boxDiv)
    {
        if (commentText!="")
        {
            boxDiv.innerHTML = "Please wait…";
            var user = GetSavedUserName();
            var pwd = GetSavedPassword();
            var bookID = boxDiv.getAttribute("bookid");
            var chapterID = boxDiv.getAttribute("chapterid");
            var verseID = boxDiv.getAttribute("verseid");
            doPostComment(user, pwd, bookID, chapterID, verseID, commentText, 
                onPostBuzzCommentSuccess, onPostBuzzCommentFailed, "Kjv", verseID);
        }
        else
        {
            boxDiv.innerHTML = "Add a comment... ";
            boxDiv.setAttribute("onclick", "javascript:ShowBuzzCommentBox('"+boxid+"');");
        }
    }
} //PostBuzzComment()

function onPostBuzzCommentSuccess(msg, bookID, chapterID, verseID, verseDivPretext, divID)
{
    var boxDiv = document.getElementById(divID);
    if (boxDiv)
    {
        boxDiv.innerHTML = "Add a comment... ";
        boxDiv.setAttribute("onclick", "javascript:ShowBuzzCommentBox('"+boxid+"');");
    }
    var contentDiv = g_updatesPanel.GetContentDiv();
    if (contentDiv)
	{
		loadUpdates(contentDiv);
	}
} //onPostBuzzCommentSuccess

function onPostBuzzCommentFailed(message)
{
    // TODO: This is wrong, If this fails, we need to show some error
    var contentDiv = g_updatesPanel.GetContentDiv();
    if (contentDiv)
	{
		loadUpdates(contentDiv);
	}
}


function ShowBuzzCommentBox(commentboxID)
{
	var commentboxDiv = document.getElementById(commentboxID);
	if (commentboxDiv)
	{
		commentboxDiv.innerHTML = "";
		
		// TextArea
		var idTextArea = commentboxID + "_TextArea";
		var textareaDiv = document.createElement('textarea');
		textareaDiv.setAttribute('id', idTextArea);
		textareaDiv.style.width = "99%";
		textareaDiv.style.height = "99%";		
		commentboxDiv.appendChild(textareaDiv);
		textareaDiv.focus();
		
		
		// ButtonArea
		var idBtnArea = commentboxID + "_ButtonArea";
		var btnAreaDiv = document.createElement('div');
		btnAreaDiv.setAttribute('id', idBtnArea);
		btnAreaDiv.style.position = "relative";
		btnAreaDiv.style.backgroundColor = "#DFDFDF"; 
		btnAreaDiv.style.width = "100px";
		btnAreaDiv.style.float = "right bottom";
		
		
		// PostButton
		var idPostBtn = commentboxID + "_PostButton";
		var postBtnDiv = document.createElement('input');
		postBtnDiv.setAttribute("id", idPostBtn);
		postBtnDiv.setAttribute("class", "button");
		postBtnDiv.setAttribute("value", "Post");
		postBtnDiv.setAttribute("type", "submit");
		postBtnDiv.setAttribute("onclick", "javascript:PostBuzzComment('" + commentboxID + "');");
		//postBtnDiv.style.position = "absolute";
		postBtnDiv.style.width = "100px";
		postBtnDiv.style.right = "10px";
		btnAreaDiv.style.float = "right bottom";
		btnAreaDiv.style.clear = "both";
		
		commentboxDiv.appendChild(postBtnDiv);
		//commentboxDiv.appendChild(btnAreaDiv);
		
		//commentboxDiv.innerHTML ="<textarea id=" + id + "class=\"commentstextarea\"></textarea>";
		// NOTE: Onclick will be DISABLED once it is clicked!
		commentboxDiv.setAttribute("onclick", "");
	}
} //ShowBuzzCommentBox()

var gxmlhttpUpdates=null;
var g_updatesPanel=null;
function loadUpdates(contentDiv)
{
	var showbuzzCheckBoxDiv = document.getElementById("ShowBuzzOnStartCheckBox");
	if (showbuzzCheckBoxDiv)
	{
		var buzzOnStart = GetBuzzOnStartup();
		if (buzzOnStart)
			showbuzzCheckBoxDiv.innerHTML = "<input type=\"checkbox\" name=\"BuzzOnStartupOption\" onclick=\"javascript:SetBuzzOnStartup(this.checked);\" value=\"Show this Buzz window on start\" checked\> Show this Buzz window on start ";
		else
			showbuzzCheckBoxDiv.innerHTML = "<input type=\"checkbox\" name=\"BuzzOnStartupOption\" onclick=\"javascript:SetBuzzOnStartup(this.checked);\" value=\"Show this Buzz window on start\"\> Show this Buzz window on start ";
	}
	
	if (contentDiv)
	{
		//contentDiv.innerHTML = "Loading...";
		//$updatesUrlStr = "./biblejs/getupdates.php?u=" + userName;
		$updatesUrlStr = "./biblejs/getupdates.php?t=json";
		if (window.XMLHttpRequest)
		{
			// code for IE7+, Firefox, Chrome, Opera, Safari
			gxmlhttpUpdates = new XMLHttpRequest();
		}
		else
		{
			// code for IE6, IE5
			gxmlhttpUpdates = new ActiveXObject("Microsoft.XMLHTTP");
		}
		gxmlhttpUpdates.open("GET",$updatesUrlStr,true);
		gxmlhttpUpdates.onreadystatechange=(function stateChanged() 
		{ 
	
			if (gxmlhttpUpdates.readyState==4) 
			{
				var showBuzzOnStartDivStr = "";
				if (buzzOnStart)
					showBuzzOnStartDivStr = "<div id=\"ShowBuzzOnStartCheckBox\" style=\"color:red; font-weight:bold; margin:1em;\"> <input type=\"checkbox\" name=\"BuzzOnStartupOption\" onclick=\"javascript:SetBuzzOnStartup(this.checked);\" value=\"Show this Buzz window on start\" checked\> Show this Buzz window on start </div>";
				else
					showBuzzOnStartDivStr = "<div id=\"ShowBuzzOnStartCheckBox\" style=\"color:red; font-weight:bold; margin:1em;\"> <input type=\"checkbox\" name=\"BuzzOnStartupOption\" onclick=\"javascript:SetBuzzOnStartup(this.checked);\" value=\"Show this Buzz window on start\"\> Show this Buzz window on start </div>";
			
				//contentDiv.innerHTML = gxmlhttpUpdates.responseText;
				var buzzContent = ParseJSONBuzz(gxmlhttpUpdates.responseText);
				g_updatesPanel.contentHTML = showBuzzOnStartDivStr + buzzContent;
				contentDiv.style.autoScroll = "true";
				contentDiv.style.overflowY = "auto";
				g_updatesPanel.titleText = "Updates";
				g_updatesPanel.Refresh();
			}
		});
		gxmlhttpUpdates.send(null);
	}
} //loadUpdates()

function AdjustUpdatesPanel()
{
	if (!g_updatesPanel)
		return;
	var w = documentWidth()*85/100;
	var h = documentHeight() * 85/100;
	if (isIE())
		h += 20;
	else if (isFirefox())
		h += 20;
	var l = Math.round((documentWidth()/2) - (w/2));
	var t = Math.round((documentHeight()/2) - (h/2));
	
	g_updatesPanel.panelLeft = l;
	g_updatesPanel.panelTop = t;
	g_updatesPanel.panelWidth = w;
	g_updatesPanel.panelHeight = h;
	
	g_updatesPanel.Refresh();
}

function onUpdatesClick(divID)
{
	var w = documentWidth()*85/100;
	var h = documentHeight() * 85/100;
	if (isIE())
		h += 20;
	else if (isFirefox())
		h += 20;
	var l = Math.round((documentWidth()/2) - (w/2));
	var t = Math.round((documentHeight()/2) - (h/2));
		
	var updatesImage = document.getElementById(divID);
	if (updatesImage)
	{
		/*
		updatesImage.setAttribute("class", "ui-corner-all");
		updatesImage.style.borderWidth = "0px";
		updatesImage.style.borderWidth = "7px";
		updatesImage.style.borderStyle = "solid";
		updatesImage.style.borderColor = "#777777";
		*/
		if (!g_updatesPanel)
		{
			g_updatesPanel = new CsbPanel("UpdatesPanel", true, true, "Updates", "Updating...", l, t, w, h);
			var updatesPanelDiv = g_updatesPanel.GetDiv();		
			//document.body.appendChild(updatesPanelDiv);
			g_updatesPanel.panelBorderWidth = 8;
			g_updatesPanel.AddCloseButton();
			g_updatesPanel.titleText = "Loading latest updates...";
			g_updatesPanel.onHide = onCloseUpdates;//(divID);
			g_updatesPanel.onDestroy = onCloseUpdates;
			g_updatesPanel.Refresh();
			var contentDiv = g_updatesPanel.GetContentDiv();
			if (contentDiv)
			{
				// do this first time only
				contentDiv.innerHTML = "Loading...";
				loadUpdates(contentDiv);
			}
		}
		else
		{
			g_updatesPanel.panelLeft = l;
			g_updatesPanel.panelTop = t;
			g_updatesPanel.panelWidth = w;
			g_updatesPanel.panelHeight = h;
			g_updatesPanel.titleText = "Loading latest updates...";
			g_updatesPanel.Refresh();
			g_updatesPanel.Show();
			g_updatesPanel.Refresh();
			var contentDiv = g_updatesPanel.GetContentDiv();
			if (contentDiv)
			{
				loadUpdates(contentDiv);
			}
		}
	}
}

function onCloseUpdates()
{
	return;
	var updatesImage = document.getElementById("updatesImage");
	if (updatesImage)
	{
		updatesImage.style.borderStyle = "none";
		updatesImage.style.borderWidth = "0px";
		updatesImage.style.borderColor = "transparent";
		
		//updatesImage.style.borderStyle = "solid";
		//updatesImage.style.borderWidth = "1px";
	}
	//alert("close");
} //onCloseUpdates()

function onUpdatesMouseOver(divID)
{
	var updatesImage = document.getElementById(divID);
	if (updatesImage)
	{
		updatesImage.style.cursor = "pointer";
		updatesImage.setAttribute("class", "ui-corner-all");
		if (isIE())
		{
			updatesImage.style.backgroundColor = "#000000";
			updatesImage.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=25)";
		}
		else
		{
			updatesImage.style.backgroundColor = "rgba(215, 215, 215, .25)";
		}
		updatesImage.style.borderColor="green";
	}
}

function onUpdatesMouseOut(divID)
{
	var updatesImage = document.getElementById(divID);
	if (updatesImage)
	{
		updatesImage.style.cursor = "default";
		if (isIE())
		{
			updatesImage.style.backgroundColor = "transparent";
			updatesImage.style.filter = "";
		}
		else
		{
			updatesImage.style.backgroundColor = "transparent";
		}
		updatesImage.style.borderColor="#86B8F4";
	}
}

function initializeTheme() 
{
	//document.getElementById("headerImageDiv").innerHTML = "<img src=\"themes/" + $g_theme + "/CloudBible_Transparent.png\" width=75;/>";
	document.getElementById("logoImageDiv").innerHTML = "<img src=\"themes/" + $g_theme + "/logo.png?version='1.1'\"/>";
	document.getElementById("updatesImageDiv").innerHTML = "<img id=\"updatesImage\" class=\"ui-corner-all\" style=\"border:solid 2 #86B8F4;\" src=\"images/membersbuzz.png?1222259157.416\" title=\"Click here to see the latest buzz!\" height=40 width=94 onMouseOut=\"javascript:onUpdatesMouseOut('updatesImage');\" onMouseOver=\"javascript:onUpdatesMouseOver('updatesImage');\" />";
	//document.getElementById("updatesImage").style.border = "solid 2 #86B8F4";
	document.getElementById("updatesImage").style.borderColor="#86B8F4";
	document.getElementById("updatesImage").style.borderSize="2";
	document.getElementById("updatesImage").style.borderStyle = "solid";
	
	document.getElementById("booksHeader").style.backgroundColor = "#86b8f4";
	document.getElementById("booksHeader").style.backgroundRepeat = "repeat";
	document.getElementById("chaptersHeader").style.backgroundColor = "#86b8f4";
	document.getElementById("chaptersHeader").style.backgroundRepeat = "repeat";
	
	
	//document.getElementById("versesHeaderBar").style.backgroundImage = "url('themes/" + $g_theme + "/title_background.jpg')";
	//document.getElementById("versesHeaderBar").style.backgroundRepeat = "repeat";

	document.getElementById("header").style.backgroundImage = "url('themes/" + $g_theme + "/dashboard_background.jpg')";

	document.getElementById("header").style.backgroundRepeat = "repeat";
	//document.getElementById("footer").style.height = "50px";

	

	document.getElementById("footer").style.backgroundImage = "url('themes/" + $g_theme + "/dashboard_background.jpg')";

	document.getElementById("footer").style.backgroundRepeat = "repeat";

	//document.getElementById("footer").style.height = "50px";

}

function onClickCloseBtn(divID)
{
	var guestbookDiv = document.getElementById("guestbookDiv");
	if (guestbookDiv)
	{
		onGuestbookClick("guestbookBtn");
	}
} //onClickCloseBtn()

function IsSocialBoxVisible()
{
	var socialBoxDiv = document.getElementById("SocialBox");
	if (socialBoxDiv.style.visibility == "hidden")
		return false;
	else
		return true;
} //IsSocialBoxVisible()

function onSocialBtnClick(socialBtnID, socialBtnArrowID)
{
	var socialBoxHeight = 190;
	if (gEnableDigg)
		socialBoxHeight = 226;
	gClickedOn = 3; //1=login, 2=guestbook, 3=socialbox, 4=chapterbox, 5=historybox
	var socialBtn = document.getElementById(socialBtnID);
	var socialBtnArrow = document.getElementById(socialBtnArrowID);
	var socialBoxDiv = document.getElementById("SocialBox");
	if (socialBtn && socialBoxDiv && socialBtnArrow)
	{		
		if (IsSocialBoxVisible() == false)
		{
			// Animation complete.
			socialBoxDiv.style.top = null;
			if (isIE())
				socialBoxDiv.style.right = "46px";
			else
				socialBoxDiv.style.right = "45px";
			socialBoxDiv.style.bottom = "31px";
			socialBoxDiv.style.width = "220px";
			socialBoxDiv.style.height = "0px";
			socialBoxDiv.style.borderStyle = "solid";
			socialBoxDiv.style.borderWidth = "6px";
			socialBoxDiv.style.borderColor = "#27507A";
			socialBoxDiv.style.visibility = "visible";
			socialBoxDiv.style.zIndex = "1";
			socialBtn.setAttribute("class", "poppedupbutton_border poppedupbutton");
			// Animate
			$('#SocialBox').animate({
			    opacity: 1,
			    height: '+=50',
			    height: socialBoxHeight+"px"
			  }, socialBoxHeight, function() 
						{
							$gSocialBoxVisible = 1;
							socialBoxDiv.style.height = socialBoxHeight + "px";
							socialBtnArrow.innerHTML = "&nbsp; &#9660;";
							loadSocialButtons();
						});
		}
		else
		{
			// Animate
			$('#SocialBox').animate({
				opacity: 1,
				height: '-=100',
				height: 'hide'
				}, socialBoxHeight, function() {
					// Animation complete.
					$gSocialBoxVisible = 0;
					
					var socialBoxDiv2 = document.getElementById("SocialBox");
					socialBoxDiv2.style.visibility = "hidden";
					socialBoxDiv2.style.zIndex = "0";
					socialBtn.style.zIndex = "0";
					socialBtn.setAttribute("class", "popupbutton");
					socialBtnArrow.innerHTML = "&nbsp; &#9650;";
					//socialBtn.src = $gSocialButtonNormal.src;
				});
			
		}
	}
}

function mouseDownCloseBtn(divID)
{
	var btndiv = document.getElementById(divID);
	if (btndiv)
	{
		btndiv.src = $gcloseBtnDown.src;
	}
} //mouseDownCloseBtn()

function mouseDownCloseBtn(divID)
{
	var btndiv = document.getElementById(divID);
	if (btndiv)
	{
		btndiv.src = $gcloseBtnDown.src;
	}
} //mouseDownCloseBtn()

function mouseOutCloseBtn(divID)
{
	var btndiv = document.getElementById(divID);
	if (btndiv)
	{
		btndiv.src = $gcloseBtn.src;
	}
} //mouseOutCloseBtn()


function mouseUpCloseBtn(divID)
{
	var btndiv = document.getElementById(divID);
	if (btndiv)
	{
		btndiv.src = $gcloseBtn.src;
	}
} //mouseUpCloseBtn()


function onGuestbookClick(divID)
{
	gClickedOn = 2; //1=login, 2=guestbook, 3=socialbox, 4=chapterbox, 5=historybox
	var btndiv = document.getElementById(divID);
	var guestbookDiv = document.getElementById("guestbookDiv");
	
	if (!guestbookDiv)
		return;
		
	// Create for the first time
	if (guestbookDiv.getAttribute('initialized') != "true")
	{
		initGuestBookBox();
		guestbookDiv = document.getElementById("guestbookDiv");
	}
	
	
	
	//if (guestbookDiv)
	if (guestbookDiv.style.display != "none") //i.e., if the guestbook is visible
	{
		var guestbookBtnDiv = document.getElementById(divID);
		
		// Animate
		$('#guestbookDiv').animate({
		    opacity: 1,
		    height: '-=50px',
		    height: "hide"
		  }, 200, function()
					{
						$gGuestbookVisible=0;
						// Make sure we still have this div
						// For some reason, by the time this is called
						//	by jquery, the guestbookDiv is killed already.
						// This causes exception and a huge stack leak
						guestbookDiv = document.getElementById("guestbookDiv");
						if (guestbookDiv)
						{
							guestbookDiv.style.display = "none"; //make invisible
							//document.body.removeChild(guestbookDiv);
						}
						var guestbookBtnDiv2 = document.getElementById(divID);
						if (guestbookBtnDiv2)
						{
							//guestbookBtnDiv2.removeAttribute("title");
							guestbookBtnDiv2.setAttribute("title", "Open guest book");
							guestbookBtnDiv2.innerHTML = "&#9650; Guest book";
							guestbookBtnDiv2.removeAttribute("class");
							guestbookBtnDiv2.setAttribute("class", "popupbutton");
						}
					});
	}
	else //if not visible
	{
		var guestbookBtnDiv = document.getElementById(divID);
		guestbookDiv.style.display = "block"; //make visible
		resizeGuestBookBox(); //adjust the textbox sizes according to the parent size
		
		if (guestbookBtnDiv)
		{
			guestbookBtnDiv.removeAttribute("class");
			guestbookBtnDiv.setAttribute("class", "poppedupbutton_border poppedupbutton");
		}
		
		// Animate
		var finalHeight = guestbookDiv.style.height;
		guestbookDiv.style.top = null;
		if (isIE())
			guestbookDiv.style.bottom = "31px";
		else if (isFirefox())
			guestbookDiv.style.bottom = "30px";
		else
			guestbookDiv.style.bottom = "32px";
		guestbookDiv.style.height = "10px";
		$('#guestbookDiv').animate({
			opacity: 1,
			height: '+=50',
			height: finalHeight
		  }, 200, function() 
					{
						$gGuestbookVisible=1;
						
						var guestbookBtnDiv2 = document.getElementById(divID);
						if (guestbookBtnDiv2)
						{
							guestbookBtnDiv2.removeAttribute("title");
							guestbookBtnDiv2.setAttribute("title", "Click here to close the guest book");
							guestbookBtnDiv2.innerHTML = "&#9660; Guest book";
							//guestbookBtnDiv2.removeAttribute("class");
							//guestbookBtnDiv2.setAttribute("class", "poppedupbutton_border poppedupbutton");
						}
					});
		LoadGuestComments("guestbookBoxContentDiv", "GuestbookTitleText");
	}
} //onGuestbookClick()

function resizeGuestBookBox()
{
	var guestbookDiv = document.getElementById("guestbookDiv");
	var guestbookBtnDiv = document.getElementById("guestbookBtn");
	var guestbookBoxContentDiv = document.getElementById("guestbookBoxContentDiv");
	var guestbookBoxEditorDiv = document.getElementById("guestbookBoxEditorDivId");
	var guestbookCommentTextDiv = document.getElementById("guestbookCommentText");
	if (guestbookCommentTextDiv && guestbookDiv && guestbookBtnDiv && guestbookBoxContentDiv && guestbookBoxEditorDiv)
	{
		var guestBookWidth = (document.documentElement.clientWidth*75/100) - (guestbookBtnDiv.style.width+guestbookBtnDiv.style.left+20);
		var guestBookHeight = (document.documentElement.clientHeight*75/100) - (guestbookBtnDiv.clientHeight+10);
		var guestBookTitleHeight = 25;
		var guestbookEditorHeight = 130;
		
		guestbookDiv.style.width = guestBookWidth + "px";
		guestbookDiv.style.height = (guestBookHeight+10) + "px";
		guestbookBoxContentDiv.style.height = (guestBookHeight - guestBookTitleHeight - guestbookEditorHeight - 14) + "px";
		if (isIE())
		{
			var w = document.all.guestbookBoxEditorDivId.offsetWidth;
			if (w<20)
				w=20;
			guestbookCommentTextDiv.style.width = (w-20) + "px";
		}
		else
		{
			guestbookCommentTextDiv.style.width = (guestbookBoxEditorDiv.offsetWidth-20) + "px";
		}
	}
} //resizeGuestBookBox()

// adjustGuestbookBotton: Adjust based on browser
function adjustGuestbookBotton()
{
	var guestbookBtn = document.getElementById("guestbookBtn");
	if (guestbookBtn)
	{
		if (isChrome() || isSafari())
		{
			guestbookBtn.style.top = "-1px";
		}
		else
		{
			guestbookBtn.style.top = "-3px";
		}
	}
} //adjustGuestbookBotton()

function initGuestBookBox()
{
	// height/width constants
	var guestBookWidth = 500;
	var guestBookHeight = 400;
	var guestBookTitleHeight = 25;
	var guestbookEditorHeight = 115;
	
	// Create outer guestbook div and attach it to the body
	var guestbookBoxDiv = document.getElementById('guestbookDiv');
	if (!guestbookBoxDiv)
		return;
	guestbookBoxDiv.setAttribute('initialized', "true");
	guestbookBoxDiv.style.visibility = "visible";
	var guestbookBtnDiv = document.getElementById("guestbookBtn");
	
	// Create guestbook title div
	var guestbookBoxTitleDiv = document.createElement('div');
	guestbookBoxTitleDiv.setAttribute('id', "guestbookTitle");
	guestbookBoxTitleDiv.setAttribute('class', "ui-widget-header ui-corner-all");
	
	// Create guestbook content div
	var guestbookBoxEditorDiv = document.createElement('div');
	guestbookBoxEditorDiv.setAttribute('id', "guestbookBoxEditorDivId");
	guestbookBoxEditorDiv.setAttribute('class', "ui-widget-header ui-corner-all");
	
	// Create guestbook content div
	var guestbookBoxContentDiv = document.createElement('div');
	guestbookBoxContentDiv.setAttribute('id', "guestbookBoxContentDiv");
	
	var guestbookBoxCloseBtnDiv = document.createElement('span');
	guestbookBoxCloseBtnDiv.setAttribute('id', "guestbookBoxCloseBtnDivID");
	
	if (guestbookBoxDiv && guestbookBtnDiv && guestbookBoxTitleDiv  && guestbookBoxContentDiv && guestbookBoxCloseBtnDiv)
	{
		guestBookWidth = (document.documentElement.clientWidth*75/100) - (guestbookBtnDiv.style.width+guestbookBtnDiv.style.left+20);
		guestBookHeight = (document.documentElement.clientHeight*75/100) - (guestbookBtnDiv.clientHeight+10);
	
		
		// Attach title and content divs to outer guestbook div
		guestbookBoxDiv.appendChild(guestbookBoxTitleDiv);
		guestbookBoxDiv.appendChild(guestbookBoxContentDiv);
		guestbookBoxDiv.appendChild(guestbookBoxEditorDiv);
		
		
		// Set outer div styles
		guestbookBoxDiv.style.position = "absolute";
		guestbookBoxDiv.style.zIndex = "1";
		guestbookBoxDiv.style.borderStyle = "solid";
		guestbookBoxDiv.style.borderWidth = "6px";
		guestbookBoxDiv.style.borderColor = "#27507A"; //"#1865ac";//"#27507a"; //"#6090f0"; //"#cccccc"; //"#3379ff"; //"#27507a";
		guestbookBoxDiv.style.backgroundColor = "#ffffff";
		guestbookBoxDiv.style.width = guestBookWidth + "px";
		guestbookBoxDiv.style.height = guestBookHeight + "px";
		if (isChrome() || isSafari())
		{
			//guestbookBoxDiv.style.bottom = (guestbookBtnDiv.offsetTop + 26) + "px";
			guestbookBoxDiv.style.left = (guestbookBtnDiv.offsetLeft + 6) + "px";
		}
		else if(isIE())
		{
			//guestbookBoxDiv.style.bottom = (guestbookBtnDiv.offsetTop + 20.5) + "px";
			guestbookBoxDiv.style.left = (guestbookBtnDiv.offsetLeft + 6) + "px";
		}
		else //firefox 
		{
			//guestbookBoxDiv.style.bottom = (guestbookBtnDiv.offsetTop + 100) + "px";
			guestbookBoxDiv.style.left = (guestbookBtnDiv.offsetLeft + 6) + "px";
		}		
		guestbookBoxDiv.style.paddingTop = "2px"; //remove after adding buttons and text boxes
		guestbookBoxDiv.style.paddingLeft = "2px"; //remove after adding buttons and text boxes
		guestbookBoxDiv.style.paddingRight = "2px"; //remove after adding buttons and text boxes
		guestbookBoxDiv.style.visibility = "hidden";
		
		// Set title styles
		guestbookBoxTitleDiv.style.position = "relative";
		guestbookBoxTitleDiv.style.paddingLeft = "7px";
		guestbookBoxTitleDiv.style.paddingRight = "3px";
		guestbookBoxTitleDiv.style.paddingTop = "1px";
		guestbookBoxTitleDiv.style.height = guestBookTitleHeight + "px";
		guestbookBoxTitleDiv.style.backgroundColor = "#86b8f4";
		guestbookBoxTitleDiv.style.float = "top";
		guestbookBoxTitleDiv.style.fontSize = "15px";
		guestbookBoxTitleDiv.style.color = "#ffffff";
		guestbookBoxTitleDiv.innerHTML = "<span id=\"GuestbookTitleText\"><b>Guest Book</b></span>";
		
		// Attach close btn div to title
		guestbookBoxTitleDiv.appendChild(guestbookBoxCloseBtnDiv);
		
		// Set close button on title
		guestbookBoxCloseBtnDiv.innerHTML = "<img id=\"guestbookBoxCloseBtn\" style=\"position:relative; float:right; top:0px;\" onmousedown=\"javascript:mouseDownCloseBtn('guestbookBoxCloseBtn');\" onmouseup=\"javascript:mouseUpCloseBtn('guestbookBoxCloseBtn');\" onclick=\"javascript:onClickCloseBtn('guestbookBoxCloseBtn');\" onMouseOut = \"javascript:mouseOutCloseBtn('guestbookBoxCloseBtn')\"></img>";
		
		var guestbookBoxCloseBtn = document.getElementById("guestbookBoxCloseBtn");
		guestbookBoxCloseBtn.src = $gcloseBtn.src;
		
		guestbookBoxCloseBtnDiv.style.position = "relative";
		guestbookBoxCloseBtnDiv.style.float = "right";
		guestbookBoxCloseBtnDiv.style.paddingRight = "1px";
		guestbookBoxCloseBtnDiv.style.paddingTop = "1px";
		guestbookBoxCloseBtnDiv.style.top = "0px";

		disableSelection(guestbookBoxCloseBtnDiv);
		disableSelection(guestbookBoxCloseBtn);
		
		
		// Set editor styles
		guestbookBoxEditorDiv.style.position = "relative";
		guestbookBoxEditorDiv.style.paddingLeft = "7px";
		guestbookBoxEditorDiv.style.paddingRight = "7px";
		guestbookBoxEditorDiv.style.paddingTop = "5px";
		guestbookBoxEditorDiv.style.height = guestbookEditorHeight + "px";
		guestbookBoxEditorDiv.style.backgroundColor = "#86b8f4";
		guestbookBoxEditorDiv.style.fontSize = "15px";
		guestbookBoxEditorDiv.style.color = "#ffffff";
		guestbookBoxContentDiv.style.float = "bottom";
		
		//guestbookBoxEditorDiv.style.marginLeft = "2em";
		//guestbookBoxEditorDiv.style.marginRight = "2em";
		
		var nameTextboxStr = "<span><textarea id=\"guestNameText\" style=\"position:relative; top:6px; height:17px; width:" + 150 + "px;\"> </textarea></span>";
		var nameRowStr = "<b>Name:&nbsp&nbsp</b>" + nameTextboxStr;
		var commentTextboxStr = "<textarea id=\"guestbookCommentText\" style=\"position:relative; height:50px; width:" + (guestbookBoxEditorDiv.offsetWidth-20) + "px;\"> </textarea>";
		
		var postBtnDivStr = "<input id=\"PostGuestComment\" type=\"submit\" class=\"button\" value=\"Post\" style=\"margin-left:1em; width:80px; height:23px; font-size:12px;\" onclick=\"javascript:onPostGuestbookCommentClick('guestNameText', 'guestbookCommentText');\"/>";
		//var postBtnDivStr = "<span id=\"PostGuestComment\" style=\"height:18px; margin-bottom:5px; margin-left:6px;\"><button onclick=\"javascript:onPostGuestbookCommentClick('guestNameText', 'guestbookCommentText');\"> Post </button></span>";
		
		var msgDivStr = "<span id=\"guestbookErrorMsgDiv\" style=\"font-size:11px; height:18px; color:red; margin-bottom:5px; margin-left:6px;\"> Please keep it clean </span>";
		
		guestbookBoxEditorDiv.innerHTML ="<b>Enter your comments here:</b> <br>" + commentTextboxStr + nameRowStr + postBtnDivStr + msgDivStr;
		
		var nameTextDiv = document.getElementById("guestNameText");
		if (nameTextDiv)
			nameTextDiv.value = getFullName();
		var commentTextDiv = document.getElementById("guestbookCommentText");
		if (commentTextDiv)
			commentTextDiv.value = "";
		/*
		var postGuestCommentDiv = document.getElementById("PostGuestComment");
		if (postGuestCommentDiv)
		{
			//<input type='submit' class='button' value='Login' style="width:80px; height:30px; font-size:12px;" onclick="javascript:onLoginClick('UserTextID', 'PasswordTextID');"/>
			postGuestCommentDiv.setAttribute('class', "jqBtn");
		}
		*/
		//$("button, input:submit, a", ".jqBtn" ).button();

		
		// Set guestbook content styles
		guestbookBoxContentDiv.style.position = "relative";
		guestbookBoxContentDiv.style.paddingLeft = "10px";
		guestbookBoxContentDiv.style.paddingRight = "10px";
		guestbookBoxContentDiv.style.paddingTop = "5px";
		guestbookBoxContentDiv.style.backgroundColor = "#fafafa";
		guestbookBoxContentDiv.style.height = (guestBookHeight - (guestBookTitleHeight + guestbookEditorHeight + 14)) + "px";
		//guestbookBoxContentDiv.style.float = "bottom";
		guestbookBoxContentDiv.innerHTML = innerHTML = "";
		
		guestbookBoxDiv.style.visibility = "visible";
		guestbookBoxDiv.style.display = "none";
	}
} //initGuestBookBox()


function onPostGuestbookCommentClick(guestNameTextDivID, guestbookCommentTextDivID)
{
	var nameTextDiv = document.getElementById(guestNameTextDivID);
	var commentTextDiv = document.getElementById(guestbookCommentTextDivID);
	if (nameTextDiv && commentTextDiv)
	{
		var guestbookErrorMsgDiv = document.getElementById("guestbookErrorMsgDiv");
		if (nameTextDiv.value == "")
		{
			guestbookErrorMsgDiv.innerHTML = "Please enter your name";
			return;
		}
		else if(commentTextDiv.value == "")
		{
			guestbookErrorMsgDiv.innerHTML = "Please enter your comments";
			return;
		}
		guestbookErrorMsgDiv.innerHTML = "Adding your comments...";
		AddGuestComment("guestbookBoxContentDiv", "guestbookErrorMsgDiv", 0, nameTextDiv.value, commentTextDiv);
	}
} //onPostGuestbookCommentClick()

function disableSelection(target)
{
	if (typeof target.onselectstart!="undefined") //IE route
		target.onselectstart = function() {return false; }
	else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
		target.style.MozUserSelect="none"
	else //All other route (ie: Opera)
		target.onmousedown=function() {return false;}
	target.style.cursor = "default"
} //disableSelection()


function onHighlightVerseToggle()
{
	var btnDivKjv = document.getElementById($ghighlightVerseBtnID + "Kjv");
	var btnDivAsv = document.getElementById($ghighlightVerseBtnID + "Asv");
	if ($gHighLightVerseOnMouseOver)
	{
		$gHighLightVerseOnMouseOver = false;
		if (btnDivKjv)
			btnDivKjv.value = "Turn on highlighting";
		if (btnDivAsv)
			btnDivAsv.value = "Turn on highlighting";
	}
	else
	{
		$gHighLightVerseOnMouseOver = true;
		if (btnDivKjv)
			btnDivKjv.value = "Turn off highlighting";
		if (btnDivAsv)
			btnDivAsv.value = "Turn off highlighting";
	}
}


function onSearchClick(searchTextID, otherSearchTextId1, otherSearchTextId2, searchTabBarID, searchContentDivID) { 
	var searchText = document.getElementById(searchTextID).value;
	var otherSearchText1 = document.getElementById(otherSearchTextId1);
	var otherSearchText2 = document.getElementById(otherSearchTextId2);
	if (otherSearchText1)
	{
		otherSearchText1.value = searchText;
		otherSearchText1.setAttribute('x-webkit-speech', "x-webkit-speech");
	}
	if (otherSearchText2)
	{
		otherSearchText2.value = searchText;
		otherSearchText2.setAttribute('x-webkit-speech', "x-webkit-speech");
	}
	searchBible(searchText, searchTabBarID, searchContentDivID);
}

function onFacebookBtnClicked(bookChapterVerse, verseText, commentText)
{
	streamPublish(bookChapterVerse, verseText, commentText);
}

function clickOnVerse(verseDivID) 
{

	// remove previous verse' border

	if ($gprevVerseClicked != "") 
	{

		document.getElementById($gprevVerseClicked).style.borderStyle = "none";

		if (($gprevVerseClicked  == "kjvVerseId1") || ($gprevVerseClicked  == "asvVerseId1"))

		{

			document.getElementById($gprevVerseClicked).style.borderTop = "1px solid #cccccc";

			document.getElementById($gprevVerseClicked).style.borderBottom = "1px solid #cccccc";

		}

		else

		{

			document.getElementById($gprevVerseClicked).style.borderBottom = "1px solid #cccccc";

		}

	}

	$gPrevBackColorClicked = document.getElementById(verseDivID).style.backgroundColor;

    $gprevVerseClicked = verseDivID;

} //clickOnVerse



function blinkVerse(verseDivID)
{
	document.getElementById(verseDivID).style.backgroundColor = "#ffff99";
}


function mouseOnVerse(verseDivID) 
{
	if ($gHighLightVerseOnMouseOver)
		document.getElementById(verseDivID).style.backgroundColor = "#e4f0ff";
} //mouseOnVerse




function mouseOffVerse(verseDivID) 
{

	document.getElementById(verseDivID).style.backgroundImage = "none";
	document.getElementById(verseDivID).style.backgroundColor = "transparent";

/*

    if ($gprevVerseClicked != verseDivID) {

	//document.getElementById(verseDivID).style = $gPrevStyle;

	//document.getElementById(verseDivID).style.backgroundColor = "transparent";

	//document.getElementById(verseDivID).style.backgroundColor = $gPrevBackColor;

	document.getElementById(verseDivID).style.cursor = "default";

	document.getElementById(verseDivID).style.backgroundImage = "none";

	

	//document.getElementById(verseDivID).style.borderStyle = "none";

	//document.getElementById(verseDivID).style.borderWidth = "0";

	//document.getElementById(verseDivID).style.borderColor = "transparent";

    }

*/

}



function mouseOnChapter(chNo) 
{
	if (chNo != $gcurrentChapterNumber)
	{

		document.getElementById(chNo).style.cursor = "pointer";
		document.getElementById(chNo).style.backgroundColor = "#e4f0ff";
	}
	
	/*

	document.getElementById(chNo).style.backgroundImage = "url('themes/" + $g_theme + "/book_selection_background.jpg')";
	document.getElementById(chNo).style.backgroundRepeat = "repeat-x";
	document.getElementById(chNo).style.backgroundPositionY = 'center';
	*/

}



function mouseOffChapter(chNo) 
{
	if (chNo != $gcurrentChapterNumber)
	{

		document.getElementById(chNo).style.cursor = "default";

		document.getElementById(chNo).style.backgroundImage = "none";
		document.getElementById(chNo).style.backgroundColor = "transparent";
	}

}



function mouseOnBook(bookDivID, bookChaptersSelectorBtnDiv) 
{
	var curBookDivID = "bookId" + $gcurrentBookID;
	if (bookDivID != curBookDivID)
	{
		document.getElementById(bookDivID).style.backgroundColor = "#e4f0ff";
	}
	document.getElementById(bookDivID).style.cursor = "pointer";
	document.getElementById(bookChaptersSelectorBtnDiv).style.visibility = "visible";
	
	/*

	document.getElementById(bookDivID).style.backgroundImage = "url('themes/" + $g_theme + "/book_selection_background.jpg')";
	document.getElementById(bookDivID).style.backgroundRepeat = "repeat-x";
	document.getElementById(bookDivID).style.backgroundPositionY = 'center';
	*/

}



function mouseOffBook(bookDivID, bookChaptersSelectorBtnDiv) 
{
	var curBookDivID = "bookId" + $gcurrentBookID;
	if (bookDivID != curBookDivID)
	{

		document.getElementById(bookDivID).style.cursor = "default";

		document.getElementById(bookDivID).style.backgroundImage = "none";
		document.getElementById(bookDivID).style.backgroundColor = "transparent";
	}
	document.getElementById(bookChaptersSelectorBtnDiv).style.visibility = "hidden";

}



var gPrevVerseNumber=0;

function onPostCommentSuccess(msg, bookID, chapterID, verseID, verseDivPretext, divID)
{
	var commentMessageID = "CommentMessageDivID_" + gPrevVerseNumber;
	var messageDiv = document.getElementById(commentMessageID);
	if (messageDiv)
	{
		messageDiv.innerHTML = "Comment successfully posted (ID=" + msg + ")";
	}
	// Update comment count after successful post
	// TODO: Also update book's and chapter's comment count.
	onShowComments(bookID, chapterID, verseID, gPrevVerseNumber, gPrevVerseNumber, verseDivPretext);
	//UpdateCommentCount(divID);
}

function onPostCommentFailed(message)
{
	var commentMessageID = "CommentMessageDivID_" + gPrevVerseNumber;
	var messageDiv = document.getElementById(commentMessageID);
	if (messageDiv)
	{
		messageDiv.innerHTML = message;
	}
}

function trim(s)
{
	var l=0; var r=s.length -1;
	while(l < s.length && s[l] == ' ')
	{	l++; }
	while(r > l && s[r] == ' ')
	{	r-=1;	}
	return s.substring(l, r+1);
}

function onPostCommentClick(bookID, chapterID, verseID, verseNumber, divID, verseDivPretext)
{
	var commentText = "";
	var commentMessageID = "CommentMessageDivID_" + gPrevVerseNumber;
	var messageDiv = document.getElementById(commentMessageID);
	messageDiv.style.fontSize = "10px";
	messageDiv.style.fontWeight = "normal";
	messageDiv.style.color = "#aa0000";
	
	if (!isLoggedIn())
	{
		messageDiv.innerHTML = "Please login to comment";
		return;
	}
	
	var commentTextID = "CommentTextDivID_" + gPrevVerseNumber;
	var commentTextDiv = document.getElementById(commentTextID);
	if (commentTextDiv)
	{
		commentTextDiv.disabled = true;
		commentText = commentTextDiv.value;
	}
	
	commentText = trim(commentText);
	if (commentText.length <= 0)
	{
		messageDiv.innerHTML = "Did you forget to write your comment? You can close this box, by clicking \"Cancel\" button";
		commentTextDiv.disabled = false;
		return;
	}
	
	if (messageDiv)
	{
		messageDiv.innerHTML = "Posting comment, please wait...";
	}
	
	var user = GetSavedUserName();
	var pwd = GetSavedPassword();
	doPostComment(user, pwd, bookID, chapterID, verseID, commentText, 
		onPostCommentSuccess, onPostCommentFailed, verseDivPretext, divID);
	
} //onPostCommentClick()

function onCancelCommentClick(verseDivPretext)
{
	if (gPrevVerseNumber)
	{
		//alert(kjvVerseId);
		$('#CommentsContainerDivID_'+gPrevVerseNumber).animate({
		    opacity: 1,
		    height: '-=50',
		    height: 'hide'
		  }, 200, function()
					{
						var prevVerseDiv = document.getElementById(verseDivPretext + gPrevVerseNumber);
						var preCommentDiv = document.getElementById("CommentsContainerDivID_" + gPrevVerseNumber);
						prevVerseDiv.removeChild(preCommentDiv);
					
						// Clear back-color on verse (otherwise, when we cancel two verses get back color)
						mouseOffVerse(verseDivPretext + gPrevVerseNumber);
					
						gPrevVerseNumber = 0;
					});
		
	}
}

function disableCommentBox(commentTextID, textToDisplay)
{
	commentTextDiv = document.getElementById(commentTextID);
	if (commentTextDiv)
	{
		commentTextDiv.disabled = true;
		commentTextDiv.value = textToDisplay;
	}
}

function adjustCommentTextBox(verseID)
{
	if (verseID)
	{
		var commentDiv = document.getElementById("CommentsContainerDivID_" + verseID);
		var textboxDiv = document.getElementById("CommentTextDivID_" + verseID);
		if (textboxDiv && commentDiv)
		{
			//commentDiv.style.height = null;
			textboxDiv.style.position = "relative";
			textboxDiv.style.float = "top";
			textboxDiv.style.height = "50px";
			textboxDiv.style.width = "99%"; //commentDiv.offsetWidth-25 + "px";
			textboxDiv.style.marginTop = ".1em";
			textboxDiv.style.marginBottom = ".7em";
			//textboxDiv.style.paddingLeft = ".3em";
			//textboxDiv.style.paddingRight = ".3em";
			commentDiv.style.marginLeft = ".3em";
			commentDiv.style.marginRight = ".3em";
			//textboxDiv.style.left = "5px";
		}
	}
} //adjustCommentTextBox()


function onComment(bookID, chapterID, verseID, verseNumber, divID, verseDivPretext) {
	var commentID = "CommentDivID_" + divID;
	var commentTextID = "CommentTextDivID_" + divID;
	var commentMessageID = "CommentMessageDivID_" + divID;
	var commentTextName = "CommentText_" + divID;
	var commentDiv = document.getElementById(commentID);
	var verseDiv = document.getElementById(verseDivPretext + divID);
	
	if (!commentDiv) //create comment div
	{
		if (verseDiv)
		{
			commentDiv = document.createElement('div');

			commentDiv.setAttribute('id', commentID);
			commentDiv.setAttribute('class', "note");
			commentDiv.style.borderStyle = "solid";
			commentDiv.style.borderWidth = "2px";
			commentDiv.style.borderColor = "#00aa00"; //"#a9a9a9";
			commentDiv.style.visibility = "visible";
			commentDiv.style.marginLeft = "2em";
			commentDiv.style.marginRight = "2em";
			commentDiv.style.backgroundColor = "rgb(255, 240, 120)"; //"#86b8f4";
			commentDiv.style.position = "relative";
			commentDiv.style.padding = "3px";
			commentDiv.style.paddingBottom = "12px";
			
			
			var textboxStr = "<textarea id=\"" + commentTextID + "\" name=\"" + commentTextName + "\"> </textarea>";
			var cancelBtnDivStr = "<span id=\"CancelCommentBtn\" style=\"position:relative; padding-left:.2em; margin-bottom:3px; margin-left:2px;\"><button onclick=\"javascript:onCancelCommentClick('" + verseDivPretext + "');\"> Cancel </button></span>";
			var postCommentParams = "'" + bookID + "','" + chapterID + "','" + verseID + "','" + verseNumber + "','" + divID+ "','" + verseDivPretext+ "'";
			var postBtnDivStr = "<span id=\"PostCommentBtn\" style=\"position:relative; margin-bottom:3px; margin-left:20px;\"><button onclick=\"javascript:onPostCommentClick(" + postCommentParams + ");\"> Post </button></span>";
			var messageDivStr = "<span id=\"" + commentMessageID + "\" style=\"margin-bottom:20px; margin-left:40px;\"> </span>";
			
			var radioStr = "<span id=\"radio\" style=\"margin-left:20px;\"> <input type=\"radio\" id=\"PrivateCommentRadio\" name=\"radio\" /><label for=\"radio1\">Private</label> <input type=\"radio\" id=\"ProtectedCommentRadio\" name=\"radio\" checked=\"checked\"/><label for=\"radio2\">Friends Only</label> <input type=\"radio\" id=\"PublicCommentRadio\" name=\"radio\" /><label for=\"radio3\">Public</label> </span>";
			
			var buttonsStr = "<div style=\"horizontal-align:right; float:bottom;\">" + cancelBtnDivStr + postBtnDivStr + messageDivStr + "</div>";

			
			
			if (gPrevVerseNumber)
			{
				var prevVerseDiv = document.getElementById(verseDivPretext + gPrevVerseNumber);
				var preCommentDiv = document.getElementById("CommentDivID_" + gPrevVerseNumber);
				if (preCommentDiv)
				{
					prevVerseDiv.removeChild(preCommentDiv);
				}
				var preCommentsDiv = document.getElementById("CommentsDivID_" + gPrevVerseNumber);
				if (preCommentsDiv)
				{
					prevVerseDiv.removeChild(preCommentsDiv);
				}
				gPrevVerseNumber = 0;
			}
			commentDiv.innerHTML = textboxStr + buttonsStr;
			verseDiv.appendChild(commentDiv);
			commentDiv = document.getElementById(commentID);
			
			adjustCommentTextBox(divID);
			gPrevVerseNumber = divID;

			if (!isLoggedIn())
			{
				disableCommentBox(commentTextID, "Please login to comment");
			}
			
			var cancelBtnDiv = document.getElementById("CancelCommentBtn");
			if (cancelBtnDiv)
			{
				cancelBtnDiv.setAttribute('class', "jqBtn");
				cancelBtnDiv.style.bottom = "-5px";
				cancelBtnDiv.style.left = "-3px";
				cancelBtnDiv.style.fontSize = "14px";
				cancelBtnDiv.style.width = "100px";
			}
			
			var postBtnDiv = document.getElementById("PostCommentBtn");
			if (postBtnDiv)
			{
				postBtnDiv.setAttribute('class', "jqBtn");
				postBtnDiv.style.bottom = "-5px";
				postBtnDiv.style.fontSize = "14px";
				postBtnDiv.style.width = "100px";
			}
			
			var radioDiv = document.getElementById("radio");
			if (radioDiv)
			{
				radioDiv.setAttribute('id', "radio");
			}
			
			$("button, input:submit, a", ".jqBtn" ).button();
			$( "#radio" ).buttonset();
			
			
		}
	}
	else
	{
		var finalHeight = commentDiv.style.height;
		commentDiv.style.height - "0px";
		$('#'+commentID).animate({
		    opacity: 1,
		    height: '-=50',
		    height: finalHeight
		  }, 200, function()
					{
						verseDiv.removeChild(commentDiv);
						gPrevVerseNumber = 0;
					});
	}

} //onComment()

function onCloseComments(verseDivPretext)
{
	var commentsID = "CommentsContainerDivID_" + gPrevVerseNumber;
	var commentsDiv = document.getElementById(commentsID);
	var verseDiv = document.getElementById(verseDivPretext + gPrevVerseNumber);
	if (commentsDiv && verseDiv)
	{
		$('#'+commentsID).animate({
		    opacity: 1,
		    height: '-=50',
		    height: 'hide'
		  }, 200, function()
					{
						verseDiv.removeChild(commentsDiv);
						gPrevVerseNumber = 0;
					});
		
	}
} //onCloseComments

function onShowComments(bookID, chapterID, verseID, verseNumber, divID, verseDivPretext)
{
	var commentsContainerID = "CommentsContainerDivID_" + divID;
	var commentsInnerID = "CommentsDivID_" + divID;
	var commentTextID = "CommentTextDivID_" + divID;
	var commentMessageID = "CommentMessageDivID_" + divID;
	var commentTextName = "CommentText_" + divID;
	//var commentsInnerDiv = document.getElementById(commentsInnerID);
	var commentsContainerDiv = document.getElementById(commentsContainerID);
	var commentsInnerDiv = null;
	var verseDiv = document.getElementById(verseDivPretext + divID);
	
	
	if (!commentsContainerDiv) //create comment div
	{
		if (verseDiv)
		{
			if (gPrevVerseNumber)
			{
				var prevVerseDiv = document.getElementById(verseDivPretext + gPrevVerseNumber);
				var preCommentsContainerDiv = document.getElementById("CommentsContainerDivID_" + gPrevVerseNumber);
				if (preCommentsContainerDiv)
				{
					// Remove all children of 
					while(preCommentsContainerDiv.firstChild)
					{
						preCommentsContainerDiv.removeChild(preCommentsContainerDiv.firstChild);
					}
					prevVerseDiv.removeChild(preCommentsContainerDiv);
				}
				gPrevVerseNumber = 0;
			}

			commentsContainerDiv = document.createElement('div');
			commentsContainerDiv.setAttribute('id', commentsContainerID);
			//commentsDiv.setAttribute('id', commentsInnerID);
			commentsContainerDiv.setAttribute('class', "note");
			commentsContainerDiv.style.borderStyle = "solid";
			commentsContainerDiv.style.borderWidth = "2px";
			commentsContainerDiv.style.borderColor = "#00aa00"; //"#a9a9a9";
			commentsContainerDiv.style.visibility = "visible";
			commentsContainerDiv.style.marginLeft = "2em";
			commentsContainerDiv.style.marginRight = "2em";
			commentsContainerDiv.style.backgroundColor = "rgb(230, 230, 230)"; //"#86b8f4";
			commentsContainerDiv.style.position = "relative";
			//commentsContainerDiv.innerHTML = "<div style=\"position:relative; padding:.5em; font-size:10px; font-weight:normal; color:#444444;\">" + "Loading..." + "</div>";
			
/////////////////////////////////////////////////////////////////////////////
			// Add textbox and buttons to add comment(s)
			//&lt;
			var instructionsStr = "<div id=\"InstrWrapper_Inner\" style=\"padding-top:3px; padding-bottom:3px; padding-left:1em; display:none; color:#222222; background-color:#eeeeee;\"><b>BOLD</b>: This is &lt;b&gt;<b>BOLD</b>&lt;/b&gt; text. <br> <u>Underline</u>: This is &lt;u&gt;<u>underlined</u>&lt;/u&gt; text. <br> <i>Italics</i>: This is &lt;i&gt;<i>italicized</i>&lt;/i&gt; text.</div>";
			var instructionsWrapper = "<div id=\"InstrWrapper\" style=\"margin-bottom:3px; margin-left:.2em; margin-right:.2em; font-size:10px; color:#555555;\"><span id=\"InstrWrapper_Header\" onmouseover=\"this.style.cursor='pointer';\" onmouseout=\"this.style.color:#777777;\" onclick=\"javascript:onInstructionsClick('InstrWrapper')\"><b>Show formatting instructions &#9660;</b></span>" + instructionsStr + "</div>"
			var textboxStr = "<textarea id=\"" + commentTextID + "\" name=\"" + commentTextName + "\"> </textarea>";
			//var cancelBtnDivStr = "<span id=\"CancelCommentBtn\" style=\"position:relative; padding-left:.2em; margin-bottom:3px; margin-left:2px;\"><button onclick=\"javascript:onCancelCommentClick('" + verseDivPretext + "');\"> Cancel </button></span>";
			var cancelBtnDivStr = "<input id=\"CancelCommentBtn\" type='button' class='button' value='Close' style=\"margin-right:1em; margin-bottom:1em; width:80px; font-size:10px;\" onclick=\"javascript:onCancelCommentClick('" + verseDivPretext + "');\"/>";
			var postCommentParams = "'" + bookID + "','" + chapterID + "','" + verseID + "','" + verseNumber + "','" + divID+ "','" + verseDivPretext+ "'";
			//var postBtnDivStr = "<span id=\"PostCommentBtn\" style=\"position:relative; margin-bottom:3px; margin-left:20px;\"><button onclick=\"javascript:onPostCommentClick(" + postCommentParams + ");\"> Post </button></span>";
			var postBtnDivStr = "<input id=\"PostCommentBtn\" type='submit' class='button' value='Post' style=\"margin-right:.2em; margin-bottom:1em; width:80px; font-size:10px;\" onclick=\"javascript:onPostCommentClick(" + postCommentParams + ");\"/>";
			var messageDivStr = "<span id=\"" + commentMessageID + "\" style=\"float:left; margin-bottom:20px; margin-left:40px;\"> </span>";
			
			var radioStr = "<span id=\"radio\" style=\"margin-left:20px;\"> <input type=\"radio\" id=\"PrivateCommentRadio\" name=\"radio\" /><label for=\"radio1\">Private</label> <input type=\"radio\" id=\"ProtectedCommentRadio\" name=\"radio\" checked=\"checked\"/><label for=\"radio2\">Friends Only</label> <input type=\"radio\" id=\"PublicCommentRadio\" name=\"radio\" /><label for=\"radio3\">Public</label> </span>";
			
			var buttonsDivStr = "<span style=\"float:right;\">" + cancelBtnDivStr + postBtnDivStr + "</span>";			
			var buttonsStr = "<div style=\"horizontal-align:right; float:bottom; padding-bottom:1em;\">" + messageDivStr + buttonsDivStr + "</div>";
						
			gPrevVerseNumber = divID;
			
			/*
			var cancelBtnDiv = document.getElementById("CancelCommentBtn");
			if (cancelBtnDiv)
			{
				cancelBtnDiv.setAttribute('class', "jqBtn");
				cancelBtnDiv.style.bottom = "-5px";
				cancelBtnDiv.style.left = "-3px";
				cancelBtnDiv.style.fontSize = "14px";
				cancelBtnDiv.style.width = "100px";
			}
			*/
			
			/*
			var postBtnDiv = document.getElementById("PostCommentBtn");
			if (postBtnDiv)
			{
				postBtnDiv.setAttribute('class', "jqBtn");
				postBtnDiv.style.bottom = "-5px";
				postBtnDiv.style.fontSize = "14px";
				postBtnDiv.style.width = "100px";
			}
			*/
			
			var radioDiv = document.getElementById("radio");
			if (radioDiv)
			{
				radioDiv.setAttribute('id', "radio");
			}
			
			$("button, input:submit, a", ".jqBtn" ).button();
			$( "#radio" ).buttonset();
			
/////////////////////////////////////////////////////////////////////////////
			commentsInnerDiv = document.createElement('div');
			commentsInnerDiv.setAttribute('id', commentsInnerID);
			var postCommentsDiv = document.createElement('div');
			postCommentsDiv.innerHTML = instructionsWrapper + textboxStr + buttonsStr;
			
			commentsInnerDiv.innerHTML = "<div style=\"position:relative; padding:.5em; font-size:11px; font-weight:normal; color:#aa0000;\">Searching for comments...</div>"
			commentsContainerDiv.appendChild(commentsInnerDiv);
			commentsContainerDiv.appendChild(postCommentsDiv);
			verseDiv.appendChild(commentsContainerDiv);
			adjustCommentTextBox(divID);
			if (!isLoggedIn())
			{
				disableCommentBox(commentTextID, "Please login to comment");
			}
			else
			{
				var commentTextDiv = document.getElementById(commentTextID);
				if (commentTextDiv)
				{
					commentTextDiv.disabled = false;
					commentTextDiv.value = "";
				}
			}
			
			commentsDiv = document.getElementById(commentsInnerID);
			
			gPrevVerseNumber = divID;
			
			var user = GetSavedUserName();
			var pwd = GetSavedPassword();
			doGetComments(user, pwd, bookID, chapterID, verseID, commentsInnerID, verseDivPretext, null, null, divID);
		}
	}
	else
	{
		$('#'+commentsContainerID).animate({
		    opacity: 1,
		    height: '-=50',
		    height: 'hide'
		  }, 200, function()
					{
						verseDiv.removeChild(commentsContainerDiv);
						gPrevVerseNumber = 0;
					});
	}

}

function onInstructionsClick(wrapperID)
{
	var wrapperDiv = document.getElementById(wrapperID);
	var innerDiv = document.getElementById(wrapperID + "_Inner");
	var headerDiv = document.getElementById(wrapperID + "_Header");
	
	if (wrapperDiv && innerDiv && headerDiv)
	{
		if (innerDiv.style.display == "none")
		{
			innerDiv.style.display = "block";
			headerDiv.innerHTML = "<b>Hide formatting instructions &#9650;</b>";
		}
		else
		{
			innerDiv.style.display = "none";
			headerDiv.innerHTML = "<b>Show formatting instructions &#9660;</b>";
		}
	}
}

function onScrollKjv()
{
	var versesDivKjv = document.getElementById($gversesDivID);
	if (versesDivKjv)
	{
		gTabScrollPosKjvY = versesDivKjv.scrollTop;
		SaveScrollPosKjv(gTabScrollPosKjvY);
	}
} //onScrollKjv()

function onScrollAsv()
{
	var versesDivAsv = document.getElementById($gversesDivIDASV);
	if (versesDivAsv)
	{
		gTabScrollPosAsvY = versesDivAsv.scrollTop;
		SaveScrollPosAsv(gTabScrollPosAsvY);
	}
} //onScrollAsv()

function onScrollSearch()
{
	var versesDivSearch = document.getElementById("searchContent");
	if (versesDivSearch)
		gTabScrollPosSearchY = versesDivSearch.scrollTop;
} //onScrollSearch()

/*
function checkParent(t)
{ 
	while(t.parentNode)
	{
		if(t==document.getElementById('mydiv'))
		{ 
			return false;
		}
		t=t.parentNode;
	}
	return true;
} 
*/

function IsInFamily(div, divFamilyID)
{
	if (!div)
		return false;
	do
	{
		var tmpID = div.getAttribute('id');
		if (tmpID == divFamilyID)
			return true;
		div = div.parentNode;
	} while (div);
	
	return false;
}


// TODO: Extend this to close other boxes as well (like login, guestbook, etc.,)
function onDocumentClick(e)
{
	HandleDocumentClick();
} //onDocumentClick()

// Use this for any popup box (to close it on document click)
function PreventDefaultAction(e)
{
	if (isIE())
	{
		e.cancelBubble = true;
	}
	else
	{
		e.stopPropagation();
		e.preventDefault();
	}
	return false;
} //PreventDefaultAction()

function HandleDocumentClick()
{
	// Close chapterbox
	if ($gChaptersBoxVisible == 1)
		CloseChapterBox();
	
	// Close login
	if ($gloginBoxVisible == 1)
		showLoginBox(0);
	
	// Close guestbook
	if ($gGuestbookVisible == 1)
		onGuestbookClick("guestbookBtn");
	
	// Close social-box
	if ($gSocialBoxVisible == 1)
		onSocialBtnClick('socialBtn', 'socialBtnArrow');
	
	if ($gHistoryboxVisible == 1)
		ShowHistory();
} //HandleDocumentClick()

// Do all control adjustments according to the OS and the browsers
function AdjustControls()
{
	
	// user and password textboxes
	var textSize = "40";
	if (isWindows())
	{
		if (isIE())
			textSize = "43";
		else
			textSize = "40";
	}
	else if(isLinux())
	{
		textSize = "40";
	}
	else if (isMac())
	{
		textSize = "50";
	}
	
	var userTextbox = document.getElementById("UserTextID");
	if (userTextbox)
		userTextbox.size = textSize;
	
	var pwdTextbox = document.getElementById("PasswordTextID");
	if (pwdTextbox)
		pwdTextbox.size = textSize;
	
	var fontSize = "11px";
	var paddingTop = ".3em";
	if (isFirefox())
	{
		fontSize = "10px";
		paddingTop = ".2em";
	}
	else if(isChrome())
	{
		fontSize = "12px";
	}
	var loginbtn = document.getElementById("LoginbtnId");
	if (loginbtn)
	{
		loginbtn.style.fontSize = fontSize;
		loginbtn.style.paddingTop = paddingTop;
	}
	
}

function presentBible(contentTabs, booksDivID, chaptersDivID, versesDivID, versesDivIDASV, 
	contentHeaderDivID, contentHeaderDivIDASV, footerDivID, loginDivID, registrationLineDivID, 
	loginBoxDivID, dateDiv, timeDiv, plusOneBtnDivID, googlePlusPageBtnDivID, facebookBtnDivID, facebookPageBtnDivID, 
	diggDivID, diggBtnDivID, stumbleuponBtnDivID, tweetBtnDivID, twitterBtnDivID, maximizeBtnDiv, highlightVerseBtnID)
{
	initFacebookScript();
	
	document.onclick = onDocumentClick; 
	
	$gcontentTabs = contentTabs;

	$gbooksDivID = booksDivID;	
	
	$gdateDiv = dateDiv;
	$gtimeDiv = timeDiv;
	
	UpdateClock();
	setInterval('UpdateClock()', 1000);

	$gchaptersDivID = chaptersDivID;

	$gversesDivID = versesDivID;
	$gversesDivIDASV = versesDivIDASV;

	$gcontentHeaderDivID = contentHeaderDivID;
	$gcontentHeaderDivIDASV = contentHeaderDivIDASV;

	$gfooterDivID = footerDivID;
	$gloginButtonDivID = loginDivID;
	$gregistrationLineDivID = registrationLineDivID;
	$gloginBoxDiv = loginBoxDivID;
	
	// social
	$gPlusOneBtnDivID = plusOneBtnDivID;
	$gPlusOnePageBtnDivID = googlePlusPageBtnDivID;
	$gFacebookBtnDivID = facebookBtnDivID;
	$gFacebookPageBtnDivID = facebookPageBtnDivID;
	$gDiggDivID = diggDivID;
	$gDiggBtnDivID = diggBtnDivID;
	$gStumbleuponBtnDivID = stumbleuponBtnDivID;
	$gTweetBtnDivID = tweetBtnDivID;
	$gTwitterBtnDivID = twitterBtnDivID;
	
	$gMaximizeBtnDiv = maximizeBtnDiv;
	$ghighlightVerseBtnID = highlightVerseBtnID;
	
	showSticky();
	
	AdjustControls();
	
	loadImagesToCache();
	adjustGuestbookBotton();
	setMaxButton(1, 0);
	initLoginBox();
	RefreshLoginButton(false, true);
	showLoginBox(0);

	//loadBooks();
	//autoLogin();
	
	gBrowsingHistory = new BrowsingHistory();
	var browsingHistoryObj = GetBrowsingHistory();
	if (browsingHistoryObj!=null)
		gBrowsingHistory.Initialize(browsingHistoryObj);
	
	
	var versesDivKjv = document.getElementById($gversesDivID);
	if (versesDivKjv)
		versesDivKjv.onscroll = onScrollKjv;
	
	var versesDivAsv = document.getElementById($gversesDivIDASV);
	if (versesDivAsv)
		versesDivAsv.onscroll = onScrollAsv;
	
	var versesDivSearch = document.getElementById("searchContent");
	if (versesDivSearch)
		versesDivSearch.onscroll = onScrollSearch;
	
	// Get position from cookie
	var browsingState = null;
	if (gBrowsingHistory!=null && gBrowsingHistory.CurrentIndex!=null && gBrowsingHistory.CurrentIndex!=undefined)
		browsingState = gBrowsingHistory.GetBrowsingStateByIndex(gBrowsingHistory.CurrentIndex, false);
	if (browsingState!=null)
	{
		$gcurrentBookName = browsingState.BookName;
		$gcurrentBookID = browsingState.BookID;
		$gcurrentChapterNumber = browsingState.ChapterNumber;
		$gcurrentVerseNumber = browsingState.VerseNumber;
		gTabScrollPosKjvY = GetLastScrollPosKjv();
		gTabScrollPosAsvY = GetLastScrollPosAsv();
	}
	
	autoLogin();
	
	// Start only if the 'BuzzOnStart' cookie is true
	var buzzOnStart = GetBuzzOnStartup();
	if (buzzOnStart)
		onUpdatesClick("updatesImage");
}

function UpdateClock()
{
	var divDate = document.getElementById($gdateDiv);
	if (divDate)
		divDate.innerHTML = GetPresentableCurrentDate();
	
	var timeDiv = document.getElementById($gtimeDiv);
	if (timeDiv)
		timeDiv.innerHTML = GetPresentableCurrentTime();
} //UpdateClock()

function showSticky()
{
	// FIXME: This is not working in IE.
	//newNote(400, 14, 500, 35, '<b>Cloud Study Bible is tested on Google Chrome, Firefox, Safari, Internet Explorer 8 so far. Please make sure the javascript is enabled. If you have any issues, <a href=mailto:biblecloud@gmail.com> please mail us </a></b>')
}

function autoLogin()
{
	if (IsLoginExpired())
	{
		loadBooks();
		return;
	}
	
	var user = GetSavedUserName();
	var pwd = GetSavedPassword();
	if (user!="" && pwd!="")
		doLogin(user, pwd, autoLoginSuccessCallback, autoLoginFailedCallback, autoLoginStatusMessagesCallback);
	else
		loadBooks();
}

var autoLoginSuccessCallback = function(fullName, user, pwd, lastBookID, lastChapterNumber, lastVerseNumber) {
	RefreshLoginButton(false, true);
	if (lastBookID != 0)
		$gcurrentBookID = lastBookID;
	if (lastChapterNumber != 0)
		$gcurrentChapterNumber = lastChapterNumber;
	if (lastVerseNumber != 0)
		$gcurrentVerseNumber = lastVerseNumber;
	
	ShowRegistrationLine(false);
	
	loadBooks();
};

var autoLoginFailedCallback = function(message) {
	RefreshLoginButton(false, true);
	ShowRegistrationLine(true);
	loadBooks();
};

var autoLoginStatusMessagesCallback = function(message) {
	RefreshLoginButton(false, true);
};


function onCancelLoginClick()
{
	showLoginBox(0);
} //onCancelLoginClick()



var loginSuccessCallback = function(fullName, user, pwd, lastBookID, lastChapterNumber, lastVerseNumber) {
	
	SaveUserPassword(user, pwd, 7);
	ShowLoginStatus("Welcome " + fullName + "!");
	RefreshLoginButton(false, true);
	ShowRegistrationLine(false);
};

var loginFailedCallback = function(message) {
	ShowLoginStatus(message);
	RefreshLoginButton(true, false);
	ShowRegistrationLine(true);
};

var loginStatusMessagesCallback = function(message) {
	ShowLoginStatus(message);
};

function onLoginClick(userTextID, passwordTextId)
{
	var userName = document.getElementById(userTextID).value;
	var password = document.getElementById(passwordTextId).value;
	
	if (userName == "" || password=="")
	{
		ShowLoginStatus("Please enter username and password to login");
		setTimeout("clearLoginError()", 3000);
	}
	else
	{
		ShowLoginStatus("Please wait...");
		//doLogin(userName, password);
		doLogin(userName, password, loginSuccessCallback, loginFailedCallback, loginFailedCallback);
	}
} //onLoginClick()

function ShowLoginStatus(statusText)
{
	var loginErrorDiv = document.getElementById("loginErrorDivID");
	if (loginErrorDiv)
	{
		loginErrorDiv.innerHTML = statusText;
	}
} //ShowLoginStatus()

function clearLoginError()
{
	var loginErrorDiv = document.getElementById("loginErrorDivID");
	if (loginErrorDiv)
	{
		loginErrorDiv.innerHTML = "";
	}
}

function onLostFocusLoginBox()
{
	showLoginBox(0);
}

function showProgressOnLogin()
{
	var loginBtnsDiv = document.getElementById("loginButtonsDiv");
	if (loginBtnsDiv)
	{
		loginBtnsDiv.style.backgroundImage  = 'url(images/progress_small.gif)';
		//loginBtnsDiv.style.backgroundImage = "url('images/progress_small.gif')";
		loginBtnsDiv.style.backgroundRepeat = 'no-repeat';

		loginBtnsDiv.style.backgroundPosition = 'center center';
		//loginBtnsDiv.style.backgroundImage = "none";
	}
}

function HideProgressOnLogin()
{
}

function doLoginLocal(userName, password)
{
	$loginUrlStr = "./biblejs/login.php?u=" + userName+ "&p=" + password + "";
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		$gxmlhttpLogin = new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		$gxmlhttpLogin = new ActiveXObject("Microsoft.XMLHTTP");
	}
	$gxmlhttpLogin.open("GET",$loginUrlStr,true);
	$gxmlhttpLogin.send(null);
	$gxmlhttpLogin.onreadystatechange=(function stateChanged() 
	{ 

		if ($gxmlhttpLogin.readyState==4) 
		{
			HideProgressOnLogin();
			if ($gxmlhttpLogin.responseText == "success")
				ShowLoginStatus("You are logged in successfully!");
			else
				ShowLoginStatus($gxmlhttpLogin.responseText);

		}

		else 
		{

			ShowLoginStatus("Login in progress...");

		}

	});
	
} //doLoginLocal()


function onMouseOutRegElem(id)
{
	//var elemDiv = div;//document.getElementById(id);
	var elemDiv = document.getElementById(id);
	if (elemDiv)
	{
		elemDiv.style.backgroundColor = "transparent";
	}
}
function onMouseOverRegElem(id)
{
	//var elemDiv = div;//document.getElementById(id);
	var elemDiv = document.getElementById(id);
	if (elemDiv)
	{
		elemDiv.style.backgroundColor = "#eeeeee";
	}
}

function RegistrationInfo()
{
	this.firstName = "";
	this.lastName = "";
	this.middleInitial = "";
	this.userName = "";
	this.password = "";
	this.password2 = "";
	this.email = "";
}
function GetRegistrationInfo()
{
	var regInfo = new RegistrationInfo();
	regInfo.firstName = document.getElementById("FirstNameTextID").value;
	regInfo.lastName = document.getElementById("LastNameTextID").value;
	regInfo.middleInitial = document.getElementById("MiddleInitialTextID").value;
	regInfo.userName = document.getElementById("UserNameDesiredID").value;
	regInfo.password = document.getElementById("Password1TextID").value;
	regInfo.password2 = document.getElementById("Password2TextID").value;
	regInfo.email = document.getElementById("EmailTextID").value;
	return regInfo;
}

function attachRegistrationForm(attachToDiv)
{
	//guestbookBoxCloseBtnDiv.innerHTML = "<img id=\"guestbookBoxCloseBtn\" style=\"position:relative; float:right; top:0px;\" onmousedown=\"javascript:mouseDownCloseBtn('guestbookBoxCloseBtn');\" onmouseup=\"javascript:mouseUpCloseBtn('guestbookBoxCloseBtn');\" onclick=\"javascript:onClickCloseBtn('guestbookBoxCloseBtn');\" onMouseOut = \"javascript:mouseOutCloseBtn('guestbookBoxCloseBtn')\"></img>";
	var registrationFormDiv = document.createElement('div');
	registrationFormDiv.setAttribute('id', "registrationForm");
	registrationFormDiv.style.fontSize = "12px";
	attachToDiv.innerHTML = "<span style=\"color:green\"><br><b>Get Started with Cloud Study Bible:<b></span>";
	attachToDiv.style.paddingTop = ".3em";
	attachToDiv.style.paddingBottom = ".4em";
	attachToDiv.style.paddingLeft = ".5em";
	registrationFormDiv.style.position = "relative";
	//registrationFormDiv.style.autoScroll = "true";
	//registrationFormDiv.style.overflowY = "auto";
	attachToDiv.appendChild(registrationFormDiv);
	//registrationFormDiv.style.height = attachToDiv.offsetHeight + "px";
	
	attachToDiv.style.autoScroll = "true";
	attachToDiv.style.overflowY = "hidden"; //"auto";
	attachToDiv.style.overflowX = "hidden";
	
	
	
	//registrationFormDiv.appendChild(labelsDiv);
	//registrationFormDiv.appendChild(inputDiv);
	
	var lines = new Array(
		"First name:", 
		"Last name:", 
		"Middle Initial:", 
		"Desired user name:", 
		"Choose a password:", 
		"Re-enter password:", 
		"Email:");
		
	var texts = new Array(
		"<input id=\"FirstNameTextID\" type=\"text\" size=\"47\" name=\"firstname\"/>",
		"<input id=\"LastNameTextID\" type=\"text\" size=\"47\" name=\"lastname\"/>",
		"<input id=\"MiddleInitialTextID\" type=\"text\" size=\"10\" name=\"middleinitial\"/>",
		"<input id=\"UserNameDesiredID\" type=\"text\" size=\"47\" name=\"userid\"/>",
		"<input id=\"Password1TextID\" type=\"password\" size=\"47\" name=\"pwd1\"/>",
		"<input id=\"Password2TextID\" type=\"password\" size=\"47\" name=\"pwd2\"/>",
		"<input id=\"EmailTextID\" type=\"text\" size=\"47\" name=\"email\"/>");
	
	var i=0;
	for (i=0; i<texts.length; i++)
	{
		var rowDiv = document.createElement('div');
		var idText = "regElem"+(i+1);
		rowDiv.style.position = "relative";
		rowDiv.setAttribute('onmouseover', "javascript:onMouseOverRegElem('" + idText + "');");
		rowDiv.setAttribute('onmouseout', "javascript:onMouseOutRegElem('" + idText + "');");
		rowDiv.setAttribute("id", idText);
		rowDiv.style.width = (attachToDiv.offsetWidth-20) + "px";//"99%";
		rowDiv.style.height = "25px";
		//rowDiv.style.borderStyle = "solid";
		//rowDiv.style.borderColor = "#999999";
		rowDiv.style.color = "#354590";
		rowDiv.style.marginLeft = ".4em";
		rowDiv.style.marginTop = ".4em";
		rowDiv.style.paddingTop = ".4em";
		rowDiv.style.paddingBottom = ".4em";
		rowDiv.style.paddingLeft = ".4em";
		rowDiv.style.paddingRight = ".4em";
		//rowDiv.style.backgroundColor="red";
		
		var lineHTML = "<div style=\"position:relative; font-weight:bold; padding-top:.6em; float:left; width:30%;\">" + lines[i] + "</div>";
		var textHTML = "<div style=\"position:relative; padding-top:.1em; float:right; width:70%;\">" + texts[i] + "</div>";
		
		rowDiv.innerHTML = lineHTML + " " + textHTML;
		registrationFormDiv.appendChild(rowDiv);
		
	}
	
	var licenseRowDiv = document.createElement('div');
	//var id = "regElem"+(i+1);
	//licenseRowDiv.setAttribute("id", id);
	licenseRowDiv.style.position = "relative";
	licenseRowDiv.style.width = (attachToDiv.offsetWidth-20) + "px";//"99%";
	licenseRowDiv.style.height = "25px";
	licenseRowDiv.style.marginTop = ".4em";
	licenseRowDiv.style.paddingTop = ".8em";
	licenseRowDiv.style.paddingLeft = ".4em";
	licenseRowDiv.style.marginRight = ".4em";
	
	var licenseDiv = document.createElement('div');
	licenseDiv.setAttribute("id", "RegistrationLicenseDiv");
	//licenseDiv.innerHTML = "<b>By clicking on 'I agree' below, you are agreeing to the <span style=\"color:red;\" onmouseover=\"style.cursor='pointer';\" onclick=\"javascript:openTerms();\">Terms of Service</span> and the <span style=\"color:red;\" onmouseover=\"style.cursor='pointer';\" onclick=\"javascript:openPrivatePolicy();\">Privacy Policy</span>.</b>";
	licenseDiv.innerHTML = "<b>By clicking on 'I agree' below, you are agreeing to the <span style=\"color:red;\" onmouseover=\"style.cursor='pointer';\" onclick=\"javascript:openTerms();\">Terms of Service</span>.</b>";
	licenseDiv.style.fontSize = "12px";
	licenseDiv.style.fontWeight = "bold";
	licenseDiv.style.color = "#777777";
	licenseRowDiv.appendChild(licenseDiv);
	registrationFormDiv.appendChild(licenseRowDiv);
	
	var btnRowDiv = document.createElement('div');
	btnRowDiv.style.position = "relative";
	btnRowDiv.style.width = (attachToDiv.offsetWidth-20) + "px";//"99%";
	btnRowDiv.style.height = "25px";
	btnRowDiv.style.marginTop = ".4em";	
	btnRowDiv.style.paddingTop = ".8em";
	btnRowDiv.style.marginLeft = ".6em";
	btnRowDiv.style.marginRight = ".6em";
	
	var btnsDiv = document.createElement('div');
	btnsDiv.innerHTML = "<div style=\"position:relative; float:right;\"> <input id=\"RegisterBtnDivID\" mode=\"register\" type=\"submit\" class=\"button\" value=\"I agree, create my account\" style=\"margin-bottom:5em; margin-right:2em; width:230px; height:30px; font-size:14px;\" onclick=\"javascript:onRegisterBtnClick();\"/> </div>";
	btnRowDiv.appendChild(btnsDiv);
	registrationFormDiv.appendChild(btnRowDiv);
	
	
	var statusRowDiv = document.createElement('div');
	statusRowDiv.setAttribute("id", "RegistrationStatusDiv");
	statusRowDiv.style.position = "relative";
	statusRowDiv.style.width = (attachToDiv.offsetWidth-30) + "px";//"99%";
	statusRowDiv.style.height = "25px";
	statusRowDiv.style.marginTop = ".2em";
	statusRowDiv.style.paddingTop = ".4em";
	statusRowDiv.style.marginLeft = ".6em";
	statusRowDiv.style.marginRight = ".6em";
	statusRowDiv.style.textAlign = "center";
	statusRowDiv.style.color = "red";
	statusRowDiv.style.fontSize = "13px";
	statusRowDiv.style.fontWeight = "bold";
	statusRowDiv.style.top = "-10px";
	//statusRowDiv.innerHTML = "You will see the status message here";
	statusRowDiv.innerHTML = "";
	registrationFormDiv.appendChild(statusRowDiv);
}

function openPrivatePolicy()
{
	alert("private policy");
}

function openTerms()
{
	var w = 550;
	var h = 520;
	var l = Math.round((window.innerWidth/2) - (w/2));
	var t = Math.round((window.innerHeight/2) - (h/2));
	window.open("terms.html", "popup", "height=" + h + ",width=" + w + ",left=" + l + ",top=" + t + ",scrollbars=yes,modal=yes,alwaysRaised=yes");
}

$gxmlhttpRegistration = null;
function RegisterUser(regInfo)
{
	if (!regInfo)
		return false;
	
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		$gxmlhttpRegistration =new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		$gxmlhttpRegistration =new ActiveXObject("Microsoft.XMLHTTP");
	}
	$registrationUrlStr = "./biblejs/userregistration.php?uname=" + regInfo.userName + 
			"&pwd=" + regInfo.password + 
			"&fname=" + regInfo.firstName + 
			"&lname=" + regInfo.lastName + 
			"&minit=" + regInfo.middleInitial + 
			"&email=" + regInfo.email;
	
	var statusDiv = document.getElementById("RegistrationStatusDiv");
	var btnDiv = document.getElementById("RegisterBtnDivID");
	if (statusDiv)
	{
		statusDiv.innerHTML = "Sending request...";
	}
	if (btnDiv)
	{
		btnDiv.disabled = true;
		btnDiv.value = "Please wait...";
	}
	$gxmlhttpRegistration.open("GET", $registrationUrlStr, true);
	$gxmlhttpRegistration.send(null);
	$gxmlhttpRegistration.onreadystatechange=(function stateChanged() 
	{ 
		if ($gxmlhttpRegistration.readyState==4) 
		{
			var lines = $gxmlhttpRegistration.responseText.split('|');
			if (lines && lines[0] && lines[1])
			{
				if (lines[0] == "true")
				{
					if (statusDiv)
						statusDiv.innerHTML = lines[1];
				}
				else
				{
					if (statusDiv)
						statusDiv.innerHTML = lines[1];
				}
				if (btnDiv)
				{
					btnDiv.disabled = false;
					if (lines[0] == "true")
					{
						btnDiv.mode = "close";
						btnDiv.value = "Close";
					}
					else
					{
						btnDiv.value = "I agree, create my account";
					}
				}
			}
		}
		else 
		{
			if (statusDiv)
				statusDiv.innerHTML = "Your request is in process, please wait...";
		}
	});
} //RegisterUser()

function ValidateRegInfo(regInfo)
{
	var statusDiv = document.getElementById("RegistrationStatusDiv");
	if (!regInfo)
	{
		if (statusDiv)
			statusDiv.innerHTML = "Please enter valid data";
		return false;
	}
	
	if (regInfo.firstName)
		regInfo.firstName = trim(regInfo.firstName);
	if (!regInfo.firstName || regInfo.firstName=="")
	{
		if (statusDiv)
			statusDiv.innerHTML = "Please enter your first name";
		return false;
	}
	
	if (regInfo.lastName)
		regInfo.lastName = trim(regInfo.lastName);
	if (!regInfo.lastName || regInfo.lastName=="")
	{
		if (statusDiv)
			statusDiv.innerHTML = "Please enter your last name";
		return false;
	}
	
	if (regInfo.userName)
		regInfo.userName = trim(regInfo.userName);
	if (!regInfo.userName || regInfo.userName=="")
	{
		if (statusDiv)
			statusDiv.innerHTML = "Please enter your username";
		return false;
	}
	
	if (regInfo.password)
		regInfo.password = trim(regInfo.password);
	if (!regInfo.password || regInfo.password=="")
	{
		if (statusDiv)
			statusDiv.innerHTML = "Please enter your password";
		return false;
	}
	
	if (regInfo.password2)
		regInfo.password2 = trim(regInfo.password2);
	if (!regInfo.password2 || regInfo.password2=="")
	{
		if (statusDiv)
			statusDiv.innerHTML = "Please re-enter your password";
		return false;
	}
	
	if (regInfo.email)
		regInfo.email = trim(regInfo.email);
	if (!regInfo.email || regInfo.email=="")
	{
		if (statusDiv)
			statusDiv.innerHTML = "Please enter your email";
		return false;
	}
	
	if (!checkEmail(regInfo.email))
	{
		if (statusDiv)
			statusDiv.innerHTML = "Please enter a valid email address";
		return false;
	}
	
	// now check if the password are same
	if (regInfo.password != regInfo.password2)
	{
		if (statusDiv)
			statusDiv.innerHTML = "Passwords did not match, please check.";
		return false;
	}
	return true;
} //ValidateRegInfo()

function checkEmail(emailVal) 
{
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailVal))
	{
		return true;
	}
	return false;
}


function onRegisterBtnClick()
{
	var btnDiv = document.getElementById("RegisterBtnDivID");
	if (btnDiv)
	{
		if (btnDiv.mode == "close")
		{
			if (g_regPanel)
				g_regPanel.Destroy();
			g_regPanel = null;
		}
		else //register
		{
			var regInfo = GetRegistrationInfo();
			if (ValidateRegInfo(regInfo) == false)
				return;
			RegisterUser(regInfo);
		}
	}
}

function centerRegistrationPanel()
{
	if (g_regPanel)
	{
		g_regPanel.CenterPanel();
	}
}

function onRegisterLink(divID)
{
	//parent.location='mailto:biblecloud@gmail.com?subject=Request for user registration&body=Please register a user-account for me in Cloud Study Bible. Here are my details:';
	//return;
	
	var loginBtnDiv = document.getElementById("loginBtn");
	if (loginBtnDiv)
	{
		var w = 525;
		var h = 450;
		if (isIE())
			h = 450;
		else if (isFirefox())
			h = 450;
		var l = Math.round((documentWidth()/2) - (w/2));
		var t = Math.round((documentHeight()/2) - (h/2));
		
		if (!g_regPanel)
		{
			g_regPanel = new CsbPanel("RegistrationPanel", true, true, "Registration", "This is to test the registration panel", l, t, w, h);
			var regPanelDiv = g_regPanel.GetDiv();		
			//document.body.appendChild(regPanelDiv);
			g_regPanel.panelBorderWidth = 12;
			g_regPanel.AddCloseButton();
			g_regPanel.Refresh();
			var contentDiv = g_regPanel.GetContentDiv();
			if (contentDiv)
			{
				attachRegistrationForm(contentDiv);
			}
		}
		else
		{
			g_regPanel.Show();
		}
		showLoginBox(0);
	}
}



function initLoginBox()
{
	var loginBoxDiv = document.getElementById($gloginBoxDiv);
	var loginBtnDiv = document.getElementById("loginBtn");
	var loginInfoDiv = document.getElementById("loginInfoDivID");
	var contentHeaderDiv = document.getElementById($gcontentHeaderDivID);
	
	if (loginBoxDiv && loginBtnDiv && loginInfoDiv && contentHeaderDiv)
	{
		loginBoxDiv.style.position = "absolute";
		loginBoxDiv.style.width = "280px";
		loginBoxDiv.style.height = "215px";
		if (isIE())
			loginBoxDiv.style.top = ((loginBtnDiv.offsetTop + loginBtnDiv.offsetHeight)) + "px";
		else
			loginBoxDiv.style.top = ((loginBtnDiv.offsetTop + loginBtnDiv.offsetHeight) + 3) + "px";
		if (isIE())
			loginBoxDiv.style.right = (document.body.clientWidth - (loginBtnDiv.offsetLeft + loginBtnDiv.offsetWidth) - 6) + "px";
		else
			loginBoxDiv.style.right = (document.body.clientWidth - (loginBtnDiv.offsetLeft + loginBtnDiv.offsetWidth) - 6) + "px";
		loginBoxDiv.style.zIndex = "1";
		loginBoxDiv.style.borderStyle = "solid";
		loginBoxDiv.style.borderWidth = "5px";
		loginBoxDiv.style.borderColor = "#27507a";
		loginBoxDiv.style.backgroundColor = "#ffffff";
		loginBoxDiv.style.paddingTop = "10px"; //remove after adding buttons and text boxes
		loginBoxDiv.style.paddingLeft = "15px"; //remove after adding buttons and text boxes
		loginBoxDiv.style.paddingRight = "15px"; //remove after adding buttons and text boxes
		//loginBoxDiv.innerHTML = "<p> Please enter your login details: </p>";
		loginBoxDiv.style.visibility = "hidden";
		//loginBoxDiv.style.display = "block";
		
		// Login error div
		//loginBoxDiv.innerHTML += "<div id=\"loginErrorDivID\" style=\"color:#ff1111; position:absolute; padding-top:10em; font-size:10px;\"> </div>";
		
		$gloginBoxVisible = 0;
			
	}
} //initLoginBox()

function loadImagesToCache()
{
	$gSocialButtonNormal = new Image();
	
	$gBackButtonNormal = new Image();
	$gBackButtonPressed = new Image();
	$gForwardButtonNormal = new Image();
	$gForwardButtonPressed = new Image();
	$gHistoryButtonNormal = new Image();
	
	$gmaxButton = new Image();
	$gmaxButtonDown = new Image();
	$gminButton = new Image();
	$gminButtonDown = new Image();
	//$gguestBookButton = new Image();
	//$gguestBookButtonDown = new Image();
	$gcloseBtn = new Image();
	$gcloseBtnDown = new Image();
	$gArrowBtnLeft = new Image();
	$gArrowBtnTop = new Image();
	
	$gCommentNormal = new Image();
	$gCommentAdd = new Image();
	$gCommentShowNormal = new Image();
	$gCommentShowMouseOver = new Image();
	
	$gArrowUp = new Image();
	$gArrowDown = new Image();
	
	$gFacebookLogoImg = new Image();
	$gTwitterLogoSmallImg = new Image();
	$gGooglePlusLogoImg = new Image();
	

	// load buttons before hand
	//$gArrowUp.src = "images/arrow_up.png";
	//$gArrowDown.src = "images/arrow_down.png";
	
	$gSocialButtonNormal.src = "themes/social.png";
	
	$gBackButtonNormal.src = "themes/" + $g_theme + "/back.png";
	$gBackButtonPressed.src = "themes/" + $g_theme + "/back_down.png";
	$gForwardButtonNormal.src = "themes/" + $g_theme + "/forward.png";
	$gForwardButtonPressed.src = "themes/" + $g_theme + "/forward_down.png";
	$gHistoryButtonNormal.src = "themes/" + $g_theme + "/history.png";
	
	$gmaxButton.src = "themes/" + $g_theme + "/maximize.png";
	$gmaxButtonDown.src = "themes/" + $g_theme + "/maximize_down.png";
	$gminButton.src = "themes/" + $g_theme + "/minimize.png";
	$gminButtonDown.src = "themes/" + $g_theme + "/minimize_down.png";
	//$gguestBookButton.src = "themes/" + $g_theme + "/guestbook_normal.png";
	//$gguestBookButtonDown.src = "themes/" + $g_theme + "/guestbook_pressed.png";
	$gcloseBtn.src = "themes/" + $g_theme + "/close_normal.png";
	$gcloseBtnDown.src = "themes/" + $g_theme + "/close_pressed.png";
	$gArrowBtnLeft.src = "themes/" + $g_theme + "/arrow_left.png";
	$gArrowBtnTop.src = "themes/" + $g_theme + "/arrow_top.png";
	
	$gCommentNormal.src = "biblejs/images/comments_normal_small.png";
	$gCommentAdd.src = "biblejs/images/comments_add_small.png";
	$gCommentShowNormal.src = "biblejs/images/comments_show_small.png";
	$gCommentShowMouseOver.src = "biblejs/images/comments_show_mouseover_small.png";
	
	$gFacebookLogoImg.src = "biblejs/images/f_logo.png";
	$gTwitterLogoSmallImg.src = "http://twitter-badges.s3.amazonaws.com/t_small-a.png";
	$gGooglePlusLogoImg.src = "biblejs/images/gplus-64.png";
} //loadImagesToCache()

function UpdateCommentDiv(divID, imagePath, commentCount, color)
{
	var div = document.getElementById(divID);
	if (div)
	{
		var imgHTML = "<img src=\"" + imagePath + "\"></img>";
		var commentSpanHTML = "<span style=\"position:relative; left:-14px; top:-5px; font-size:9px; font-weight:bold; color:" + color + ";\">" + commentCount + "</span>";
		div.innerHTML = imgHTML + commentSpanHTML;
	}
	//<img src=\"biblejs/images/comments_show_small.png\"> </img> <span style=\"position:relative; left:-18px; top:-6px; font-size:9px; font-weight:bold; color:#ffffff;\">$rowCountComments</span>
} //UpdateCommentDiv()

function ChangeBackgroundImage(divID, imagePath)
{
	var div = document.getElementById(divID);
	if (div)
	{
		div.style.backgroundImage = "url(" + imagePath + ")";
	}
} //ChangeBackgroundImage()

function mouseOverMaxBtn()
{
	document.getElementById("maxBtnImg").style.cursor = "pointer";
}

function mouseOutMaxBtn()
{
	document.getElementById("maxBtnImg").style.cursor = "default";
}

function mouseDownMaxBtn()
{
	setMaxButton($gIsMaximized?0:1, 1);
}

function mouseUpMaxBtn()
{
	$gIsMaximized = $gIsMaximized?0:1;
	setMaxButton($gIsMaximized?0:1, 0);
	adjustLayout();
}

function isMaximized()
{
	if ($gIsMaximized)
		return true;
	else
		return false;
}

function onMaxBtnCick()
{
	
}

function setMaxButton(max, down)
{
	onDocumentClick(window.event); //to close other boxes (like login, social and guestbook)
	
	if ($gMaximizeBtnDiv != "")
	{
		//var mouseOverEventStr = "onMouseOver=\"javascript:mouseOverMaxBtn();\" ";
		//var mouseOutEventStr = "onMouseOut=\"javascript:mouseOutMaxBtn();\" ";
		var mouseOverEventStr = " ";
		var mouseOutEventStr = " ";
		var mouseDownEventStr = "onmousedown=\"javascript:mouseDownMaxBtn();\" ";
		var mouseUpEventStr = "onmouseup=\"javascript:mouseUpMaxBtn();\" ";
		var htmlText = "";
		if (max)
		{
			if (down)
				htmlText = "<div id=\"maxBtn\" style=\"position:relative; float:right; align:right; padding-top:.5em; padding-right:.5em;\"" + mouseOverEventStr + " " + mouseOutEventStr + " " + mouseDownEventStr + " " + mouseUpEventStr + " > <img id=\"maxBtnImg\" src=\"themes/" + $g_theme + "/maximize_down.png\" ondragstart=\"return false;\"> </div>";
			else
				htmlText = "<div id=\"maxBtn\" style=\"position:relative; float:right; align:right; padding-top:.5em; padding-right:.5em;\"" + mouseOverEventStr + " " + mouseOutEventStr + " " + mouseDownEventStr + " " + mouseUpEventStr + " > <img id=\"maxBtnImg\" src=\"themes/" + $g_theme + "/maximize.png\" ondragstart=\"return false;\"> </div>";
		}
		else
		{
			if (down)
				htmlText = "<div id=\"maxBtn\" style=\"position:relative; float:right; align:right; padding-top:.5em; padding-right:.5em;\"" + mouseOverEventStr + " " + mouseOutEventStr + " " + mouseDownEventStr + " " + mouseUpEventStr + " > <img id=\"maxBtnImg\" src=\"themes/" + $g_theme + "/minimize_down.png\" ondragstart=\"return false;\"> </div>";
			else
				htmlText = "<div id=\"maxBtn\" style=\"position:relative; float:right; align:right; padding-top:.5em; padding-right:.5em;\"" + mouseOverEventStr + " " + mouseOutEventStr + " " + mouseDownEventStr + " " + mouseUpEventStr + " > <img id=\"maxBtnImg\" src=\"themes/" + $g_theme + "/minimize.png\" ondragstart=\"return false;\"> </div>";
		}
		var maxBtnDiv = document.getElementById($gMaximizeBtnDiv);
		if (maxBtnDiv)
			maxBtnDiv.innerHTML = htmlText;
		//if (maxBtnDiv.parentNode)
		//	maxBtnDiv.parentNode.ondblclick = mouseUpMaxBtn;
	}
}


function RefreshLoginButton(showBoxIfNotloggedIn, clearError)
{
	var loginButtonDiv = document.getElementById("loginBtn");
	var loginBoxDiv = document.getElementById($gloginBoxDiv);
	var loginInfoDiv = document.getElementById("loginInfoDivID");
	if (loginBoxDiv && loginButtonDiv && loginInfoDiv)
	{
		if (isLoggedIn())
		{
			var fullname = getFullName();
			loginInfoDiv.innerHTML = fullname;
			//loginButtonDiv.innerHTML = "<img id=\"loginBtnImg\" src=\"themes/" + $g_theme + "/signout.png\">";
			loginButtonDiv.innerHTML = "Logout";
			loginButtonDiv.setAttribute("class", "popupbutton");
			loginBoxDiv.style.visibility = "hidden";
			$gloginBoxVisible = 0;
		}
		else
		{
			if (clearError)
				clearLoginError();
			loginInfoDiv.innerHTML = "Not logged in";
			if (showBoxIfNotloggedIn)
			{
				//loginButtonDiv.innerHTML = "<img id=\"loginBtnImg\" src=\"themes/" + $g_theme + "/signin_selected.png\">";
				loginButtonDiv.innerHTML = "Login &nbsp;&nbsp; &#9650;";
				loginBoxDiv.style.visibility = "visible";
				loginButtonDiv.setAttribute("class", "poppedupbutton");
				$gloginBoxVisible = 1;
			}
			else
			{
				//loginButtonDiv.innerHTML = "<img id=\"loginBtnImg\" src=\"themes/" + $g_theme + "/signin_normal.png\">";
				loginButtonDiv.innerHTML = "Login &nbsp;&nbsp; &#9660;";
				loginBoxDiv.style.visibility = "hidden";
				loginButtonDiv.setAttribute("class", "popupbutton");
				$gloginBoxVisible = 0;
			}
		}
	}
}

function showLoginBox(show)
{
	var loginButtonDiv = document.getElementById("loginBtn");
	var loginBoxDiv = document.getElementById($gloginBoxDiv);
	if (loginBoxDiv && loginButtonDiv)
	{
		clearLoginError();
		if (show)
		{
			loginButtonDiv.setAttribute("class", "poppedupbutton");
			// hide if registration box is visible
			if (g_regPanel)
			{
				g_regPanel.Hide();
			}
			
			initLoginBox();
			loginBoxDiv.style.visibility = "visible";
			
			var finalHeight = loginBoxDiv.style.height;
			loginBoxDiv.style.height = "5px";
			$('#'+$gloginBoxDiv).animate({
			    opacity: 1,
			    height: '+=50',
			    height: finalHeight
			  }, 200, function() {
				$gloginBoxVisible = 1;
				loginBoxDiv.style.height = finalHeight;
				var loginButtonDiv2 = document.getElementById("loginBtn");
				loginButtonDiv2.innerHTML = "Login &nbsp;&nbsp; &#9650;";
			  });
		}
		else
		{
			loginButtonDiv.setAttribute("class", "popupbutton");
			if (loginBoxDiv.style.visibility != "hidden")
			{
				$('#'+$gloginBoxDiv).animate({
					opacity: 1,
					height: '-=50',
					height: 'hide'
				  }, 200, function() {
					loginBoxDiv.style.visibility = "hidden";
					$gloginBoxVisible = 0;
					var loginButtonDiv2 = document.getElementById("loginBtn");
					loginButtonDiv2.innerHTML = "Login &nbsp;&nbsp; &#9660;";
				  });
			}
		}
	}
} //showLoginBox()

function toggleLoginButton()
{
	if ($gloginBoxVisible == 1)
		showLoginBox(0);
	else
		showLoginBox(1);
}

function mouseOverLoginBtn()
{
	document.getElementById($gloginButtonDivID).style.cursor = "pointer";
}
function mouseOutLoginBtn()
{
	document.getElementById($gloginButtonDivID).style.cursor = "default";
}

function ShowRegistrationLine(show)
{
	var registrationLineDiv = document.getElementById($gregistrationLineDivID);
	if (registrationLineDiv)
	{
		if (show == true)
			registrationLineDiv.style.visibility = "visible";
		else
			registrationLineDiv.style.visibility = "hidden";
	}
}

function onLoginBtnCick()
{
	gClickedOn = 1; //1=login, 2=guestbook, 3=socialbox, 4=chapterbox, 5=historybox
	if (isLoggedIn())
	{
		logout();
		DeleteUserPassword();
		RefreshLoginButton(false, true);
	}
	else
	{
		toggleLoginButton();
	}
	ShowRegistrationLine(true);
}

// Now the google+ button loads asynchronously
function loadGooglePlusOneButton()
{
	var plusOneBtnDiv = document.getElementById($gPlusOneBtnDivID);
	if (plusOneBtnDiv)
	{
		var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		po.src = 'https://apis.google.com/js/plusone.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		plusOneBtnDiv.innerHTML = "<g:plusone size='medium'></g:plusone>";
	}
} //loadGooglePlusOneButton()

function loadGooglePlusOnePageButton()
{	
	var googlePlusPageBtnDiv = document.getElementById($gPlusOnePageBtnDivID);
	if (googlePlusPageBtnDiv)
	{
		googlePlusPageBtnDiv.innerHTML = "";
		var gplusHtmlText = "<img src=\"" + $gGooglePlusLogoImg.src + "\" width=\"19\" height=\"19\" title=\"Find us on Google Plus\" style=\"padding-top:0px; border:none;\"/>";
		googlePlusPageBtnDiv.innerHTML = gplusHtmlText;
		googlePlusPageBtnDiv.style.position="relative";
		googlePlusPageBtnDiv.style.top = "0px";
		googlePlusPageBtnDiv.style.float="right";
		googlePlusPageBtnDiv.onmouseover = (function() {this.style.cursor = 'pointer';});
		googlePlusPageBtnDiv.onclick = (function() {window.open('https://plus.google.com/112809829667475384305/', 'newwindow');});
	}
} //loadGooglePlusOnePageButton()


function loadFacebookButton()
{
	var facebookBtnDiv = document.getElementById($gFacebookBtnDivID);
	if (facebookBtnDiv)
	{
		facebookBtnDiv.setAttribute("style", "position:relative; margin-left:1em; top:5px;");
		facebookBtnDiv.innerHTML = "";
		var fbHtmlText = "<iframe src=\"http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fcloudstudybible.com&width=60&height=21&colorscheme=light&layout=button_count&action=like&show_faces=true&send=false&appId=218017298331022\" scrolling=\"no\" frameborder=\"0\" style=\"border:1px; overflow:hidden; width:80px; height:20px;\" allowTransparency=\"true\"></iframe>";
		facebookBtnDiv.innerHTML = fbHtmlText;
		facebookBtnDiv.style.left = "-16px";
	}
} //loadFacebookButton()

function loadFacebookPageButton()
{	
	var facebookPageBtnDiv = document.getElementById($gFacebookPageBtnDivID);
	if (facebookPageBtnDiv)
	{
		//facebookPageBtnDiv.setAttribute("style", "position:relative; float:right;");
		facebookPageBtnDiv.innerHTML = "";
		var fbPageHtmlText = "<img src=\"" + $gFacebookLogoImg.src + "\" width=\"19\" height=\"19\" title=\"Become our fan on Facebook\" style=\"padding-top:2px; border:none;\"/>";
		facebookPageBtnDiv.innerHTML = fbPageHtmlText;
		facebookPageBtnDiv.style.position="relative";
		facebookPageBtnDiv.style.top = "3px";
		facebookPageBtnDiv.style.float="right";
		facebookPageBtnDiv.onmouseover = (function() {this.style.cursor = 'pointer';});
		facebookPageBtnDiv.onclick = (function() {window.open('http://www.facebook.com/apps/application.php?id=198206686856112', 'newwindow');});
	}
} //loadFacebookPageButton()

function loadDiggScript()
{
	if (gEnableDigg == true) 
	{
		var s = document.createElement('SCRIPT'), s1 = document.getElementsByTagName('SCRIPT')[0];
		s.type = 'text/javascript';
		s.async = true;
		s.src = 'http://widgets.digg.com/buttons.js';
		s1.parentNode.insertBefore(s, s1);
	}
} //loadDiggScript()

function loadDiggButton()
{
	var diggDiv = document.getElementById($gDiggDivID);
	var diggBtnDiv = document.getElementById($gDiggBtnDivID);
	if (diggDiv && diggBtnDiv)
	{
		if (gEnableDigg == true)
		{
			diggBtnDiv.setAttribute("style", "position:relative; margin-left:1em; top:-2px;");
			diggBtnDiv.innerHTML = "";
			var diggAnchor = document.createElement('a');
			diggAnchor.setAttribute("class", "DiggThisButton DiggCompact");
			diggBtnDiv.appendChild(diggAnchor);
			diggBtnDiv.style.left = "-13px";
			diggBtnDiv.style.top = "4px";
		}
		else
		{
			diggDiv.style.display = "none";
		}
	}
} //loadDiggButton()

function loadStumbleuponScript()
{
	var li = document.createElement('script'); li.type = 'text/javascript'; li.async = true;
    li.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + '//platform.stumbleupon.com/1/widgets.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(li, s);
} //loadStumbleuponScript()

function loadStumbleuponButton()
{
	/* 
	 The dynamic loading is not working for some reason.
	 So added in html, so do nothing here (until we fix 
	 it here and remove from html)
	*/
	/*
	var stumbleuponBtnDiv = document.getElementById($gStumbleuponBtnDivID);
	if (stumbleuponBtnDiv)
	{
		var su = document.createElement('su:badge');
		su.setAttribute("layout", "1");

		// Clear previous divs (if any)
		//ClearContent($gStumbleuponBtnDivID);

		// Now add
		stumbleuponBtnDiv.appendChild(su);
	}
	*/
} //loadStumbleuponButton()

function loadGoogleBuzzButton()
{
	var googleBuzzDiv = document.getElementById($gGoogleBtnDivID);
	if (googleBuzzDiv)
	{
		googleBuzzDiv.setAttribute("style", "position:relative; margin-left:1em; top:-1px;");
		googleBuzzDiv.innerHTML = "";
		
		var googleBuzzAnchor = document.createElement('a');
		googleBuzzAnchor.setAttribute("title", "Post on Google Buzz");
		googleBuzzAnchor.setAttribute("class", "google-buzz-button");
		googleBuzzAnchor.setAttribute("href", "http://www.google.com/buzz/post");
		googleBuzzAnchor.setAttribute("data-button-style", "small-count");
		googleBuzzAnchor.setAttribute("data-message", "Check this cool Study Bible on the cloud!");
		googleBuzzAnchor.setAttribute("data-url", "http://www.cloudstudybible.com");
		googleBuzzAnchor.setAttribute("data-imageurl", "http://www.cloudstudybible.com/images/CloudBible_Transparent.png");
		googleBuzzAnchor.innerHTML = "Buzz";
		
		var googleBuzzScript = document.createElement("script");
		googleBuzzScript.type = "text/javascript";
		googleBuzzScript.async = true;
		googleBuzzScript.src = "http://www.google.com/buzz/api/button.js";
		
		googleBuzzDiv.appendChild(googleBuzzAnchor);
		googleBuzzDiv.appendChild(googleBuzzScript);
		
		googleBuzzDiv.style.left = "-13px";
		googleBuzzDiv.style.top = "0px";
	}
} //loadGoogleBuzzButton()

function loadTweetButton()
{
	var tweetDiv = document.getElementById($gTweetBtnDivID);
	if (tweetDiv)
	{
		tweetDiv.setAttribute("style", "position:relative; margin-left:1em; top:4px;");
		tweetDiv.innerHTML = "";
		
		var tweetAnchor = document.createElement('a');
		tweetAnchor.setAttribute("href", "http://twitter.com/share");
		tweetAnchor.setAttribute("class", "twitter-share-button");
		tweetAnchor.setAttribute("data-url", "http://www.cloudstudybible.com");
		tweetAnchor.setAttribute("data-text", "Check this cool Study Bible on the cloud!");
		tweetAnchor.setAttribute("data-count", "horizontal");
		tweetAnchor.setAttribute("data-via", "http://twitter.com/cloudstudybible");
		tweetAnchor.innerHTML = "Tweet";
		
		var tweetScript = document.createElement("script");
		tweetScript.type = "text/javascript";
		tweetScript.async = true;
		tweetScript.src = "http://platform.twitter.com/widgets.js";
		
		tweetDiv.appendChild(tweetAnchor);
		tweetDiv.appendChild(tweetScript);
		tweetDiv.style.left = "-13px";
		tweetDiv.style.top = "2px";
	}
} //loadTweetButton()

function loadTwitterButton()
{	
	var twitterBtnDiv = document.getElementById($gTwitterBtnDivID);
	if (twitterBtnDiv)
	{
		//twitterBtnDiv.setAttribute("style", "position:relative; float:right;");
		twitterBtnDiv.innerHTML = "";
		var twitterHtmlText = "<img src=\"" + $gTwitterLogoSmallImg.src + "\" width=\"19\" height=\"19\" title=\"Follow Cloud Study Bible on Twitter\" style=\"padding-top:2px; border:none;\"/>";
		twitterBtnDiv.innerHTML = twitterHtmlText;
		twitterBtnDiv.style.position="relative";
		twitterBtnDiv.style.top = "3px";
		twitterBtnDiv.style.float="right";
		twitterBtnDiv.onmouseover = (function() {this.style.cursor = 'pointer';});
		twitterBtnDiv.onclick = (function() {window.open('http://www.twitter.com/cloudstudybible', 'newwindow');});
	}
} //loadTwitterButton()


function loadSocialButtons()
{
	if ($gSocialButtonsLoaded == false)
	{
		loadTwitterButton();
		loadTweetButton();
		//loadGoogleBuzzButton();
		loadDiggButton();
		loadStumbleuponButton();
		loadFacebookButton();
		loadFacebookPageButton();
		loadGooglePlusOneButton();
		loadGooglePlusOnePageButton();
		$gSocialButtonsLoaded = true;
	}
}


function ClearVerses()

{

	var elem = document.getElementById($gversesDivID);

	while(elem.firstChild)

	{

		elem.removeChild(elem.firstChild);

	}

}

function ClearVersesAsv()
{
	elem = document.getElementById($gversesDivIDASV);
	while(elem.firstChild)
	{
		elem.removeChild(elem.firstChild);
	}
}


// Removes sub elements
function ClearContent(divID)

{

	var elem = document.getElementById(divID);

	while(elem.firstChild)

	{

		elem.removeChild(elem.firstChild);

	}

}



function ShowProgress(divID)
{
	document.getElementById(divID).style.backgroundImage  = 'url(images/progress.gif)';

	document.getElementById(divID).style.backgroundRepeat = 'no-repeat';

	document.getElementById(divID).style.backgroundPosition = 'center center';

	document.getElementById(divID).innerHTML  = "<p><b>Loading...</b></p>";
}

function HideProgress(divID) 

{

	document.getElementById(divID).style.backgroundImage  = 'none';

} //HideProgress()


function ShowProgressOnVerses()

{

	document.getElementById($gversesDivID).style.backgroundImage  = 'url(images/progress.gif)';

	document.getElementById($gversesDivID).style.backgroundRepeat = 'no-repeat';

	document.getElementById($gversesDivID).style.backgroundPosition = 'center center';

	document.getElementById($gversesDivID).innerHTML  = "<p><b>Loading KJV...</b></p>";

}

function ShowProgressOnVersesAsv()
{
	document.getElementById($gversesDivIDASV).style.backgroundImage  = 'url(images/progress.gif)';
	document.getElementById($gversesDivIDASV).style.backgroundRepeat = 'no-repeat';
	document.getElementById($gversesDivIDASV).style.backgroundPosition = 'center center';
	document.getElementById($gversesDivIDASV).innerHTML  = "<p><b>Loading ASV...</b></p>";
}


function HideProgressOnVerses() 

{

	document.getElementById($gversesDivID).style.backgroundImage  = 'none';
} //HideProgressOnVerses()

function HideProgressOnVersesAsv() 
{
	document.getElementById($gversesDivIDASV).style.backgroundImage  = 'none';
} //HideProgressOnVersesAsv()





function ShowProgressOnBooks()

{
	var booksDiv = document.getElementById($gbooksDivID);
	if (booksDiv)
	{

		document.getElementById($gbooksDivID).style.backgroundImage  = 'url(images/progress_small.gif)';

		document.getElementById($gbooksDivID).style.backgroundRepeat = 'no-repeat';

		document.getElementById($gbooksDivID).style.backgroundPosition = 'center center';
		SetInnerHTML(document.getElementById($gbooksDivID), "<p><b>Loading...</b></p>");
		//document.getElementById($gbooksDivID).innerHTML  = AddSelectIfIE("<p><b>Loading...</b></p>");
	}

}

function HideProgressOnBooks() 

{

	document.getElementById($gbooksDivID).style.backgroundImage  = 'none';

} //HideProgressOnBooks()







function ShowProgressOnChapters()

{

	document.getElementById($gchaptersDivID).style.backgroundImage  = 'url(images/progress_small.gif)';

	document.getElementById($gchaptersDivID).style.backgroundRepeat = 'no-repeat';

	document.getElementById($gchaptersDivID).style.backgroundPosition = 'center center';
	SetInnerHTML(document.getElementById($gchaptersDivID), "<p><b>Loading...</b></p>");

	//document.getElementById($gchaptersDivID).innerHTML  = AddSelectIfIE("<p><b>Loading...</b></p>");

}

function HideProgressOnChapters() 

{

	document.getElementById($gchaptersDivID).style.backgroundImage  = 'none';

} //HideProgressOnChapters()





// searchBible:

function searchBible(searchText, searchTabBarID, searchContentDivID)

{

	if (window.XMLHttpRequest)

	{

		// code for IE7+, Firefox, Chrome, Opera, Safari

		$gxmlhttpSearch =new XMLHttpRequest();

	}

	else

	{

		// code for IE6, IE5

		$gxmlhttpSearch =new ActiveXObject("Microsoft.XMLHTTP");

	}
	
	document.getElementById(searchTabBarID).style.visibility = "visible";
	ClearContent(searchContentDivID);
	if ($gcontentTabs != null)
		$gcontentTabs.tabs('select', searchTabBarID);
	

	$searchUrlStr = "./biblejs/search.php?s=" + searchText;

	$gxmlhttpSearch.open("GET",$searchUrlStr,true);

	$gxmlhttpSearch.send(null);

		

	$gxmlhttpSearch.onreadystatechange=(function stateChanged() { 

		if ($gxmlhttpSearch.readyState==4) {
			$gcontentTabs.tabs('select', searchTabBarID);

			HideProgress(searchContentDivID);

			document.getElementById(searchContentDivID).innerHTML = $gxmlhttpSearch.responseText;

			document.getElementById(searchContentDivID).scrollTop = 0;
			document.getElementById(searchContentDivID).style.autoScroll = "true";
			document.getElementById(searchContentDivID).style.overflow = "auto";

			//document.getElementById(searchTabBarID).innerHTML = "<b> Search Results </b>";

		}

		else {
			$gcontentTabs.tabs('select', searchTabBarID);
			ShowProgress(searchContentDivID);

			//document.getElementById(searchTabBarID).innerHTML = "<b>" + "Searching... </b>";

		}

	});



} //searchBible()



function loadCurrentChapter() {

    if ($gcurrentVerseNumber == 0)

        $gcurrentVerseNumber = 1;

    loadVerses($gcurrentBookName, $gcurrentBookID, $gcurrentChapterNumber, 1, $gcurrentVerseNumber, 0, true);

    scrollToBook($gcurrentBookID);

    scrollToChapter($gcurrentChapterNumber);

} //loadCurrentChapter()


// TODO: Change goToVerse calling (I added chapterCount param)
function goToVerse(bookName, bookID, chapterNumber, verseNumber, from) {

	if (g_updatesPanel)
		g_updatesPanel.Hide();
	//var chapterCount = $gBookChapterCountArray[bookID];
    //loadBookChapterNumbers(bookID, bookName, chapterCount, 1, chapterNumber, verseNumber, from);
    loadBookChapterNumbers(bookID, bookName, 1, chapterNumber, verseNumber, from);
    scrollToBook(bookID);
    scrollToChapter(chapterNumber);

} //GoToVerse()



function scrollToBook(bookID) {

    $bookDivTop = document.getElementById("bookId" + bookID).offsetTop;

    $bookDivHeight = document.getElementById("bookId" + bookID).offsetHeight;

    document.getElementById($gbooksDivID).scrollTop = $bookDivTop - ($bookDivHeight * 2);

} //scrollToBook()



function scrollToChapter(chapterID) 
{
	var chapterDiv = document.getElementById(chapterID);
	var chaptersDiv = document.getElementById($gchaptersDivID);
	
	if (chapterDiv && chaptersDiv)
	{
		$chapterDivTop = chapterDiv.offsetTop;
		$chapterDivHeight = chapterDiv.offsetHeight;
		chaptersDiv.scrollTop = $chapterDivTop - ($chapterDivHeight * 2);
	}
} //scrollToChapter()



function scrollToVerse(verseNumber) {

    $verseDivID = "kjvVerseId" + verseNumber;
	var verseDiv = document.getElementById($verseDivID);
	var versesDiv = document.getElementById($gversesDivID);
	if (verseDiv && versesDiv)
	{
		$verseDivTop = verseDiv.offsetTop;
		$verseDivHeight = verseDiv.offsetHeight;
		if ($verseDivHeight > 0)
		{
			versesDiv.scrollTop = $verseDivTop - ($verseDivHeight/2); //search added to the content div
		}
	}

} //scrollToVerse()

function scrollToVerseAsv(verseNumber) {
    $verseDivID = "asvVerseId" + verseNumber;
	var verseDiv = document.getElementById($verseDivID);
	var versesDiv = document.getElementById($gversesDivIDASV);
	if (verseDiv && versesDiv)
	{
		$verseDivTop = verseDiv.offsetTop;
		$verseDivHeight = verseDiv.offsetHeight;
		// TODO: See if we need to have seperate verse Ids for different translations.
		if ($verseDivHeight > 0)
			versesDiv.scrollTop = $verseDivTop - ($verseDivHeight/2); //search added to the content div
	}
} //scrollToVerseAsv()


// Prevent tab from scrolling to top on selection.
function onTabShow(event, ui)
{
	if (ui.tab.id == "kjvTabId")
	{
		var kjvTabContentDiv = document.getElementById($gversesDivID);
		if (kjvTabContentDiv)
			kjvTabContentDiv.scrollTop = gTabScrollPosKjvY;
	}
	else if (ui.tab.id == "asvTabId")
	{
		var asvTabContentDiv = document.getElementById($gversesDivIDASV);
		if (asvTabContentDiv)
			asvTabContentDiv.scrollTop = gTabScrollPosAsvY;
	}
	else if (ui.tab.id == "searchTabId")
	{
		var searchTabContentDiv = document.getElementById("searchContent");
		if (searchTabContentDiv)
			searchTabContentDiv.scrollTop = gTabScrollPosSearchY;
	}
	return true;
} //onTabShow()

// loadVersesAsv: scrollToDiv is sent by "genchapter.php". Rest of the calls ignore this parameter
function loadVersesAsv(bookName, bookID, chapterNumber, scrollToDiv, scrollToVerseID, from)
{
	$gcurrentBookName = bookName;
	$gcurrentBookID = bookID;
	$gcurrentChapterNumber = chapterNumber;
	$gcurrentVerseNumber = scrollToVerseID;

	if ($gcurrentChapterNumber <= 0)
	    $gcurrentChapterNumber = 1;

	if ($gcurrentVerseNumber <= 0)
	    $gcurrentVerseNumber = 1;
	
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		$gxmlhttpVerses =new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		$gxmlhttpVerses =new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	if ($gcontentTabs != null)
		$gcontentTabs.tabs('select', 0);
	
	$chapterUrlStr = "./biblejs/getchapterasv.php?b=" + $gcurrentBookID + "&c=" + $gcurrentChapterNumber + "";
	$gxmlhttpVerses.open("GET",$chapterUrlStr,true);
	$gxmlhttpVerses.send(null);
	
	$gxmlhttpVerses.onreadystatechange=(function stateChanged() { 
		if ($gxmlhttpVerses.readyState==4) {
			HideProgressOnBooks();
			HideProgressOnChapters();
			HideProgressOnVersesAsv();
			
			document.getElementById($gversesDivIDASV).innerHTML = $gxmlhttpVerses.responseText;
			document.getElementById($gversesDivIDASV).scrollTop = 0;
			document.getElementById($gversesDivIDASV).style.autoScroll = "true";
			document.getElementById($gversesDivIDASV).style.overflow = "auto";
			document.getElementById($gcontentHeaderDivIDASV).innerHTML = "<b>" + $gcurrentBookName + " " + $gcurrentChapterNumber + "</b>";

			if (scrollToDiv == 1) {
			    scrollToChapter($gcurrentChapterNumber);
			}
			
			// Clear previous verse div ids
			$gprevVerseClicked = "";
			selectBookAndChapter(bookID, $gcurrentChapterNumber);

			$gcurrentVerseNumber = scrollToVerseID;
			if ($gcurrentVerseNumber>1)
			{
				scrollToVerse($gcurrentVerseNumber);
				if (from != 0)
					blinkVerse($verseDivID);
			}
			else
			{
				// Scroll to last scroll position (from cookie)
				var asvTabContentDiv = document.getElementById($gversesDivIDASV);
				if (asvTabContentDiv)
					asvTabContentDiv.scrollTop = gTabScrollPosAsvY;
			}
			if ($gcurrentVerseNumber < 1)
				$gcurrentVerseNumber = 1;
			loadSocialButtons();
		}
		else {
			ClearVersesAsv();
			ShowProgressOnVersesAsv();
			if ($gcurrentChapterNumber == 0) {
				document.getElementById($gcontentHeaderDivIDASV).innerHTML = "<b>" + "Loading " + $gcurrentBookName + "..." + "</b>";
				$gcurrentChapterNumber = 1;
			}
			else { 
				document.getElementById($gcontentHeaderDivIDASV).innerHTML = "<b>" + "Loading " + $gcurrentBookName + " " + $gcurrentChapterNumber + "..." + "</b>";
			}
		}
	});

} //loadVersesAsv()


// loadVerses: scrollToDiv is sent by "genchapter.php". Rest of the calls ignore this parameter


function loadVerses(bookName, bookID, chapterNumber, scrollToDiv, scrollToVerseID, from, addToHistory)
{
	if ($gcontentTabs != null)
		$gcontentTabs.tabs('select', 0);
	
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		$gxmlhttpVerses =new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		$gxmlhttpVerses =new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	$gcurrentBookName = bookName;
	$gcurrentBookID = bookID;
	$gcurrentChapterNumber = chapterNumber;
	$gcurrentVerseNumber = scrollToVerseID;
	if ($gcurrentChapterNumber <= 0)
	    $gcurrentChapterNumber = 1;
	if ($gcurrentVerseNumber <= 0)
	    $gcurrentVerseNumber = 1;
	
	if (addToHistory==true && gFirstTimeLoading==false)
	{
		gBrowsingHistory.DeleteHistoryAfterCurrent();
		gBrowsingHistory.Add($gcurrentBookName, $gcurrentBookID, $gcurrentChapterNumber, $gcurrentVerseNumber, true);
	}
	SaveBrowsingHistory(gBrowsingHistory);
	gFirstTimeLoading = false;
	
	$chapterUrlStr = "";
	if (isLoggedIn())
	{
		$chapterUrlStr = "./biblejs/getchapter.php?b=" + $gcurrentBookID + "&c=" + $gcurrentChapterNumber + "&uname=" + gUsername + "&ub=" + $gcurrentBookID + "&uc=" + $gcurrentChapterNumber + "&uv=" + scrollToVerseID;
	}
	else
	{
		$chapterUrlStr = "./biblejs/getchapter.php?b=" + $gcurrentBookID + "&c=" + $gcurrentChapterNumber + "";
	}
	
	// Save position
	SaveCurrentPosition($gcurrentBookID, $gcurrentChapterNumber, scrollToVerseID);
	
	$gxmlhttpVerses.open("GET",$chapterUrlStr,true);
	$gxmlhttpVerses.send(null);
	
	$gxmlhttpVerses.onreadystatechange=(function stateChanged() 
	{ 
		if ($gxmlhttpVerses.readyState==4) 
		{
			HideProgressOnBooks();
			HideProgressOnChapters();
			HideProgressOnVerses();
			document.getElementById($gversesDivID).innerHTML = $gxmlhttpVerses.responseText;
			document.getElementById($gversesDivID).scrollTop = 0;
			document.getElementById($gcontentHeaderDivID).innerHTML = "<b>" + $gcurrentBookName + " " + $gcurrentChapterNumber + "</b>";

			if (scrollToDiv == 1) {
			    scrollToChapter($gcurrentChapterNumber);
			}
			
			// Clear previous verse div ids
			$gprevVerseClicked = "";
			selectBookAndChapter(bookID, $gcurrentChapterNumber);
			$gcurrentVerseNumber = scrollToVerseID;
			// TODO: This ($gcurrentVerseNumber>0) used to be ($gcurrentVerseNumber>1).
			//	I changed it because it wasn't highliting the verse from search if the verse# is 1.
			// But we've got another problem with this change. The default verse 0 is changed to 1 everywhere,
			// so its now not handling cookie verse number. May be we should not change gcurrentVerseNumber to 1 (if it is zero).
			if ($gcurrentVerseNumber>0)
			{
				scrollToVerse($gcurrentVerseNumber);
				if (from != 0)
					blinkVerse($verseDivID);
			}
			else
			{
				// Scroll to last scroll position (from cookie)
				var kjvTabContentDiv = document.getElementById($gversesDivID);
				if (kjvTabContentDiv)
					kjvTabContentDiv.scrollTop = gTabScrollPosKjvY;
			}
			if ($gcurrentVerseNumber < 1)
				$gcurrentVerseNumber = 1;
			
			loadVersesAsv(bookName, bookID, chapterNumber, scrollToDiv, $gcurrentVerseNumber, from);
		}
		else 
		{
			ClearVerses();
			ShowProgressOnVerses();
			if ($gcurrentChapterNumber == 0) {
				document.getElementById($gcontentHeaderDivID).innerHTML = "<b>" + "Loading " + $gcurrentBookName + "..." + "</b>";
				$gcurrentChapterNumber = 1;
			}
			else 
			{ 
				document.getElementById($gcontentHeaderDivID).innerHTML = "<b>" + "Loading " + $gcurrentBookName + " " + $gcurrentChapterNumber + "..." + "</b>";
			}
		}
	});
} //loadVerses()



$prevBookDivId="";
$prevChapterDivId="";
$prevBookBkColor="";
$prevChapterBkColor="";
$selectedBookBkColor = "#86b8f4";
$selectedChapterBkColor = "#86b8f4";

function selectBookAndChapter(bookID, chapterID)
{
	if ($prevBookDivId != "")
	{
		/*
		//document.getElementById($prevBookDivId).style.fontWeight = "normal";
		//document.getElementById($prevBookDivId).style.borderStyle = "none";
		//document.getElementById($prevBookDivId).style.borderWidth = "0";
		//document.getElementById($prevBookDivId).style.borderColor = "transparent";
		//document.getElementById($prevBookDivId).style.backgroundColor="#FFFFFF";
		//document.getElementById($prevBookDivId).style.color="#000099";
		*/
		//document.getElementById($prevBookDivId).style.backgroundImage = "none";
		/*
		if ($prevBookBkColor != "")
			document.getElementById($prevBookDivId).style.backgroundColor = $prevBookBkColor;
		*/
		document.getElementById($prevBookDivId).style.backgroundColor = "transparent";
	}
	
	$bookDivId = "bookId" + bookID;
	/*
	//document.getElementById($bookDivId).style.fontWeight = "bold";
	//document.getElementById($bookDivId).style.borderStyle = "dotted";
	//document.getElementById($bookDivId).style.borderWidth = ".1em";
	//document.getElementById($bookDivId).style.borderColor = "#aaaaaa";
	//document.getElementById($bookDivId).style.backgroundColor="#000099";
	//document.getElementById($bookDivId).style.color="#FFFFFF";
	*/
	
	$prevBookBkColor = document.getElementById($bookDivId).style.backgroundColor;
	document.getElementById($bookDivId).style.backgroundColor = $selectedBookBkColor;
	document.getElementById($bookDivId).style.backgroundImage = "none";
	$prevBookDivId = $bookDivId;	
	
	if ($prevChapterDivId != "")
	{
		/*
		if ($prevChapterBkColor != "")
			document.getElementById($prevChapterDivId).style.backgroundColor = $prevChapterBkColor;
		else
			document.getElementById($prevChapterDivId).style.backgroundColor = "transparent";
		*/
		document.getElementById($prevChapterDivId).style.backgroundColor = "transparent";
	}
	$prevChapterBkColor = document.getElementById(chapterID).style.backgroundColor;
	document.getElementById(chapterID).style.backgroundColor = $selectedChapterBkColor;
	document.getElementById(chapterID).style.backgroundImage = "none";
	//document.getElementById(chapterID).style.backgroundImage = "url('themes/" + $g_theme + "/book_selection_background.jpg')";
	//"url('biblejs/images/book_selection_background.jpg')";
	$prevChapterDivId = chapterID;
}



function loadBookChapterNumbersNew(bookID, bookName, chapterCount, scrollToDiv, gotoChapter, gotoVerseNumber, from) 
{
	$gcurrentBookName = bookName;
	$gcurrentBookID = bookID;
	$gcurrentChapterNumber = gotoChapter;
	$gcurrentVerseNumber = gotoVerseNumber;

	if ($gcurrentChapterNumber <= 0)
	    $gcurrentChapterNumber = 1;

	if ($gcurrentVerseNumber <= 0)
	    $gcurrentVerseNumber = 1;
	
	HideProgressOnChapters();
	$chaptersHtml = "";
	var i=0;
	for (i = 1; i <= chapterCount; i++) 
	{
	    $urlStr = "./biblejs/getchapter.php?b=" + $gcurrentBookID + "&c=" + i;
		$onClickStr = "onclick=\"javascript:loadVerses('" + $gcurrentBookName + "', '" + $gcurrentBookID + "', '" + i + "','0','1','" + 0 + "'," + true + ");\" ";
		$chNo = i;
		
		$mouseEventStr = "onMouseOver=\"mouseOnChapter('" + $chNo + "');\"; onMouseOut=\"mouseOffChapter('" + $chNo + "');\" ";		
		$hrefStr = "href=\"javascript: loadVerses('" + $gcurrentBookName + "', '" + $gcurrentBookID + "', '" + i + "','1','1','0','" + 0 + "'," + true + ");\"";
		$styleStr2 = "style=\"padding-left:1em; padding-right:1em; padding-top:.2em; padding-bottom:.2em; background-color:$globalBackColor; font-family:Tahoma; border-bottom: 1px solid #cccccc; text-align: center; vertical-align: middle;\"";		
		$line = "<div id=\"" + i + "\" " + $styleStr2 + $onClickStr + $mouseEventStr + ">"  + i + "</div>";						
		$chaptersHtml = $chaptersHtml + $line;
	}
	SetInnerHTML(document.getElementById($gchaptersDivID), $chaptersHtml);
	document.getElementById($gchaptersDivID).scrollTop = 0;
	if (scrollToDiv == 1) {
	    scrollToBook($gcurrentBookID);
	}
	$prevChapterDivId="";
	
	// This function gets called only when clicked on book or on books load, so we don't give chapter#. Zero will be treated as 1st chapter.
	loadVerses($gcurrentBookName, $gcurrentBookID, $gcurrentChapterNumber, 1, $gcurrentVerseNumber, from, true);		
} //loadBookChapterNumbersNew()

// loadBookChapterNumbers : scrollToDiv is sent by "genchapter.php". Rest of the calls ignore this parameter
function loadBookChapterNumbers(bookID, bookName, scrollToDiv, gotoChapter, gotoVerseNumber, from, addToHistory) 
{
	$globalBackColor="#fefefe";
	$url = "./biblejs/getchapterlist.php?b=" + bookID + "&cc=1";
	
	$gcurrentBookName = bookName;
	$gcurrentBookID = bookID;
	$gcurrentChapterNumber = gotoChapter;
	$gcurrentVerseNumber = gotoVerseNumber;

	if ($gcurrentChapterNumber <= 0)
	    $gcurrentChapterNumber = 1;

	if ($gcurrentVerseNumber <= 0)
	    $gcurrentVerseNumber = 1;
	
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		$gxmlhttpBookChapters = new XMLHttpRequest();
	}
	else {
		// code for IE6, IE5
		$gxmlhttpBookChapters = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	
	$gxmlhttpBookChapters.open("GET",$url,true);
	$gxmlhttpBookChapters.send(null);
	
	$gxmlhttpBookChapters.onreadystatechange = (function chapterListReceived() {
		if ($gxmlhttpBookChapters.readyState==4) 
		{
			HideProgressOnChapters();
			var chapterLines = $gxmlhttpBookChapters.responseText.split('|');
			var chapterCount = chapterLines.length;
			var index = 0;
			$chaptersHtml = "";
			while (index < chapterCount)
			{
				// $line = $bookNumber . "^" . $chapterID . "^" . $chapterNumber . "^" . $commentCount . "|";
				if (chapterLines[index] == "") // ignore empty lines (for some browsers, we need this)
				{
					index++;
					continue;
				}
				var line = chapterLines[index].split('^');
				var bookNumber = line[0];
				var chapterID = line[1];
				var chapterNumber = line[2];
				var commentCount = line[3];
				var i = index+1;
				
				var commentCountInnerSpanStr = "";
				if (commentCount > 0)
				{
					var commentsStyleStr = "style=\"visibility:visible; position:relative; background-color:#f58d15; margin:.5em; height:10px; width:10px; -moz-border-radius:8px; -webkit-border-radius:8px; padding-top:.2em; padding-bottom:.2em; padding-right:.5em; padding-left:.5em; text-align:center; color:#ffffff; font-size:8px;\"";
					if (commentCount == 1)
						commentCountInnerSpanStr = "<span id=\"ChapterCommentCount_" + chapterID + "\"" + commentsStyleStr + " title=\"" + commentCount + " comment in " + $gcurrentBookName + " " + i + ".\" bookname=\"" +$gcurrentBookName+ "\" chapternumber=\""+i+"\"> <b>" + commentCount + " </b> </span>";
					else
						commentCountInnerSpanStr = "<span id=\"ChapterCommentCount_" + chapterID + "\"" + commentsStyleStr + " title=\"" + commentCount + " comments in " + $gcurrentBookName + " " + i + ".\" bookname=\"" +$gcurrentBookName+ "\" chapternumber=\""+i+"\"> <b>" + commentCount + " </b> </span>";
				}
                else
                {
                    //var commentsStyleStr = "style=\"position:relative; background-color:#f58d15; margin:.5em; height:10px; width:10px; -moz-border-radius:8px; -webkit-border-radius:8px; padding-top:.2em; padding-bottom:.2em; padding-right:.5em; padding-left:.5em; text-align:center; color:#ffffff; font-size:8px;\"";
                    //commentCountInnerSpanStr = "<span id=\"ChapterCommentCount_" + chapterID + "\"" + commentsStyleStr + " title=\"" + commentCount + " comment in " + $gcurrentBookName + " " + i + ".\" bookname=\"" +$gcurrentBookName+ "\" chapternumber=\""+i+"\"> </span>";
                    ///////////////////
                    var commentsStyleStr = "style=\"visibility:hidden; background-color:transparent; height:10px; width:14px; -moz-border-radius:8px; -webkit-border-radius:8px; padding-top:.2em; padding-bottom:.2em; padding-right:.5em; padding-left:.5em; text-align:center; color:#ffffff; font-size:8px;\"";
                    commentCountInnerSpanStr = "<span id=\"ChapterCommentCount_" + chapterID + "\"" + commentsStyleStr + " title=\"" + commentCount + " comment in " + $gcurrentBookName + " " + i + ".\" bookname=\"" +$gcurrentBookName+ "\" chapternumber=\""+i+"\"> </span>";
                }
				
				$attribsStr = " CommentCount=\"" + commentCount + "\" ChapterID=\"" + chapterID + "\" ";
				$urlStr = "./biblejs/getchapter.php?b=" + $gcurrentBookID + "&c=" + i;
				$onClickStr = "onclick=\"javascript:loadVerses('" + $gcurrentBookName + "', '" + $gcurrentBookID + "', '" + i + "','0','1','" + 0 + "'," + true + ");\" ";
				$mouseEventStr = "onMouseOver=\"mouseOnChapter('" + chapterNumber + "');\"; onMouseOut=\"mouseOffChapter('" + chapterNumber + "');\" ";				
				$hrefStr = "href=\"javascript: loadVerses('" + $gcurrentBookName + "', '" + $gcurrentBookID + "', '" + i + "','1','1','0','" + 0 + "'," + true + ");\"";				
				$styleStr2 = "style=\"padding-left:1em; padding-right:1em; padding-top:.2em; padding-bottom:.2em; background-color:$globalBackColor; font-family:Tahoma; border-bottom: 1px solid #cccccc; horizontal-align:left; vertical-align:middle;\"";
				$lineInnerSpanStr = "<span style=\"position:relative; text-align:center;\">" + i + "</span>";
				$lineStr = "<div id=\"" + i + "\" " + $styleStr2 + $attribsStr + $onClickStr + $mouseEventStr + ">"  + $lineInnerSpanStr + "   " + commentCountInnerSpanStr + "</div>";
				$chaptersHtml = $chaptersHtml + $lineStr;
				index++;
			} //while
			
			SetInnerHTML(document.getElementById($gchaptersDivID), $chaptersHtml);
			document.getElementById($gchaptersDivID).scrollTop = 0;
			if (scrollToDiv == 1) 
			{
			    scrollToBook($gcurrentBookID);
			}
			$prevChapterDivId="";
			
			// This function gets called only when clicked on book or on books load, so we don't give chapter#. Zero will be treated as 1st chapter.
			if (addToHistory==null || addToHistory==undefined)
				addToHistory = true;
			loadVerses($gcurrentBookName, $gcurrentBookID, $gcurrentChapterNumber, 
				1, $gcurrentVerseNumber, from, addToHistory);
		}
		else
		{
			ShowProgressOnChapters();
			ClearVerses();
			ClearVersesAsv();
			ShowProgressOnVerses();
			ShowProgressOnVersesAsv();
			document.getElementById($gchaptersDivID).innerHTML="Loading...";
		}
		document.getElementById($gchaptersDivID).visibility = "visible";
	});

} //loadBookChapterNumbers()



function onBookClicked(bookID, bookName, chapterCount, scrollToDiv, gotoChapter, gotoVerseNumber, from) 
{
	//loadBookChapterNumbers(bookID, bookName, chapterCount, scrollToDiv, gotoChapter, gotoVerseNumber, from);
	loadBookChapterNumbers(bookID, bookName, scrollToDiv, gotoChapter, gotoVerseNumber, from);
} //onBookClicked()


function loadBooks()
{
	$gcurrentBookName = "";
	
	var user = GetSavedUserName();
	$url = "./biblejs/getbooks.php?uid=" + user + "&vstr=" + $gVersionStr + "";
	
	if (window.XMLHttpRequest)
	{
		// code for IE7+, Firefox, Chrome, Opera, Safari
		$gxmlhttpBooks=new XMLHttpRequest();
	}
	else
	{
		// code for IE6, IE5
		$gxmlhttpBooks=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	$gxmlhttpBooks.open("GET",$url,true);
	$gxmlhttpBooks.send(null);
	
	$gxmlhttpBooks.onreadystatechange = (function booksReceived() {
	if ($gxmlhttpBooks.readyState==4)
	{
		if ($gcurrentBookID <=0)
			$gcurrentBookID = 1;
		if ($gcurrentChapterNumber <=0)
			$gcurrentChapterNumber = 1;
		if ($gcurrentVerseNumber <=0)
			$gcurrentVerseNumber = 1;
		
		HideProgressOnBooks();
		var booksDiv = document.getElementById($gbooksDivID);
		if (booksDiv)
		{
			bookLines = $gxmlhttpBooks.responseText.split('|');
			var index = 0;
			var booksDivText = "";
			while (index < bookLines.length-1)
			{
				var line = "";
				bookLine = bookLines[index].split('^');
				var id = bookLine[0];
				var bookFullName = bookLine[1];
				var chapterCount = bookLine[2];
				var commentCount = bookLine[3];
				$gBookChapterCountArray[id] = chapterCount;
				
				var commentCountSpanStr = "";
				if (commentCount > 0)
				{
					var commentsStyleStr = "style=\"visibility:'visible'; background-color:#f58d15; height:10px; width:14px; -moz-border-radius:8px; -webkit-border-radius:8px; padding-top:.2em; padding-bottom:.2em; padding-right:.5em; padding-left:.5em; text-align:center; color:#ffffff; font-size:8px;\"";
					if (commentCount == 1)
						commentCountSpanStr = "<span id=\"BookCommentCount_" + id + "\"" + commentsStyleStr + " title=\"" + commentCount + " comment in " + bookFullName + ".\" bookname=\"" +bookFullName+ "\"> <b>" + commentCount + " </b> </span>";
					else
						commentCountSpanStr = "<span id=\"BookCommentCount_" + id + "\"" + commentsStyleStr + " title=\"" + commentCount + " comments in " + bookFullName + ".\" bookname=\"" +bookFullName+ "\"> <b>" + commentCount + " </b> </span>";
				}
                else
                {
                    var commentsStyleStr = "style=\"visibility:'hidden'; background-color:transparent; height:10px; width:14px; -moz-border-radius:8px; -webkit-border-radius:8px; padding-top:.2em; padding-bottom:.2em; padding-right:.5em; padding-left:.5em; text-align:center; color:#ffffff; font-size:8px;\"";
                    commentCountSpanStr = "<span id=\"BookCommentCount_" + id + "\"" + commentsStyleStr + " title=\"" + commentCount + " comment in " + bookFullName + ".\" bookname=\"" +bookFullName+ "\"> </span>";
                }
				
				var styleStr = "style=\"padding-left:1em; padding-right:1em; padding-top:.2em; padding-bottom:.2em; background-color:transparent; font-family:Tahoma; border-bottom: 1px solid #cccccc;\"";
				

				var mouseEventStr = "onMouseOver=\"mouseOnBook('bookId"+id+"','BookChaptersBtn_" + id + "');\" onMouseOut=\"mouseOffBook('bookId"+id+"','BookChaptersBtn_" + id + "');\"";
				
				//var chaptersBtn = "<button id='BookChaptersBtn_" + id + "' class='ui-icon-triangle-1-s' style='float:right; font-size:6px;'>Open chapters</button>";
				var onclickStr = "onclick=\"javascript:onBookClicked('" + id + "', '" + bookFullName + "','"+ chapterCount + "','0','1','1');\"";

				line = "<div id='bookId" + id + "' " + styleStr + " " + mouseEventStr + onclickStr + " >" + bookFullName + " " + commentCountSpanStr + " </div>";
				//chaptersBtn
				
				booksDivText = booksDivText + line;
				if (isLoggedIn())
				{
					if (index == 0)
					{
						SetInnerHTML(booksDiv, line, false);
					}
					else
					{
						SetInnerHTML(booksDiv, line, true);
					}
					
					if (index+1 == $gcurrentBookID)
					{
						$gcurrentBookName = bookFullName;
						loadBookChapterNumbers($gcurrentBookID, $gcurrentBookName, 1, $gcurrentChapterNumber, $gcurrentVerseNumber, 0);
					}
				}
				else 
				{
					if (index == 0)
					{
						SetInnerHTML(booksDiv, line, false);
					}
					else
					{
						SetInnerHTML(booksDiv, line, true);
					}
					
					if (index+1 == $gcurrentBookID)
					{
						// Load chapter numbers for first book.
						// This code was at the end of this function. But because the 
						//	split button wasn't working properly, I moved it here.
						$gcurrentBookName = bookFullName;
						loadBookChapterNumbers($gcurrentBookID, $gcurrentBookName, 1, $gcurrentChapterNumber, $gcurrentVerseNumber,0);
					}
				}
				//ui-icon-triangle-1-s
				
				// TODO: Create new div and add the split button dynamically.
				var selectBtn = document.createElement("button");
				if (selectBtn)
				{
					selectBtn.setAttribute('id', "BookChaptersBtn_" + id);
					selectBtn.setAttribute('class', "ui-icon-triangle-1-s");
					selectBtn.style.float = "right";
					selectBtn.style.fontSize = "6px";
					selectBtn.style.visibility = "hidden";
					SetInnerHTML(selectBtn, "Select Chapter for " + bookFullName);
					
					var bookLineDiv = document.getElementById("bookId" + id);
					if (bookLineDiv)
					{
						bookLineDiv.appendChild(selectBtn);
						InitSplitButton(id, bookFullName, chapterCount);
					}
				}
				
				index++;
			}
			

			//booksDiv.innerHTML = AddSelectIfIE($gxmlhttpBooks.responseText);
			//SetInnerHTML(booksDiv, $gxmlhttpBooks.responseText);
			//SetInnerHTML(booksDiv, booksDivText);

			booksDiv.scrollTop = 0;
		}

		/*

		// Load chapter numbers for first book.
		var book1 = document.getElementById('bookId1');
		if (book1)

			$gcurrentBookName = book1.innerHTML;

		$gcurrentBookID = 1;
		loadBookChapterNumbers($gcurrentBookID, $gcurrentBookName, 1, 1, 1,0);
		*/

	}

		else

		{

			ClearVerses();
			ClearVersesAsv();

			ShowProgressOnBooks();

			ShowProgressOnChapters();

			ShowProgressOnVerses();
			ShowProgressOnVersesAsv();

			document.getElementById($gbooksDivID).innerHTML="Loading...";

		}

	});

} //loadBooks()


// There is a bug in IE that causes error when setting 
//	HTML formatted string to innerHTML.
// This is a work arround.
function SetInnerHTML(containerDiv, innerHTMLText, add)
{
	//if(isIE())
	{
		var newdiv = document.createElement("div");
		newdiv.innerHTML = innerHTMLText;
		if (!add)
		{
			if (containerDiv.firstChild)
			{
				containerDiv.removeChild(containerDiv.firstChild);
			}
		}
		containerDiv.appendChild(newdiv);
	}
	/*
	else
	{
		if (add)
			containerDiv.innerHTML = containerDiv.innerHTML+innerHTMLText;
		else
			containerDiv.innerHTML = innerHTMLText;
	}
	*/
} //SetInnerHTML()



function AttachCounter(containerDivID, count)
{
	containerDiv = document.getElementById(containerDivID);
	if (containerDiv)
	{
		var divID = containerDivID + "_CounterOuter";
		var div = document.createElement('div');
		div.setAttribute('id', divID);
		div.style.position = "absolute";
		div.style.backgroundImage = "url('./images/circle.png')";
		div.style.backgroundRepeat = "no-repeat";
		div.style.backgroundPosition = "center center";
		//div.style.top = containerDiv.y-5 + "px"; //containerDiv.offsetTop-5 + "px";
		div.style.bottom = containerDiv.height+5 + "px"; //containerDiv.offsetTop-5 + "px";
		div.style.left = ((containerDiv.offsetLeft+containerDiv.offsetWidth)-5) + "px";//containerDiv.offsetRight-5 + "px";
		div.title = "Unread comments";
		
		var innerDivID = containerDivID + "_CounterInner";
		var innerSpan = document.createElement('span');
		innerSpan.style.fontSize = "8px";
		innerSpan.style.color = "#ffffff";
		innerSpan.style.width = "16px";
		innerSpan.style.height = "16px";
		SetInnerHTML(innerDivID, count);
		
		// FIXME: add element.
		div.appendChild(innerSpan);
		document.body.appendChild(div);
		
		//<span id="guestbookCounter" style="left:-12px; width:16px; height:16px;" title="Unread comments"> <span style="position:absolute; font-size:8px; color:#ffffff; width:16px; hright:16px;">12</span></span>
	}
} //AttachCounter()

var gLastOpenedSelectBtnId = "";

function InitSplitButton(id, bookFullName, chapterCount)
{
	var btnId = "BookChaptersBtn_" + id;
	$("#"+btnId)
		.button( {
			text: false,
			icons: {
				primary: "ui-icon-triangle-1-s"
			}
		})
		.click(function() {
			onDocumentClick(window.event); //to close other boxes (like login, social and guestbook)
			OnSplitBtnClick(id, bookFullName, chapterCount, true);
			return false;
		})
	/*
	$("#"+btnId)
		.button()
		.click(function() {
			OnSplitBtnClick(btnId, false);
		})
		.next()
			.button( {
				text: false,
				icons: {
					primary: "ui-icon-triangle-1-s"
				}
			})
			.click(function() {
				OnSplitBtnClick(btnId, true);
			})
			.parent()
			.buttonset();
	*/
} //InitSplitButton()

function OnSplitBtnClick(id, bookFullName, chapterCount, selecterClicked)
{
	OpenChaptersBox(id, bookFullName, chapterCount);
}
function onChapterClicked(bookName, bookNumber, chapterNumber, chapterCount, scrollToDiv, scrollToVerseID, from)
{
	// Remove chapter box (in books div) when clicked.
	var chaptersBoxDiv =document.getElementById("ChaptersDivID");
	if (chaptersBoxDiv)
	{
		$gChaptersBoxVisible = 0;
		chaptersBoxDiv.parentNode.removeChild(chaptersBoxDiv);
		gLastOpenedSelectBtnId = "";
		
		// Re-enable books scroll bar
		EnableBooksScroll(1);
	}
	var tmpImgDiv = document.getElementById("ArrowDiv");
	if (tmpImgDiv)
		tmpImgDiv.parentNode.removeChild(tmpImgDiv);
	
	loadBookChapterNumbers(bookNumber, bookName, scrollToDiv, chapterNumber, scrollToVerseID, from);
} //onChapterClicked()

function MouseOnBoxChapterNumber(div)
{
	if (div)
	{
		div.style.cursor = 'pointer'; 
		div.style.backgroundColor='#e4f0ff';
	}
}

function MouseOutBoxChapterNumber(div)
{
	if (div)
	{
		//div.style.cursor = 'default'; 
		div.style.backgroundColor='transparent';
	}
}

function GetTop(divId) 
{
    var node = document.getElementById(divId);     
    var curtop = 0;
    var curtopscroll = 0;
    if (node.offsetParent) 
    {
        do 
        {
            curtop += node.offsetTop;
            curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
        } while (node = node.offsetParent);
        return (curtop - curtopscroll);
    }
    return -1;
} //GetTop()

var gBooksScrollPos = 0;
function OpenChaptersBox(id, bookFullName, chapterCount)
{
	var chaptersBoxDiv = null;
	var selectBtnId = "BookChaptersBtn_" + id;
	var selectButtonDiv = document.getElementById(selectBtnId);
	var bookID = "bookId" + id;
	
	chaptersBoxDiv =document.getElementById("ChaptersDivID");
	var bookDiv = document.getElementById(bookID);
	if (!bookDiv)
		return false;
	if (chaptersBoxDiv)
	{
		$gChaptersBoxVisible = 0;
		chaptersBoxDiv.parentNode.removeChild(chaptersBoxDiv);
	}
	
	// Remove arrow if existing
	var tmpImgDiv = document.getElementById("ArrowDiv");
	if (tmpImgDiv)
		tmpImgDiv.parentNode.removeChild(tmpImgDiv);
	
	chaptersBoxDiv = document.createElement('div');
	chaptersBoxDiv.setAttribute('id', "ChaptersDivID");
	chaptersBoxDiv.setAttribute('class', "ui-widget-header ui-corner-all");
	chaptersBoxDiv.style.position = "relative";
	chaptersBoxDiv.style.visibility = "hidden";

	if (selectBtnId != gLastOpenedSelectBtnId)
	{
		document.body.appendChild(chaptersBoxDiv);
		chaptersBoxDiv.onclick = (function() {PreventDefaultAction(window.event);});
		//alert(selectButtonDiv.offsetTop);
		$gChaptersBoxVisible = 1;
		chaptersBoxDiv.style.position = "absolute";
		chaptersBoxDiv.style.visibility = "visible";
		chaptersBoxDiv.onMouseOver = ".style.cursor = 'default'";
		chaptersBoxDiv.style.padding = ".3em";
		chaptersBoxDiv.style.margin = ".3em";
		chaptersBoxDiv.style.width = "50px";
		
		chaptersBoxDiv.style.left = selectButtonDiv.offsetLeft + 20 + "px";
		gLastOpenedSelectBtnId = selectBtnId;
		var titleHtml = "<div class=\"ui-widget-header ui-corner-all\" style=\"position:relative; padding:.5em; padding-top:.2em; margin:.2em;\"> Chapters </div>";
		//SetInnerHTML(chaptersBoxDiv, titleHtml, false);
		
		chaptersBoxDiv.style.zIndex = "1";
		
		var chaptersBoxContentDiv = document.createElement('div');
		chaptersBoxContentDiv.setAttribute('id', "ChaptersDivContentID");
		chaptersBoxContentDiv.setAttribute('class', "ui-widget-content ui-corner-all");
		//chaptersBoxContentDiv.style.height="auto";
		var index = 1;
		var divHtml = "";
		for (index = 1; index <= chapterCount; index++) 
		{
			var onClickStr = " onclick=\"javascript:onChapterClicked('" + bookFullName + "', '" + id + "', '" + index + "','" + chapterCount + "','0','1','" + 0 + "');\" ";
			//var onMouseOverStr = "onMouseOver=\"this.style.cursor = 'pointer'; this.style.background-color='#505050';\"";
			var onMouseOverStr = "onMouseOver=\"javascript:MouseOnBoxChapterNumber(this);\"";
			//var onMouseOutStr = "onMouseOut=\"this.style.background-color='transparent';\"";
			var onMouseOutStr = "onMouseOut=\"javascript:MouseOutBoxChapterNumber(this);\"";
			divHtml += "<div style=\"position:relative; text-align:center; border-bottom:1px; font-size:9px;\"" + onClickStr + " " + onMouseOverStr + " " + onMouseOutStr + "> " + index + "</div>";
		}
		divHtml += "<br>";
		SetInnerHTML(chaptersBoxContentDiv, divHtml, false);
		chaptersBoxDiv.appendChild(chaptersBoxContentDiv);
		
		if (chaptersBoxDiv.offsetHeight > 400)
		{
			var diff = chaptersBoxDiv.offsetHeight - chaptersBoxContentDiv.offsetHeight;
			chaptersBoxDiv.style.height = "400px"; //fixed height;
			chaptersBoxContentDiv.style.height = (400-diff) + "px";
		}
		
		chaptersBoxContentDiv.style.padding = ".1em";
		chaptersBoxContentDiv.style.margin = ".1em";	
		chaptersBoxContentDiv.style.autoScroll = "true";
		chaptersBoxContentDiv.style.overflowY = "auto";
		chaptersBoxContentDiv.style.overflowX = "hidden";
		
		var availableHeight = 0;
		availableHeight = window.innerHeight - 10;
		//var topVal = (selectButtonDiv.offsetTop - (chaptersBoxDiv.offsetHeight/2));
		var topVal = GetTop(selectBtnId) - (chaptersBoxDiv.offsetHeight/2);
		if (topVal < 10)
			topVal = 10;
		else if(topVal > availableHeight-chaptersBoxDiv.offsetHeight)
			topVal = availableHeight-chaptersBoxDiv.offsetHeight;
		//alert(topVal);
		chaptersBoxDiv.style.top = topVal + "px";
		chaptersBoxDiv.style.left = (selectButtonDiv.offsetLeft + 20) + "px";
		
		// Add arrow to point to the corresponding book
		var tmpImgDiv = document.getElementById("ArrowDiv");
		if (tmpImgDiv)
			tmpImgDiv.parentNode.removeChild(tmpImgDiv);
		var imgDiv = document.createElement('div');
		imgDiv.setAttribute('id', "ArrowDiv");
		imgDiv.setAttribute('SelectBtnID', selectBtnId);
		document.body.appendChild(imgDiv);
		imgDiv.style.position = "absolute";
		imgDiv.style.zIndex = "1";
		imgDiv.innerHTML = "<img src=\"" + $gArrowBtnLeft.src + "\"/>";
		imgDiv.style.top = GetTop(selectBtnId) + "px";
		imgDiv.style.left = (selectButtonDiv.offsetLeft + 15) + "px";
		imgDiv.style.visibility = "visible";
		
		// Disable books scroll bar
		EnableBooksScroll(0);
	}
	else
	{
		gLastOpenedSelectBtnId = "";
		
		// Re-enable books scroll bar
		EnableBooksScroll(1);
	}
}

function CloseChapterBox()
{
	$gChaptersBoxVisible = 0;
	var ChaptersDiv = document.getElementById("ChaptersDivID");
	if (ChaptersDiv)
	{
		ChaptersDiv.parentNode.removeChild(ChaptersDiv);
		gLastOpenedSelectBtnId = "";
		
		// Re-enable books scroll bar
		EnableBooksScroll(1);
	}
	
	var tmpImgDiv = document.getElementById("ArrowDiv");
	if (tmpImgDiv)
		tmpImgDiv.parentNode.removeChild(tmpImgDiv);
} //CloseChapterBox()

function EnableBooksScroll(enable)
{
	// Enable / disable books scroll bar
	var booksDiv = document.getElementById($gbooksDivID);
	if (booksDiv)
	{
		if (enable)
		{
			booksDiv.style.overflowY = "scroll";
			
			// Use previously saved scroll pos (some browsers like Chrome are messing up the scroll pos).
			// First scroll to zero and then scroll to the saved pos, because the scroll size is wrongly
			//	calculated by the browser. This will fix it.
			booksDiv.scrollTop = 0;
			booksDiv.scrollTop = gBooksScrollPos;
		}
		else
		{
			// Save previous scroll pos (some browsers like Chrome are messing up the scroll pos)
			gBooksScrollPos = booksDiv.scrollTop;
			booksDiv.style.overflowY = "hidden";
		}
	}
}
