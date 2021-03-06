<?php
// Returns list of books in given translation

$bookNumber=0;
$chapterNumber=0;
$verseNumber=0;
$con;
$globalBackColor="#fefefe";


getInput();
getContent();




/////////////////////////////////////////////////////////

function getInput()
{
	global $bookNumber;
	global $chapterNumber;
	global $verseNumber;
	
	$bookNumber=$_GET["b"];
	$chapterNumber=$_GET["c"];
	$verseNumber=$_GET["v"];
	
	if (!$bookNumber)
		$bookNumber = 1;
	if (!$chapterNumber)
		$chapterNumber = 1;
}

function openDBConnection()
{
	global $con;
	$con = mysql_connect("localhost","davean8_johng","win32api");
	if (!$con)
	{
		die('Could not connect: ' . mysql_error());
	}
	mysql_select_db("davean8_Bible", $con);
}

function closeDBConnection()
{
	global $con;
	mysql_close($con);
}

$nextChapterError=0;

function getContent()
{
	global $bookNumber;
	global $chapterNumber;
	global $verseNumber;
	global $globalBackColor;
	
	openDBConnection();
	$sql0="SELECT FullName FROM AsvBooks WHERE ID='$bookNumber'";
    //echo $sql0;
	$result0=mysql_query($sql0);
	$bookName=mysql_result($result0,0,"FullName");
    
    
	$sql1="SELECT ID FROM AsvChapters WHERE BookID='$bookNumber' AND ChapterNumber='$chapterNumber'";
    //echo $sql1;
	$result1=mysql_query($sql1);
	$chapterID=mysql_result($result1,0,"ID");
	
	$sql2="";
	
	if ($verseNumber>0)
		$sql2="SELECT * FROM AsvVerses WHERE ChapterID='$chapterID' AND VerseNumber='$verseNumber'";
	else
		$sql2="SELECT * FROM AsvVerses WHERE ChapterID='$chapterID'";
    //echo $sql2;

	$result2=mysql_query($sql2);
	$rowCount=mysql_numrows($result2);
	
    
	
	$index=0;
	$contentDiv="";	
	//echo "<p style=\"align:center\"><b><u>$bookName $chapterNumber</u></b></p>";
	while ($index < $rowCount) {
		$verseID=mysql_result($result2,$index,"ID");
		$verseNumber=mysql_result($result2,$index,"VerseNumber");
		$verse=mysql_result($result2,$index,"Verse");
		
		$sql3="SELECT Comment FROM Comments WHERE VerseID='$verseID' AND Deleted='0'";
		$result3=mysql_query($sql3);
		$rowCountComments=mysql_numrows($result3);
		
		$divID=0;
		//if ($verseNumber>0)
		//	$divID = $verseNumber + $index;
		//else
		//	$divID=$index+1;
		$divID=$index+1;
		//$bkColor="";//"#eeffee";
		if ($index%2)
			$bkColor="#fdfffd";
		else
			$bkColor="#eeeeee";
		$bkColor=$globalBackColor;
		$mouseClickEventStr = "onClick=\"javascript:clickOnVerse('asvVerseId$divID');\" ";
		$mouseOverEventStr = "onMouseOver=\"javascript:mouseOnVerse('asvVerseId$divID');\" ";
		$mouseOutEventStr = "onMouseOut=\"javascript:mouseOffVerse('asvVerseId$divID');\" ";
		
		$styleStr = "";
		if ($index == 0) // use both top and bottom border
			$styleStr = "style=\"padding-left:1em; padding-right:1em; padding-top:1em; padding-bottom:1em; font-family:Tahoma; border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc;\"";
		else // just the bottom border
			$styleStr = "style=\"padding-left:1em; padding-right:1em; padding-top:1em; padding-bottom:1em; font-family:Tahoma; border-bottom: 1px solid #cccccc;\"";
		
        
		$newcommentImgStr = "";
		$mouseOverCommentsStr = "onMouseOver=\"javascript:onMouseOverCommentBtn('AsvNewCommentBtnId$divID');\" ";
		$mouseOutCommentsStr = "onMouseOut=\"javascript:onMouseOutCommentBtn('AsvNewCommentBtnId$divID');\" ";
		$facebookImageDivStr = "<span> <img id=\"AsvFBBtnId$divID\" style=\"position:relative; top:2px;\" onclick=\"javascript:onFacebookBtnClicked('$bookName $chapterNumber:$verseNumber (ASV)', '$verse', '');\" onMouseOver=\"style.cursor='pointer';\" src=\"biblejs/images/fb.png\" height=\"17\" width=\"17\" title=\"Share $bookName $chapterNumber:$verseNumber with your friends on the facebook\"/> &nbsp;&nbsp;&nbsp;&nbsp; </span>";
		
		if ($rowCountComments > 0) // when comment(s) exist
		{
			$newcommentImgStr = "<span id=\"AsvNewCommentBtnId$divID\" verseiddb=\"$verseID\" chapteriddb=\"$chapterID\" bookiddb=\"$bookNumber\" bookName=\"$bookName\" chapterNumber=\"$chapterNumber\" verseNumber=\"$verseNumber\" commentCount=\"$rowCountComments\" $mouseOverCommentsStr $mouseOutCommentsStr title=\"$rowCountComments comment(s) on $bookName $chapterNumber:$verseNumber, click to view or add a new comment on this verse.\" onclick=\"javascript:onShowComments('$bookNumber','$chapterID','$verseID','$verseNumber','$divID', 'asvVerseId');\" style=\"background-image:url(biblejs/images/comments_show_small.png); background-repeat:no-repeat; background-position:center center;padding:.1em;\"> <span style=\"position:relative; top:-4px; font-size:9px; font-weight:bold; color:#aa0000;\">&nbsp;&nbsp; $rowCountComments &nbsp;&nbsp;</span></span>";
		}
		else // when there are no comments
		{
			$newcommentImgStr = "<span id=\"AsvNewCommentBtnId$divID\" verseiddb=\"$verseID\" chapteriddb=\"$chapterID\" bookiddb=\"$bookNumber\" bookName=\"$bookName\" chapterNumber=\"$chapterNumber\" verseNumber=\"$verseNumber\" commentCount=\"$rowCountComments\" $mouseOverCommentsStr $mouseOutCommentsStr title=\"Click here to comment on $bookName $chapterNumber:$verseNumber\" onclick=\"javascript:onShowComments('$bookNumber','$chapterID','$verseID','$verseNumber','$divID', 'asvVerseId');\" style=\"background-image:url(biblejs/images/comments_normal_small.png); background-repeat:no-repeat; background-position:center center;padding:.1em;\">&nbsp;&nbsp;&nbsp;&nbsp;</span>";
		}
		$line = "<div id=\"asvVerseId$divID\" verse=\"$verse\" $mouseClickEventStr $mouseOverEventStr $mouseOutEventStr $styleStr\"><span style=\"color:#000099;\">$divID.</span> \t $verse $newcommentImgStr $showCommentsImgStr $facebookImageDivStr </div>";
		
		$contentDiv = $contentDiv . $line;
		$index++;
        //$verseNumber++;
	}
    
    // Prepare next chapter link...
    
    $nextChapterLink = "";
    $nextBookName = "";
    $nextBookID=0;
    $nextChapterNum=0;
    
    $old_error_handler = set_error_handler("myErrorHandler");
    $nextChapterError = 0;
    $nextChapterID=$chapterID+1;
    $sqlStrNextCh="SELECT * FROM Chapters WHERE ID='$nextChapterID'";
	$resultNextCh=mysql_query($sqlStrNextCh);
    if ($resultNextCh)
    {
        $nextBookID=mysql_result($resultNextCh,0,"BookID");
        $nextChapterNum=mysql_result($resultNextCh,0,"ChapterNumber");
        
        $sqlStrNextBk="SELECT FullName FROM Books WHERE ID='$nextBookID'";
	    $resultNextBk=mysql_query($sqlStrNextBk);
	    $nextBookName=mysql_result($resultNextBk,0,"FullName");
	
	if ($nextChapterNum == 1)
	{
		$nextChapterLink = "<div id=\"nextChapterDiv\" style=\"padding-left:1em; padding-right:1em; padding-top:1em; padding-bottom:1em; text-align:right;\"> <a href=\"javascript:loadBookChapterNumbers(
            '$nextBookID','$nextBookName','1','1','1','0');\"> <h5>Next Chapter - $nextBookName $nextChapterNum -> </h5> </a> </div>";
	}
	else
	{
		$scrollStr = "document.getElementById($gchaptersDivID).scrollTop = document.getElementById($gcurrentChapterNumber).offsetTop;";
		$nextChapterLink = "<div id=\"nextChapterDiv\" style=\"padding-left:1em; padding-right:1em; padding-top:1em; padding-bottom:1em; text-align:right;\"> <a href=\"javascript:loadVerses(
			'$nextBookName', '$nextBookID', '$nextChapterNum', '1','1','0');\"> <h5>Next Chapter - $nextBookName $nextChapterNum -> </h5> </a> </div>";
	}
    }
    closeDBConnection();
    if ($nextChapterError == 0 && $nextBookName && $nextBookID && $nextChapterNum)
    {
        $contentDiv = $contentDiv . $nextChapterLink;
    }
    set_error_handler($old_error_handler);
	echo $contentDiv;	
}

function myErrorHandler($errno, $errstr, $errfile, $errline)
{
    $nextChapterError = 1;
}

?>
