
$gcontentTabs = null;
$gbooksDivID="";
$gchaptersDivID="";
$gversesDivID="";
$gcontentHeaderDivID="";
$gfooterDivID="";
$gloginButtonDivID="";
$gloginBoxDiv="";
$gFacebookBtnDivID="";
$gGoogleBtnDivID="";
$gMaximizeBtnDiv="";
$ghighlightVerseBtnID="";

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

$gloginBoxVisible=0;
$gIsMaximized = 0;

$gsigninButtonNormal = null;
$gsigninButtonDown = null;
$gsigninButtonOver = null;
$gsigninButtonExpanded = null;
$gsignoutButton = null;
$gmaxButton = null;
$gmaxButtonDown = null;
$gminButton = null;
$gminButtonDown = null;
$gguestBookButton = null;
$gguestBookButtonDown = null;
$gcloseBtn = null;
$gcloseBtnDown = null;

$gHighLightVerseOnMouseOver = true;

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

function initializeTheme() {
	//document.getElementById("headerImageDiv").innerHTML = "<img src=\"themes/" + $g_theme + "/CloudBible_Transparent.png\" width=75;/>";
	document.getElementById("logoImageDiv").innerHTML = "<img src=\"themes/" + $g_theme + "/logo.png\"/>";
	
	
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

function mouseOverGuestbookBtn(divID)
{
	document.getElementById(divID).style.cursor = "pointer";
}

function mouseOutGuestbookBtn(divID)
{
	document.getElementById(divID).style.cursor = "default";
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

function mouseDownGuestbookBtn(divID)
{
} //mouseDownGuestbookBtn()

function mouseUpGuestbookBtn(divID)
{
} //mouseUpGuestbookBtn()

function onGuestbookClick(divID)
{
	var btndiv = document.getElementById(divID);
	var guestbookDiv = document.getElementById("guestbookDiv");
	if (guestbookDiv)
	{
		if (btndiv)
		{
			btndiv.src = $gguestBookButton.src;
		}
		document.body.removeChild(guestbookDiv);
	}
	else
	{
		initGuestBookBox();
		var guestbookDivNew = document.getElementById("guestbookDiv");
		if (guestbookDivNew)
		{
			guestbookDivNew.style.visibility = "visible";
			//guestbookDivNew.innerHTML = "<p><b>We're working on the guest book...<br>Please bear with us.<br><br>Click on the " + "<img id=\"guestbookInnerBtn\" style=\"position:relative; top:7px;\" src=\"" + $gguestBookButton.src+ "\" onclick=\"javascript:onGuestbookClick('guestbookInnerBtn');\" onmousedown=\"javascript:mouseDownGuestbookBtn('guestbookInnerBtn');\" onmouseup=\"javascript:mouseUpGuestbookBtn('guestbookInnerBtn');\">" +" button again to close this.</b></p>";
			if (btndiv)
			{
				btndiv.src = $gguestBookButtonDown.src;
			}
			LoadGuestComments("guestbookBoxContentDiv");
		}
	}
} //onGuestbookClick()

function resizeGuestBookBox()
{
	var guestbookDiv = document.getElementById("guestbookDiv");
	var guestbookBtnDiv = document.getElementById("guestbookBtn");
	var guestbookBoxContentDiv = document.getElementById("guestbookBoxContentDiv");
	var guestbookBoxEditorDiv = document.getElementById("guestbookBoxEditorDiv");
	var guestbookCommentText = document.getElementById("guestbookCommentText");
	if (guestbookDiv && guestbookBtnDiv && guestbookBoxContentDiv)
	{
		var guestBookWidth = (document.documentElement.clientWidth*75/100) - (guestbookBtnDiv.style.width+guestbookBtnDiv.style.left+20);
		var guestBookHeight = (document.documentElement.clientHeight*75/100) - (guestbookBtnDiv.clientHeight+10);
		var guestBookTitleHeight = 25;
		var guestbookEditorHeight = 130;
		
		guestbookDiv.style.width = guestBookWidth + "px";
		guestbookDiv.style.height = guestBookHeight + "px";
		guestbookBoxContentDiv.style.height = (guestBookHeight - guestBookTitleHeight - guestbookEditorHeight - 14) + "px";
		guestbookCommentText.style.width = (guestbookBoxEditorDiv.offsetWidth-20) + "px";
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
	var guestbookBoxDiv = document.createElement('div');
	guestbookBoxDiv.setAttribute('id', "guestbookDiv");
	document.body.appendChild(guestbookBoxDiv);
	var guestbookBtnDiv = document.getElementById("guestbookBtn");
	
	// Create guestbook title div
	var guestbookBoxTitleDiv = document.createElement('div');
	guestbookBoxTitleDiv.setAttribute('id', "guestbookTitle");
	
	// Create guestbook content div
	var guestbookBoxEditorDiv = document.createElement('div');
	guestbookBoxEditorDiv.setAttribute('id', "guestbookBoxEditorDiv");
	
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
		guestbookBoxDiv.style.borderWidth = "7px";
		guestbookBoxDiv.style.borderColor = "#1865ac";//"#27507a"; //"#6090f0"; //"#cccccc"; //"#3379ff"; //"#27507a";
		guestbookBoxDiv.style.backgroundColor = "#ffffff";
		guestbookBoxDiv.style.width = guestBookWidth + "px";
		guestbookBoxDiv.style.height = guestBookHeight + "px";
		if (isChrome() || isSafari())
		{
			guestbookBoxDiv.style.bottom = (guestbookBtnDiv.offsetTop + 26) + "px";
			guestbookBoxDiv.style.left = (guestbookBtnDiv.offsetLeft + 19) + "px";
		}
		else if(isIE())
		{
			guestbookBoxDiv.style.bottom = (guestbookBtnDiv.offsetTop + 20.5) + "px";
			guestbookBoxDiv.style.left = (guestbookBtnDiv.offsetLeft + 17) + "px";
		}
		else //firefox 
		{
			guestbookBoxDiv.style.bottom = (guestbookBtnDiv.offsetTop + 20.5) + "px";
			guestbookBoxDiv.style.left = (guestbookBtnDiv.offsetLeft + 19) + "px";
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
		guestbookBoxTitleDiv.innerHTML = "<b>Guest Book</b>";
		
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
		guestbookBoxEditorDiv.style.paddingTop = "1px";
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
		
		var postBtnDivStr = "<span style=\"height:18px; margin-bottom:5px; margin-left:6px;\"><button onclick=\"javascript:onPostGuestbookCommentClick('guestNameText', 'guestbookCommentText');\" class=\"btn\"><span><span>&nbsp&nbsp&nbsp&nbsp Post &nbsp&nbsp&nbsp&nbsp</span></span></button></span>";
		
		var msgDivStr = "<span id=\"guestbookErrorMsgDiv\" style=\"font-size:11px; height:18px; color:red; margin-bottom:5px; margin-left:6px;\"> Please keep it clean </span>";
		
		guestbookBoxEditorDiv.innerHTML ="<b>Enter your comments here:</b> <br>" + commentTextboxStr + nameRowStr + postBtnDivStr + msgDivStr;
		
		var nameTextDiv = document.getElementById("guestNameText");
		if (nameTextDiv)
			nameTextDiv.value = getFullName();
		var commentTextDiv = document.getElementById("guestbookCommentText");
		if (commentTextDiv)
			commentTextDiv.value = "";

		
		// Set guestbook content styles
		guestbookBoxContentDiv.style.position = "relative";
		guestbookBoxContentDiv.style.paddingLeft = "10px";
		guestbookBoxContentDiv.style.paddingRight = "10px";
		guestbookBoxContentDiv.style.paddingTop = "5px";
		guestbookBoxContentDiv.style.backgroundColor = "#fafafa";
		guestbookBoxContentDiv.style.height = (guestBookHeight - guestBookTitleHeight - guestbookEditorHeight  - 14) + "px";
		//guestbookBoxContentDiv.style.float = "bottom";
		guestbookBoxContentDiv.innerHTML = innerHTML = "<p><b>We're working on the " + "<img id=\"guestbookInnerBtn\" style=\"position:relative; top:7px;\" src=\"" + $gguestBookButton.src+ "\">" + ", please bear with us.</b></p>";
		/*
		guestbookBoxContentDiv.innerHTML = innerHTML = "<p><b>We're currently working on the guest book...<br>Please bear with us.<br><br>Click on the " + "<img id=\"guestbookInnerBtn\" style=\"position:relative; top:7px;\" src=\"" + $gguestBookButton.src+ "\" onclick=\"javascript:onGuestbookClick();\" onmousedown=\"javascript:mouseDownGuestbookBtn('guestbookInnerBtn');\" onmouseup=\"javascript:mouseUpGuestbookBtn('guestbookInnerBtn');\">" +" button again to close this.</b></p>";
		*/
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
		AddGuestComment("guestbookBoxContentDiv", "guestbookErrorMsgDiv", 0, nameTextDiv.value, commentTextDiv.value);
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
	var btnDiv = document.getElementById($ghighlightVerseBtnID);
	if ($gHighLightVerseOnMouseOver)
	{
		$gHighLightVerseOnMouseOver = false;
		if (btnDiv)
		{
			btnDiv.innerHTML = "<span><span>Turn on highlighting</span></span>";
		}
	}
	else
	{
		$gHighLightVerseOnMouseOver = true;
		if (btnDiv)
		{
			btnDiv.innerHTML = "<span><span>Turn off highlighting</span></span>";
		}
	}
}

function onSearchClick(searchTextID, otherSearchTextId, searchTabBarID, searchContentDivID) { 
	var searchText = document.getElementById(searchTextID).value;
	document.getElementById(otherSearchTextId).value = searchText;
	searchBible(searchText, searchTabBarID, searchContentDivID);
}

function clickOnVerse(verseDivID) {
	// remove previous verse' border
	if ($gprevVerseClicked != "") {
		//document.getElementById($gprevVerseClicked).style = $gPrevStyle;
		document.getElementById($gprevVerseClicked).style.borderStyle = "none";
		if ($gprevVerseClicked  == "verseId1")
		{
			document.getElementById($gprevVerseClicked).style.borderTop = "1px solid #cccccc";
			document.getElementById($gprevVerseClicked).style.borderBottom = "1px solid #cccccc";
		}
		else
		{
			document.getElementById($gprevVerseClicked).style.borderBottom = "1px solid #cccccc";
		}

		//document.getElementById($gprevVerseClicked).style.borderWidth = "0";
		//document.getElementById($gprevVerseClicked).style.borderColor = "transparent";
		//document.getElementById($gprevVerseClicked).style.backgroundColor = "transparent";
		//document.getElementById($gprevVerseClicked).style.backgroundColor = $gPrevBackColorClicked;
		//document.getElementById($gprevVerseClicked).style.color = "black";
		//document.getElementById($gprevVerseClicked).style.fontWeight = "normal";
}
	
	$gPrevBackColorClicked = document.getElementById(verseDivID).style.backgroundColor;

    //document.getElementById(verseDivID).style.borderStyle = "dotted";
    //document.getElementById(verseDivID).style.borderWidth = ".1em";
    //document.getElementById(verseDivID).style.borderColor = "#009000";
    //document.getElementById(verseDivID).style.backgroundColor = $selectedVerseBkColor;
    //document.getElementById(verseDivID).style.color = $selectedVerseColor;
    //document.getElementById(verseDivID).style.fontWeight = "bold";

    
    
    $gprevVerseClicked = verseDivID;
}


function mouseOnVerse(verseDivID) {
	
	//document.getElementById(verseDivID).style.backgroundImage = "url('themes/" + $g_theme + "/verse_background.jpg')";
	//document.getElementById(verseDivID).style.backgroundRepeat = "repeat-x";
	//document.getElementById(verseDivID).style.backgroundPositionY = 'center';
	if ($gHighLightVerseOnMouseOver)
		document.getElementById(verseDivID).style.backgroundColor = "#e4f0ff";
}

function mouseOffVerse(verseDivID) {
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

function mouseOnBook(bookDivID) 
{
	var curBookDivID = "bookId" + $gcurrentBookID;
	if (bookDivID != curBookDivID)
	{
		document.getElementById(bookDivID).style.cursor = "pointer";
		document.getElementById(bookDivID).style.backgroundColor = "#e4f0ff";
	}
	
	/*
	document.getElementById(bookDivID).style.backgroundImage = "url('themes/" + $g_theme + "/book_selection_background.jpg')";
	document.getElementById(bookDivID).style.backgroundRepeat = "repeat-x";
	document.getElementById(bookDivID).style.backgroundPositionY = 'center';
	*/
}

function mouseOffBook(bookDivID) 
{
	var curBookDivID = "bookId" + $gcurrentBookID;
	if (bookDivID != curBookDivID)
	{
		document.getElementById(bookDivID).style.cursor = "default";
		document.getElementById(bookDivID).style.backgroundImage = "none";
		document.getElementById(bookDivID).style.backgroundColor = "transparent";
	}
}


var gPrevVerseNumber=0;

function onCancelCommentClick()
{
	if (gPrevVerseNumber)
	{
		var prevVerseDiv = document.getElementById("verseId" + gPrevVerseNumber);
		var preCommentDiv = document.getElementById("CommentDivID_" + gPrevVerseNumber);
		prevVerseDiv.removeChild(preCommentDiv);
		
		// Clear back-color on verse (otherwise, when we cancel two verses get back color)
		mouseOffVerse("verseId" + gPrevVerseNumber);
		
		gPrevVerseNumber = 0;
	}
}

function disableCommentBox(commentTextID, textToDisplay)
{
	commentTextDiv = document.getElementById(commentTextID);
	if (commentTextDiv)
	{
		commentTextDiv. disabled = true;
		commentTextDiv.value = textToDisplay;
	}
}

function adjustCommentTextBox(verseID)
{
	if (verseID)
	{
		var commentDiv = document.getElementById("CommentDivID_" + verseID);
		var textboxDiv = document.getElementById("CommentTextDivID_" + verseID);
		if (textboxDiv && commentDiv)
		{
			//commentDiv.style.height = null;
			textboxDiv.style.position = "relative";
			textboxDiv.style.float = "top";
			textboxDiv.style.height = "100px";
			textboxDiv.style.width = commentDiv.offsetWidth-20 + "px";
			textboxDiv.style.marginTop = ".5em";
			textboxDiv.style.left = "5px";
		}
	}
} //adjustCommentTextBox()

function onComment(bookID, chapterID, verseID) {
	
	var commentID = "CommentDivID_" + verseID;
	var commentTextID = "CommentTextDivID_" + verseID;
	var commentTextName = "CommentText_" + verseID;
	var commentDiv = document.getElementById(commentID);
	var verseDiv = document.getElementById("verseId" + verseID);
	
	if (!commentDiv) //create comment div
	{
		if (verseDiv)
		{
			commentDiv = document.createElement('div');
			commentDiv.setAttribute('id', commentID);
			commentDiv.style.borderStyle = "solid";
			commentDiv.style.borderWidth = "2px";
			commentDiv.style.borderColor = "#a9a9a9";
			commentDiv.style.visibility = "visible";
			commentDiv.style.marginLeft = "2em";
			commentDiv.style.marginRight = "2em";
			commentDiv.style.backgroundColor = "#86b8f4";
			var textboxStr = "<textarea id=\"" + commentTextID + "\" name=\"" + commentTextName + "\"> </textarea>";
			var cancelBtnDivStr = "<span style=\"padding-left:.2em; margin-bottom:20px; margin-left:5px;\"><button onclick=\"javascript:onCancelCommentClick();\" class=\"btn\"><span><span>&nbsp&nbsp Cancel &nbsp&nbsp</span></span></button></span>";
			var postBtnDivStr = "<span style=\"margin-bottom:20px; margin-left:20px;\"><button onclick=\"javascript:onPostCommentClick();\" class=\"btn\"><span><span>&nbsp&nbsp&nbsp&nbsp Post &nbsp&nbsp&nbsp&nbsp</span></span></button></span>";
			var buttonsStr = "<div style=\"horizontal-align:right; float:bottom;\">" + cancelBtnDivStr + postBtnDivStr + "</div>";
			commentDiv.innerHTML = textboxStr + buttonsStr;
			verseDiv.appendChild(commentDiv);
			commentDiv = document.getElementById(commentID);
			
			adjustCommentTextBox(verseID);
			if (gPrevVerseNumber)
			{
				var prevVerseDiv = document.getElementById("verseId" + gPrevVerseNumber);
				var preCommentDiv = document.getElementById("CommentDivID_" + gPrevVerseNumber);
				prevVerseDiv.removeChild(preCommentDiv);
				gPrevVerseNumber = 0;
			}
			gPrevVerseNumber = verseID;

			if (!isLoggedIn())
			{
				disableCommentBox(commentTextID, "Please login to comment");
			}
		}
	}
	else
	{
		verseDiv.removeChild(commentDiv);
		gPrevVerseNumber = 0;
	}
}

function presentBible(contentTabs, booksDivID, chaptersDivID, versesDivID, 
	contentHeaderDivID, footerDivID, loginDivID, loginBoxDivID, facebookBtnDivID, 
	googleBtnDivID, maximizeBtnDiv, highlightVerseBtnID)
{
	$gcontentTabs = contentTabs;
	$gbooksDivID = booksDivID;
	$gchaptersDivID = chaptersDivID;
	$gversesDivID = versesDivID;
	$gcontentHeaderDivID = contentHeaderDivID;
	$gfooterDivID = footerDivID;
	$gloginButtonDivID = loginDivID;
	$gloginBoxDiv = loginBoxDivID;
	$gFacebookBtnDivID = facebookBtnDivID;
	$gGoogleBtnDivID = googleBtnDivID;
	$gMaximizeBtnDiv = maximizeBtnDiv;
	$ghighlightVerseBtnID = highlightVerseBtnID;
	
	loadImagesToCache();
	adjustGuestbookBotton();
	setMaxButton(1, 0);
	addLoginButton();
	initLoginBox();
	RefreshLoginButton(false, true);
	showLoginBox(0);
	loadBooks();
	autoLogin();
}

function autoLogin()
{
	if (IsLoginExpired())
		return;
	
	var user = GetSavedUserName();
	var pwd = GetSavedPassword();
	if (user!="" && pwd!="")
		doLogin(user, pwd, autoLoginSuccessCallback, autoLoginFailedCallback);
}

var autoLoginSuccessCallback = function(fullName, user, pwd) {
	RefreshLoginButton(false, true);
};

var autoLoginFailedCallback = function(message) {
	RefreshLoginButton(false, true);
};


function onCancelLoginClick()
{
	showLoginBox(0);
} //onCancelLoginClick()



var loginSuccessCallback = function(fullName, user, pwd) {
	
	SaveUserPassword(user, pwd, 7);
	ShowLoginStatus("Welcome " + fullName + "!");
	RefreshLoginButton(false, true);
};

var loginFailedCallback = function(message) {
	ShowLoginStatus(message);
	RefreshLoginButton(true, false);
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
		doLogin(userName, password, loginSuccessCallback, loginFailedCallback);
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

function initLoginBox()
{
	var loginBoxDiv = document.getElementById($gloginBoxDiv);
	var loginBtnDiv = document.getElementById("loginBtn");
	var loginInfoDiv = document.getElementById("loginInfoDivID");
	var contentHeaderDiv = document.getElementById($gcontentHeaderDivID);
	
	if (loginBoxDiv && loginBtnDiv && loginInfoDiv && contentHeaderDiv)
	{
		loginBoxDiv.style.position = "absolute";
		loginBoxDiv.style.width = "260px";
		loginBoxDiv.style.height = "125px";
		loginBoxDiv.style.top = (loginBtnDiv.offsetTop + loginBtnDiv.offsetHeight) + "px";
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
	$gsigninButtonNormal = new Image();
	$gsigninButtonDown = new Image();
	$gsigninButtonOver = new Image();
	$gsigninButtonExpanded = new Image();
	$gsignoutButton = new Image();
	$gmaxButton = new Image();
	$gmaxButtonDown = new Image();
	$gminButton = new Image();
	$gminButtonDown = new Image();
	$gguestBookButton = new Image();
	$gguestBookButtonDown = new Image();
	$gcloseBtn = new Image();
	$gcloseBtnDown = new Image();

	// load buttons before hand
	$gsigninButtonNormal.src = "themes/" + $g_theme + "/signin_normal.png";
	$gsigninButtonDown.scr = "themes/" + $g_theme + "/signin_down.png";
	$gsigninButtonOver.scr = "themes/" + $g_theme + "/signin_over.png";
	$gsigninButtonExpanded.src = "themes/" + $g_theme + "/signin_selected.png";
	$gsignoutButton.src = "themes/" + $g_theme + "/signout.png";
	$gmaxButton.src = "themes/" + $g_theme + "/maximize.png";
	$gmaxButtonDown.src = "themes/" + $g_theme + "/maximize_down.png";
	$gminButton.src = "themes/" + $g_theme + "/minimize.png";
	$gminButtonDown.src = "themes/" + $g_theme + "/minimize_down.png";
	$gguestBookButton.src = "themes/" + $g_theme + "/guestbook_normal.png";
	$gguestBookButtonDown.src = "themes/" + $g_theme + "/guestbook_pressed.png";
	$gcloseBtn.src = "themes/" + $g_theme + "/close_normal.png";
	$gcloseBtnDown.src = "themes/" + $g_theme + "/close_pressed.png";
	
} //loadImagesToCache()

function addLoginButton()
{
	if ($gloginButtonDivID != "")
	{
		var mouseOverEventStr = "onMouseOver=\"javascript:mouseOverLoginBtn();\" ";
		var mouseOutEventStr = "onMouseOut=\"javascript:mouseOutLoginBtn();\" ";
		var infoDivHtml = "<div id=\"loginInfoDivID\" style=\"position:relative; float:left; align:left; padding-top:2.1em; padding-right:1em; font-size: 10px; font-weight:bold; color:#2088F4\" > Not logged in </div>";
		var htmlText = "<div id=\"loginBtn\" style=\"position:relative; float:right; align:right; padding-top:1.2em;\" onclick=\"javascript:onLoginBtnCick();\" " + mouseOverEventStr + " " + mouseOutEventStr + " > <img id=\"loginBtnImg\" src=\"themes/" + $g_theme + "/signin_normal.png\"> </div>";
		document.getElementById($gloginButtonDivID).innerHTML = infoDivHtml + htmlText;
	}
} 

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
	// Close guestbook box if opened
	var guestbookBox = document.getElementById("guestbookDiv");
	if (guestbookBox)
	{
		onGuestbookClick("guestbookBtn");
		//onClickCloseBtn("guestbookDiv");
	}
	
	
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
			loginButtonDiv.innerHTML = "<img id=\"loginBtnImg\" src=\"themes/" + $g_theme + "/signout.png\">";
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
				loginButtonDiv.innerHTML = "<img id=\"loginBtnImg\" src=\"themes/" + $g_theme + "/signin_selected.png\">";
				loginBoxDiv.style.visibility = "visible";
				$gloginBoxVisible = 1;
			}
			else
			{
				loginButtonDiv.innerHTML = "<img id=\"loginBtnImg\" src=\"themes/" + $g_theme + "/signin_normal.png\">";
				loginBoxDiv.style.visibility = "hidden";
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
			loginButtonDiv.innerHTML = "<img id=\"loginBtnImg\" src=\"themes/" + $g_theme + "/signin_selected.png\">";
			initLoginBox();
			loginBoxDiv.style.visibility = "visible";
			$gloginBoxVisible = 1;
		}
		else
		{
			loginButtonDiv.innerHTML = "<img id=\"loginBtnImg\" src=\"themes/" + $g_theme + "/signin_normal.png\">";
			initLoginBox();
			loginBoxDiv.style.visibility = "hidden";
			$gloginBoxVisible = 0;
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

function onLoginBtnCick()
{
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
}

function loadSocialButtons()
{
	// TODO: Google BUZZ button is not working from here for some reason, revisit this!
	//var googleHtmlText = "<div id=\"googleBuzzBtnDiv\" style=\"float:right; padding-right:5px; width:100px; \" > <a title=\"Post on Google Buzz\" class=\"google-buzz-button\" href=\"http://www.google.com/buzz/post\" data-button-style=\"small-count\" data-message=\"Check out this cool Cloud Bible App!\" data-url=\"http://www.cloudstudybible.com\" data-imageurl=\"http://www.cloudstudybible.com/images/CloudBible_Transparent.png\"></a><script type=\"text/javascript\" src=\"http://www.google.com/buzz/api/button.js\"></script> </div>";
	//document.getElementById($gGoogleBtnDivID).innerHTML = googleHtmlText;
	
	var fbHtmlText = "<iframe src=\"http://www.facebook.com/plugins/like.php?href=http%253A%252F%252Fwww.cloudstudybible.com%252F&amp;layout=button_count&amp;show_faces=true&amp;width=60&amp;action=like&amp;font=arial&amp;colorscheme=light&amp;height=21\" scrolling=\"no\" frameborder=\"0\" style=\"border:1px; overflow:hidden; width:80px; height:20px;\" allowTransparency=\"true\"></iframe>";
	document.getElementById($gFacebookBtnDivID).innerHTML = fbHtmlText;
}
/*
function loadGoogleBtn()
{
}

function loadFacebookBtn()
{
	if ($gFacebookBtnDivID != "")
	{
		$gxmlhttpFB = null;
		$url = "http://www.facebook.com/plugins/like.php?href=http%253A%252F%252Fwww.cloudstudybible.com%252F&amp;layout=button_count&amp;show_faces=true&amp;width=60&amp;action=like&amp;font=arial&amp;colorscheme=light&amp;height=21";
		
		if (window.XMLHttpRequest)
		{
			// code for IE7+, Firefox, Chrome, Opera, Safari
			$gxmlhttpFB=new XMLHttpRequest();
		}
		else
		{
			// code for IE6, IE5
			$gxmlhttpFB=new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		$gxmlhttpFB.open("GET",$url,true);
		$gxmlhttpFB.send(null);
		
		$gxmlhttpFB.onreadystatechange = (function facebookBtnReceived() {
			if ($gxmlhttpFB.readyState==4)
			{
				var htmlText = "<iframe scrolling=\"no\" frameborder=\"0\" style=\"border:1px; overflow:hidden; width:60px; height:20px;\" allowTransparency=\"true\">";
				htmlText = htmlText + $gxmlhttpFB.responseText;
				htmlText = htmlText + "</iframe>";
				document.getElementById($gFacebookBtnDivID).innerHTML = htmlText;
			}
			else
			{
				document.getElementById($gFacebookBtnDivID).innerHTML = "Loading...";
			}
		}
	}
}
*/

function ClearVerses()
{
	var elem = document.getElementById($gversesDivID);
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
	document.getElementById($gversesDivID).innerHTML  = "<p><b>Loading...</b></p>";
}
function HideProgressOnVerses() 
{
	document.getElementById($gversesDivID).style.backgroundImage  = 'none';
} //HideProgressOnVerses()


function ShowProgressOnBooks()
{
	document.getElementById($gbooksDivID).style.backgroundImage  = 'url(images/progress_small.gif)';
	document.getElementById($gbooksDivID).style.backgroundRepeat = 'no-repeat';
	document.getElementById($gbooksDivID).style.backgroundPosition = 'center center';
	document.getElementById($gbooksDivID).innerHTML  = "<p><b>Loading...</b></p>";
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
	document.getElementById($gchaptersDivID).innerHTML  = "<p><b>Loading...</b></p>";
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
			document.getElementById(searchContentDivID).style. autoScroll = "true";
			document.getElementById(searchContentDivID).style. overflow = "auto";
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
    loadVerses($gcurrentBookName, $gcurrentBookID, $gcurrentChapterNumber, 1, $gcurrentVerseNumber);
    scrollToBook($gcurrentBookID);
    scrollToChapter($gcurrentChapterNumber);
} //loadCurrentChapter()

function goToVerse(bookName, bookID, chapterNumber, verseNumber) {
    loadBookChapterNumbers(bookID, bookName, 1, chapterNumber, verseNumber);

    scrollToBook(bookID);
    scrollToChapter(chapterNumber);
} //GoToVerse()


function scrollToBook(bookID) {
    $bookDivTop = document.getElementById("bookId" + bookID).offsetTop;
    $bookDivHeight = document.getElementById("bookId" + bookID).offsetHeight;
    document.getElementById($gbooksDivID).scrollTop = $bookDivTop - ($bookDivHeight * 2);
} //scrollToBook()

function scrollToChapter(chapterID) {
    $chapterDivTop = document.getElementById(chapterID).offsetTop;
    $chapterDivHeight = document.getElementById(chapterID).offsetHeight;
    document.getElementById($gchaptersDivID).scrollTop = $chapterDivTop - ($chapterDivHeight * 2);
} //scrollToChapter()

function scrollToVerse(verseNumber) {
    $verseDivID = "verseId" + verseNumber;
    $verseDivTop = document.getElementById($verseDivID).offsetTop;
    $verseDivHeight = document.getElementById($verseDivID).offsetHeight;
    document.getElementById($gversesDivID).scrollTop = $verseDivTop - ($verseDivHeight * 2); //search added to the content div
} //scrollToVerse()

// loadVerses: scrollToDiv is sent by "genchapter.php". Rest of the calls ignore this parameter
function loadVerses(bookName, bookID, chapterNumber, scrollToDiv, scrollToVerseID)
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
	
	$chapterUrlStr = "./biblejs/getchapter.php?b=" + $gcurrentBookID + "&c=" + $gcurrentChapterNumber + "";
	$gxmlhttpVerses.open("GET",$chapterUrlStr,true);
	$gxmlhttpVerses.send(null);
	
	$gxmlhttpVerses.onreadystatechange=(function stateChanged() { 
		if ($gxmlhttpVerses.readyState==4) {
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

			scrollToVerse($gcurrentVerseNumber);
			
			mouseOnVerse($verseDivID);
			mouseOffVerse($verseDivID);
		}
		else {
			ClearVerses();
			ShowProgressOnVerses();
			if ($gcurrentChapterNumber == 0) {
				document.getElementById($gcontentHeaderDivID).innerHTML = "<b>" + "Loading " + $gcurrentBookName + "..." + "</b>";
				$gcurrentChapterNumberpterNumber = 1;
			}
			else { 
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


// loadBookChapterNumbers : scrollToDiv is sent by "genchapter.php". Rest of the calls ignore this parameter
function loadBookChapterNumbers(bookID, bookName, scrollToDiv, gotoChapter, gotoVerseNumber) 
{
	$globalBackColor="#fefefe";
	$url = "./biblejs/getchaptercount.php?b=" + bookID;
	
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
	
	$gxmlhttpBookChapters.onreadystatechange = (function chapterCountReceived() {
		if ($gxmlhttpBookChapters.readyState==4) {
			//document.getElementById($gchaptersDivID).innerHTML=$gxmlhttpBookChapters.responseText;
			HideProgressOnChapters();
			$chaptersHtml = "";
			var count = $gxmlhttpBookChapters.responseText;
			var i=0;
			for (i = 1; i <= count; i++) 
			{
			    $urlStr = "./biblejs/getchapter.php?b=" + $gcurrentBookID + "&c=" + i;
				$onClickStr = "onclick=\"javascript:loadVerses('" + $gcurrentBookName + "', '" + $gcurrentBookID + "', '" + i + "',0,1);\" ";
				$chNo = i;
				
				$mouseEventStr = "onMouseOver=\"mouseOnChapter('" + $chNo + "');\"; onMouseOut=\"mouseOffChapter('" + $chNo + "');\" ";
				
				
				//$hrefStr = "href='javascript:loadVerses('" + $gcurrentBookName + "', '" + $gcurrentBookID + "', '" + i + "');'";
				$hrefStr = "href=\"javascript: loadVerses('" + $gcurrentBookName + "', '" + $gcurrentBookID + "', '" + i + "',1,1);\"";
				
				//$styleStr = "style=\"font-family:Tahoma; font-size:10px; color:#000099; background-color:rgba(255,255,255,50); text-align: center; vertical-align:middle; position: relative; font-size:12px; margin-top:15px; left: 18%; width: 70%\"";
				$styleStr2 = "style=\"padding-left:1em; padding-right:1em; padding-top:.2em; padding-bottom:.2em; background-color:$globalBackColor; font-family:Tahoma; border-bottom: 1px solid #cccccc; text-align: center; vertical-align: middle;\"";
				
				//$line = "<div id=\"" + i + "\" " + $styleStr + ">" + "<a " + $hrefStr + ">" + "<b>" + i + "</b>" + "</a>" + "</div>";
				$line = "<div id=\"" + i + "\" " + $styleStr2 + $onClickStr + $mouseEventStr + ">"  + i + "</div>";	
							
				$chaptersHtml = $chaptersHtml + $line;
			}
			document.getElementById($gchaptersDivID).innerHTML = $chaptersHtml;
			document.getElementById($gchaptersDivID).scrollTop = 0;
			if (scrollToDiv == 1) {
			    scrollToBook($gcurrentBookID);
			}
			$prevChapterDivId="";
			
			// This function gets called only when clicked on book or on books load, so we don't give chapter#. Zero will be treated as 1st chapter.
			loadVerses($gcurrentBookName, $gcurrentBookID, $gcurrentChapterNumber, 1, $gcurrentVerseNumber);

		}
		else
		{
			ShowProgressOnChapters();
			ClearVerses();
			ShowProgressOnVerses();
			document.getElementById($gchaptersDivID).innerHTML="Loading...";
		}
		document.getElementById($gchaptersDivID).visibility = "visible";
	});
} //loadBookChapterNumbers()


function loadBooks()
{
	$gcurrentBookName = "";
	$gcurrentBookID = 0;
	$gcurrentChapterNumber = 0;
	$gcurrentVerseNumber = 0;
	
	$url = "./biblejs/getbooks.php";
	
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
			HideProgressOnBooks();
			document.getElementById($gbooksDivID).innerHTML=$gxmlhttpBooks.responseText;
			document.getElementById($gbooksDivID).scrollTop = 0;
			
			// Load chapter numbers for first book.
			$gcurrentBookName = document.getElementById('bookId1').innerHTML;
			$gcurrentBookID = 1;
			loadBookChapterNumbers($gcurrentBookID, $gcurrentBookName, 1, 1, 1);
			loadSocialButtons();
		}
		else
		{
			ClearVerses();
			ShowProgressOnBooks();
			ShowProgressOnChapters();
			ShowProgressOnVerses();
			document.getElementById($gbooksDivID).innerHTML="Loading...";
		}
	});
} //loadBooks()



