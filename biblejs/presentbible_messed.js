
$gbooksDivID="";
$gchaptersDivID="";
$gversesDivID="";
$gcontentHeaderDivID="";
$gfooterDivID="";
$gsearchBoxDivID = "searchBoxDiv";

// HTTP request objects
$gxmlhttpBooks = null;
$gxmlhttpBookChapters = null;
$gxmlhttpVerses = null;
$gxmlhttpSearch = null;

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

function showSearchResults(resultHTML)
{
	var divID = $gsearchBoxDivID + "_content_text";
	commentTextDiv = document.getElementById(divID);
	if (commentTextDiv)
	{
		commentTextDiv.innerHTML = resultHTML;
		contentTextDiv.setAttribute('class', "commenttextarea");
	}
}

function createCommentBox(divID, parentDivID, left, top, width, height)
{
	var commentDiv;

	commentDiv = document.getElementById(divID);
	
	if (!commentDiv)
	{	
		commentDiv = document.createElement('div');
		commentDiv.setAttribute('id', divID);
		
		var titleDivID = divID + "_title";
		var contentDivID = divID + "_content";
		var contentTextDivID = contentDivID + "_text";
		
		if (left)
			commentDiv.style.left = left + "px";
		
		if (top)
			commentDiv.style.top = top + "px";
		
		commentDiv.style.width = width + "px";
		commentDiv.style.height = height + "px";
		commentDiv.style.position = "absolute";
		commentDiv.style.float = "left";
		
		var titleDiv = document.createElement('div');
		titleDiv.setAttribute('id', titleDivID);
		titleDiv.setAttribute('class', "commenttitle");
		titleDiv.innerHTML = "Comment";
		titleDiv.style.position = "relative";
		
		var contentDiv = document.createElement('div');
		contentDiv.setAttribute('id', contentDivID);
		contentDiv.setAttribute('class', "commentarea");
		contentDiv.style.position = "relative";
		//contentDiv.innerHTML = "Please enter your comments here";
		
		var contentTextDiv = document.createElement('div');
		contentTextDiv.setAttribute('id', contentTextDivID);
		contentTextDiv.setAttribute('class', "commenttextarea");
		contentTextDiv.innerHTML = "";
		//contentTextDiv.style.position = "relative";
		//contentTextDiv.style.autoScroll = "true";
		//contentTextDiv.style.overflow = "auto";
		
		contentDiv.appendChild(contentTextDiv);
		commentDiv.appendChild(titleDiv);
		commentDiv.appendChild(contentDiv);
		
		//document.body.appendChild(commentDiv);
		document.getElementById(parentDivID).appendChild(commentDiv);;
	}
} //createCommentBox()

function initializeTheme() {
	document.getElementById("headerImageDiv").innerHTML = "<img src=\"themes/" + $g_theme + "/CloudBible_Transparent.png\" width=75;/>";
	document.getElementById("logoImageDiv").innerHTML = "<img src=\"themes/" + $g_theme + "/logo.png\"/>";
	
	
	document.getElementById("booksHeader").style.backgroundImage = "url('themes/" + $g_theme + "/title_background.jpg')";
	document.getElementById("booksHeader").style.backgroundRepeat = "repeat";
	
	document.getElementById("chaptersHeader").style.backgroundImage = "url('themes/" + $g_theme + "/title_background.jpg')";
	document.getElementById("chaptersHeader").style.backgroundRepeat = "repeat";
	
	document.getElementById("versesHeaderBar").style.backgroundImage = "url('themes/" + $g_theme + "/title_background.jpg')";
	document.getElementById("versesHeaderBar").style.backgroundRepeat = "repeat";

	document.getElementById("header").style.backgroundImage = "url('themes/" + $g_theme + "/dashboard_background.jpg')";
	document.getElementById("header").style.backgroundRepeat = "repeat";
	
	document.getElementById("footer").style.backgroundImage = "url('themes/" + $g_theme + "/dashboard_background.jpg')";
	document.getElementById("footer").style.backgroundRepeat = "repeat";
	
}


function onSearchClick(searchTextID) { 
	var searchText = document.getElementById(searchTextID).value;
	searchBible(searchText);
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
	
	document.getElementById(verseDivID).style.backgroundImage = "url('themes/" + $g_theme + "/verse_background.jpg')";
	document.getElementById(verseDivID).style.backgroundRepeat = "repeat";
}

function mouseOffVerse(verseDivID) {
	document.getElementById(verseDivID).style.backgroundImage = "none";
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

function mouseOnChapter(chNo) {
	document.getElementById(chNo).style.cursor = "pointer";
	document.getElementById(chNo).style.backgroundImage = "url('themes/" + $g_theme + "/book_selection_background.jpg')";
}

function mouseOffChapter(chNo) {
	document.getElementById(chNo).style.cursor = "default";
	document.getElementById(chNo).style.backgroundImage = "none";
}

function mouseOnBook(bookDivID) {
	document.getElementById(bookDivID).style.cursor = "pointer";
	document.getElementById(bookDivID).style.backgroundImage = "url('themes/" + $g_theme + "/book_selection_background.jpg')";
}

function mouseOffBook(bookDivID) {
	document.getElementById(bookDivID).style.cursor = "default";
	document.getElementById(bookDivID).style.backgroundImage = "none";
}


function onComment(bookID, chapterID, verseID) {
	$alertText = "Did you want to add comment/notes to " + $gcurrentBookName + " " + chapterID + ":" + verseID + "? Please have patience, we're working on it!";
	alert($alertText);
}

function presentBible(booksDivID, chaptersDivID, versesDivID, contentHeaderDivID, footerDivID)
{
	$gbooksDivID = booksDivID;
	$gchaptersDivID = chaptersDivID;
	$gversesDivID = versesDivID;
	$gcontentHeaderDivID = contentHeaderDivID;
	$gfooterDivID = footerDivID;
	
	/*
	document.getElementById($gbooksDivID).style.borderStyle = "solid";
    	document.getElementById($gbooksDivID).style.borderWidth = "2px";
    	document.getElementById($gbooksDivID).style.borderColor = "#006000";	
	
	document.getElementById($gchaptersDivID).style.borderStyle = "solid";
    	document.getElementById($gchaptersDivID).style.borderWidth = "2px";
    	document.getElementById($gchaptersDivID).style.borderColor = "#006000";	

	document.getElementById($gversesDivID).style.borderStyle = "solid";
    	document.getElementById($gversesDivID).style.borderWidth = "2px";
    	document.getElementById($gversesDivID).style.borderColor = "#006000";
	
	document.getElementById($gcontentHeaderDivID).style.borderStyle = "solid";
    	document.getElementById($gcontentHeaderDivID).style.borderWidth = "2px";
    	document.getElementById($gcontentHeaderDivID).style.borderColor = "#006000";
	
	document.getElementById($gfooterDivID).style.borderStyle = "solid";
    	document.getElementById($gfooterDivID).style.borderWidth = "2px";
    	document.getElementById($gfooterDivID).style.borderColor = "#006000";
	*/	
	loadBooks();
}

function ClearVerses()
{
	var elem = document.getElementById($gversesDivID);
	while(elem.firstChild)
	{
		elem.removeChild(elem.firstChild);
	}
}

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


function ShowProgressOnSearchBox()
{
	var elem = document.getElementById($gsearchBoxDivID);
	if (elem)
	{
		elem.style.backgroundImage  = 'url(images/progress_small.gif)';
		elem.style.backgroundRepeat = 'no-repeat';
		elem.style.backgroundPosition = 'center center';
		showSearchResults("Searching 2...");
	}
	
} //ShowProgressOnSearchBox()
function HideProgressOnSearchBox() 
{
	var elem = document.getElementById($gsearchBoxDivID);
	if (elem)
	{
		elem.style.backgroundImage  = 'none';
	}
} //HideProgressOnSearchBox()


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


function showSearchBox() 
{
	var versesElem = document.getElementById($gversesDivID);
	var versesWidth = versesElem.style.width;
	var versesHeight = versesElem.style.height;
	var newVersesWidth = versesElem.style.width * 60/100;
	var searchBoxWidth = 400;//"400px"; //versesElem.style.width * 40/100;
	var searchBoxHeight = 700;//"700px"; //versesElem.style.height;
	
	//versesElem.width = newVersesWidth + "px";
	//versesElem.width = newVersesWidth + "px";
	
	//var versesWidth = document.getElementById($gversesDivID);
	var parentNode = versesElem.parentNode.parentNode.parentNode;
	createCommentBox($gsearchBoxDivID, $gversesDivID, 100, 0, searchBoxWidth, searchBoxHeight);
}

// searchBible:
function searchBible(searchText)
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
	
	$searchUrlStr = "./biblejs/search.php?s=" + searchText;
	$gxmlhttpSearch.open("GET",$searchUrlStr,true);
	$gxmlhttpSearch.send(null);
		
	$gxmlhttpSearch.onreadystatechange=(function stateChanged() { 
		if ($gxmlhttpSearch.readyState==4) {
			//HideProgressOnBooks();
			//HideProgressOnChapters();
			//HideProgressOnVerses();
			HideProgressOnSearchBox();
			showSearchResults($gxmlhttpSearch.responseText);
			//document.getElementById($gsearchBoxDivID).innerHTML = $gxmlhttpSearch.responseText;
			//document.getElementById($gsearchBoxDivID).scrollTop = 0;
		}
		else {
			//ClearVerses();
			showSearchBox();
			ShowProgressOnSearchBox();
			//document.getElementById($gcontentHeaderDivID).innerHTML = "<b>" + "Searching... </b>";
		}
	});

} //searchBible()

// searchBibleOld:
function searchBibleOld(searchText)
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
	
	$searchUrlStr = "./biblejs/search.php?s=" + searchText;
	$gxmlhttpSearch.open("GET",$searchUrlStr,true);
	$gxmlhttpSearch.send(null);
		
	$gxmlhttpSearch.onreadystatechange=(function stateChanged() { 
		if ($gxmlhttpSearch.readyState==4) {
			HideProgressOnBooks();
			HideProgressOnChapters();
			HideProgressOnVerses();
			document.getElementById($gversesDivID).innerHTML = $gxmlhttpSearch.responseText;
			document.getElementById($gversesDivID).scrollTop = 0;
			document.getElementById($gcontentHeaderDivID).innerHTML = "<b> Search Results </b>";
		}
		else {
			ClearVerses();
			ShowProgressOnVerses();
			document.getElementById($gcontentHeaderDivID).innerHTML = "<b>" + "Searching... </b>";
		}
	});

} //searchBibleOld()

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
    document.getElementById($gversesDivID).scrollTop = $verseDivTop - $verseDivHeight;
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
$selectedBookBkColor = "#aaaaaa";
$selectedChapterBkColor = "#aaaaaa";

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
		if ($prevBookBkColor != "")
			document.getElementById($prevBookDivId).style.backgroundColor = $prevBookBkColor;
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
		if ($prevChapterBkColor != "")
			document.getElementById($prevChapterDivId).style.backgroundColor = $prevChapterBkColor;
		else
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



