<?php
// Returns latest social updates

$gTask="";
$userName="";
$loggedInUserID = "";

getInput();
doTask();

function doTask()
{
	global $gTask;
	
	if ($gTask=="json")
		doGetUpdatesJSON();
	else
		doGetUpdates();
	
}


function doGetUpdatesJSON()
{
	openDBConnection();
	$sql0 = "select VerseID, ChapterID from Comments WHERE Deleted='0' group by VerseID order by max(ID) DESC";
	$result0 = mysql_query($sql0);
	if (!$result0)
		die('Select statement failed: ' . mysql_error());
	$rowCount0=mysql_numrows($result0);
	$index0 = 0;
	$lastIndex0 = $rowCount0-1;
	$row0=null;
	echo "{\"CommentedVerses\": [ ";
	while($row0 = mysql_fetch_array($result0))
	{
		$verseID0 = $row0['VerseID'];	
		$chapterID = $row0['ChapterID'];
		$verseText = "";
		$sql1="SELECT * from Comments WHERE VerseID='$verseID0' AND Deleted='0'";
		$result1=mysql_query($sql1);
		$rowCount1=mysql_numrows($result1);
		$index1 = 0;
		
		// From verses table
		$sqlVerses="SELECT * FROM Verses where ID='$verseID0'";
		$resultVerses=mysql_query($sqlVerses);
		$verseNumber = mysql_result($resultVerses, 0, "VerseNumber");
		$verseText = mysql_result($resultVerses, 0, "Verse");
		
		// From chapters table
		$sqlChapters="SELECT * FROM Chapters where ID='$chapterID'";
		$resultChapters=mysql_query($sqlChapters);
		$chapterNumber = mysql_result($resultChapters, 0, "ChapterNumber");
		$bookID = mysql_result($resultChapters, 0, "BookID");
		
		// From books table
		$sqlBooks="SELECT * FROM Books where ID='$bookID'";
		$resultBooks=mysql_query($sqlBooks);
		$bookName = mysql_result($resultBooks, 0, "FullName");
		$testamentID = mysql_result($resultBooks, 0, "Testament");
		
		$index1 = 0;		
		$verseText = str_replace("\"", "&#34;", $verseText);
		echo "{\"VerseID\":\"$verseID0\", \"BookID\":\"$bookID\", \"BookName\": \"$bookName\", \"ChapterID\": \"$chapterID\", \"ChapterNumber\": \"$chapterNumber\", \"VerseNumber\": \"$verseNumber\", \"VerseText\": \"$verseText\", \"Comments\": [";
		
		$lastIndex1 = $rowCount1-1;
		while ($index1 < $rowCount1) 
		{
			$showComment = "block";
			//if (($rowCount1>1) && ($index1==$rowCount1-1))
			//{
				// Close hidden comments container div
				//echo "</div>";
			//}
			$userID = mysql_result($result1, $index1, "UserID");
			$commentID = mysql_result($result1, $index1, "ID");
			$isPublic = mysql_result($result1, $index1, "IsPublic");
			// From users table
			$userFullName = "";
			$sqlUsers="SELECT * FROM Users where ID='$userID'";
			$resultUsers=mysql_query($sqlUsers);
			$userName = mysql_result($resultUsers, 0, "UserName");
			$userFirstName = mysql_result($resultUsers, 0, "FirstName");
			$userLastName = mysql_result($resultUsers, 0, "LastName");
			$userMiddleInitial = mysql_result($resultUsers, 0, "MiddleInitial");
			if ($userMiddleInitial == "")
				$userFullName = $userFirstName . " " . $userLastName;
			else
				$userFullName = $userFirstName . " " . $userMiddleInitial ." " . $userLastName;
			
			$commentText = mysql_result($result1, $index1, "Comment");
			$commentTimeStamp = mysql_result($result1, $index1, "UpdatedDateTime");
			$dateTimeVar = new DateTime($commentTimeStamp);
			$dateStr = $dateTimeVar->format("F d, Y (l)");
			$timeStr = $dateTimeVar->format("h:i a");
			
			// TODO: Filter private comments
			
			$commentText = str_replace("\"", "&#34;", $commentText);
			
			if ($index1>=$lastIndex1)
				echo "{\"CommentID\": \"$commentID\", \"CommentText\":\"$commentText\", \"UserID\":\"$userID\", \"UserFullName\": \"$userFullName\", \"Date\":\"$dateStr\", \"Time\":\"$timeStr\"}";
			else
				echo "{\"CommentID\": \"$commentID\", \"CommentText\":\"$commentText\", \"UserID\":\"$userID\", \"UserFullName\": \"$userFullName\", \"Date\":\"$dateStr\", \"Time\":\"$timeStr\"}, ";
			$index1++;
		}
		if  ($index0 >= $lastIndex0) //if last?
			echo "]}";
		else
			echo "]},";		
		$index0++;
	}
	echo "]}"; //End of "{\"CommentedVerses\": [ 
	closeDBConnection();
} //doGetUpdatesJSON()

function doGetUpdates()
{
	openDBConnection();
	//$sql0 = "select VerseID from Comments group by VerseID order by max(ID) DESC";
	$sql0 = "select * from Comments WHERE Deleted='0' group by VerseID order by max(ID) DESC";
	
	//$sql0 = "select Comments.VerseID, Verses.Verse from Comments JOIN Verses ON Comments.VerseID=Verses.ID group by VerseID order by max(Comments.ID) DESC";
	$result0 = mysql_query($sql0);
	if (!$result0)
		die('Select statement failed: ' . mysql_error());
	$rowCount0=mysql_numrows($result0);
	$index0 = 0;
	$row0=null;
	while($row0 = mysql_fetch_array($result0))
	{
		$verseID0 = $row0['VerseID'];	
		$chapterID = $row0['ChapterID'];
		$verseText = "";
		$sql1="SELECT * from Comments WHERE VerseID='$verseID0' AND Deleted='0'";
		$result1=mysql_query($sql1);
		$rowCount1=mysql_numrows($result1);
		$index1 = 0;
		
		// From verses table
		$sqlVerses="SELECT * FROM Verses where ID='$verseID0'";
		$resultVerses=mysql_query($sqlVerses);
		$verseNumber = mysql_result($resultVerses, 0, "VerseNumber");
		$verseText = mysql_result($resultVerses, 0, "Verse");
		
		// From chapters table
		$sqlChapters="SELECT * FROM Chapters where ID='$chapterID'";
		$resultChapters=mysql_query($sqlChapters);
		$chapterNumber = mysql_result($resultChapters, 0, "ChapterNumber");
		$bookID = mysql_result($resultChapters, 0, "BookID");
		
		// From books table
		$sqlBooks="SELECT * FROM Books where ID='$bookID'";
		$resultBooks=mysql_query($sqlBooks);
		$bookName = mysql_result($resultBooks, 0, "FullName");
		$testamentID = mysql_result($resultBooks, 0, "Testament");
		
		$index1 = 0;
		$fullCommentDivLine="";
		$commentsIds="";
		$finalLine = "<div class=\"\" style=\"background-color:#ffffff; border-bottom:solid 2px #86B8F4; margin-left:2em; margin-right:2em; margin-top:.3em; padding-left:1em; padding-right:1em; padding-top:1em; padding-bottom:1em;\">";
		echo $finalLine;
		
		//background-color:#86B8F4; //titlebar color
		echo "<div class=\"\" style=\"margin-bottom:.4em; color:#333333;\"><span title=\"Click here to go to $bookName $chapterNumber:$verseNumber.\" style=\"color:#000090; padding-left:.2em; padding-right:.2em;\" onclick=\"javascript:goToVerse('$bookName','$bookID','$chapterNumber','$verseNumber',2);\" onMouseOver=\"this.style.color='#bb0000'; this.style.cursor='pointer';\" onMouseOut=\"this.style.color='#000090';\"><b>" . $bookName . " " . $chapterNumber . ":" . $verseNumber . "  " . $verseText . "</b> </span></div>";
		if ($rowCount1>1)
		{
			//echo "<div style = \"background-color:#ffffff; font-family:courier; font-size:14px; color:#cc0000; padding-left:1em; padding-right:1em; margin-left:1em; margin-right:1em; margin-bottom:.3em; border-bottom:solid 1px #E6FFF8\"> <span style=\"float:left;\" id=\"ShowVerseComments_$verseID0\" CommentCount=\"$rowCount1\" onMouseOver=\"this.style.cursor='pointer';\" onMouseOut=\"this.style.cursor='default';\" onclick=\"javascript:ShowBuzzComments('HiddenCommentsID_$verseID0', 'ShowVerseComments_$verseID0');\">View all $rowCount1 comments</span></div>";
			echo "<div style=\"background-color:#DFEFFF; padding:.5em; font-family:courier; font-size:12px; color:#d50000; border-bottom:solid 2px #ffffff;\" id=\"ShowVerseComments_$verseID0\" CommentCount=\"$rowCount1\" onMouseOver=\"this.style.cursor='pointer';\" onMouseOut=\"this.style.cursor='default';\" onclick=\"javascript:ShowBuzzComments('HiddenCommentsID_$verseID0', 'ShowVerseComments_$verseID0');\">View all $rowCount1 comments</div>";
			//echo "<div class=\"\" style=\"padding:.6em; margin-bottom:.3em; color:#333333;\"><b>" . $bookName . " " . $chapterNumber . ":" . $verseNumber . "  " . $verseText . "</b></div>";
			
			// Hidden comments container div
			echo "<div id=\"HiddenCommentsID_$verseID0\" style=\"display:none;\">";
		}
		
		while ($index1 < $rowCount1) 
		{
			$showComment = "block";
			if (($rowCount1>1) && ($index1==$rowCount1-1))
			{
				// Close hidden comments container div
				echo "</div>";
			}
			$userID = mysql_result($result1, $index1, "UserID");
			$commentID = mysql_result($result1, $index1, "ID");
			// From users table
			$userFullName = "";
			$sqlUsers="SELECT * FROM Users where ID='$userID'";
			$resultUsers=mysql_query($sqlUsers);
			$userName = mysql_result($resultUsers, 0, "UserName");
			$userFirstName = mysql_result($resultUsers, 0, "FirstName");
			$userLastName = mysql_result($resultUsers, 0, "LastName");
			$userMiddleInitial = mysql_result($resultUsers, 0, "MiddleInitial");
			if ($userMiddleInitial == "")
				$userFullName = $userFirstName . " " . $userLastName;
			else
				$userFullName = $userFirstName . " " . $userMiddleInitial ." " . $userLastName;
		
			//$showCommentCode = $showCommentCode . "document.getElementById('CommentID_$commentID').style.display='block';";
			$commentsIds = $commentsIds . "BuzzCommentID_$commentID|";
			
			
			$userLine = "<b>" . $userFullName . ": " . "</b>";
			$commentText = mysql_result($result1, $index1, "Comment");
			$commentTimeStamp = mysql_result($result1, $index1, "UpdatedDateTime");
			$dateTimeVar = new DateTime($commentTimeStamp);
			$dateStr = $dateTimeVar->format("F d, Y (l)");
			$timeStr = $dateTimeVar->format("h:i a");
			//class=\"ui-corner-all\"
			//86B8F4 //title-color
			//A6E8FF //title-color
			//border-bottom:solid 2px #ffffff
			$fullCommentDivLine = "<div class=\"\" id=\"BuzzCommentID_$commentID\" onMouseOver=\"this.style.color='#222222';\" onMouseOut=\"this.style.color='#555555';\" style = \"background-color:#DFEFFF; padding:.5em; font-family:courier; font-size:14px; color:#555555; border-bottom:solid 2px #ffffff;\">" . $userLine . $commentText . "<div style=\"padding-top:.2em; font-size:11px; color:#888888; \">" . "<b>" . $dateStr . "  at " . $timeStr . "</b>" . "</div>" . "</div>";
			echo $fullCommentDivLine;
			$index1++;
		}
		
		//echo $fullCommentDivLine;
		echo "</div>"; //close $finalLine
		$index0++;
	}
	closeDBConnection();
} //doGetUpdates()


function getInput()
{
	global $userName;
	global $gTask;
	
	$gTask=$_GET["t"];
	$userName=$_GET["u"];
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

function doGetUpdatesOld()
{
	global $gTask;
	global $userName;
	
	openDBConnection();
	
	$sql="SELECT * FROM Comments ORDER BY ID DESC";
    //echo $sql0;
	$result=mysql_query($sql);
	$rowCount=mysql_numrows($result);
	
	$index = 0;
	while ($index < $rowCount) 
	{
		// From comments table
		$commentID = 0;
		$userID = 0;
		$verseID = 0;
		$chapterID = 0;
		$bookID = 0;
		$commentText = "";
		$isPublicComment = 0;
		$updatedDateTime = 0;
		
		// From verses table
		$verseText = "";
		$verseNumber = 0;
		
		// From chapter table
		$chapterNumber = 0;
		$bookID = 0;
		
		// From books table
		$bookName = "";
		$testamentID = 0;
		
		// From users table
		$userName = "";
		$userFirstName = "";
		$userLastName = "";
		$userMiddleInitial = "";
		$userFullName = "";
		
		// From comments table
		$commentID = mysql_result($result, $index, "ID");
		$userID = mysql_result($result, $index, "UserID");
		$verseID = mysql_result($result, $index, "VerseID");
		$chapterID = mysql_result($result, $index, "ChapterID");
		$bookID = mysql_result($result, $index, "BookID");
		$commentText = mysql_result($result, $index, "Comment");
		$isPublicComment = mysql_result($result, $index, "IsPublic");
		$updatedDateTime = mysql_result($result, $index, "UpdatedDateTime");
		
		// From verses table
		$sqlVerses="SELECT * FROM Verses where ID='$verseID'";
		$resultVerses=mysql_query($sqlVerses);
		$verseNumber = mysql_result($resultVerses, 0, "VerseNumber");
		$verseText = mysql_result($resultVerses, 0, "Verse");
		
		// From chapters table
		$sqlChapters="SELECT * FROM Chapters where ID='$chapterID'";
		$resultChapters=mysql_query($sqlChapters);
		$chapterNumber = mysql_result($resultChapters, 0, "ChapterNumber");
		$bookID = mysql_result($resultChapters, 0, "BookID");
		
		// From books table
		$sqlBooks="SELECT * FROM Books where ID='$bookID'";
		$resultBooks=mysql_query($sqlBooks);
		$bookName = mysql_result($resultBooks, 0, "FullName");
		$testamentID = mysql_result($resultBooks, 0, "Testament");
		
		// From users table
		$sqlUsers="SELECT * FROM Users where ID='$userID'";
		$resultUsers=mysql_query($sqlUsers);
		$userName = mysql_result($resultUsers, 0, "UserName");
		$userFirstName = mysql_result($resultUsers, 0, "FirstName");
		$userLastName = mysql_result($resultUsers, 0, "LastName");
		$userMiddleInitial = mysql_result($resultUsers, 0, "MiddleInitial");
		
		if ($userMiddleInitial == "")
			$userFullName = $userFirstName . "" . $userLastName;
		else
			$userFullName = $userFirstName . " " . $userMiddleInitial ." " . $userLastName;
		
		$finalLine="";
		if ($gTask == "raw")
		{
			$finalLine = "$userFullName|$userID|$bookName|$bookID|$chapterNumber|$chapterID|$verseNumber|$verseID|$verseText|$commentText|$commentID|$isPublicComment|$updatedDateTime^";
		}
		else
		{
			$line1 = "<div style=\"margin-bottom:.1em;\"><b>" . $userFullName . " commented on:" . "</b></div>";
			$line2 = "<div style=\"margin-bottom:.1em;\">" . $bookName . " " . $chapterNumber . ":" . $verseNumber . "  " . $verseText . "</div>";
			$line3 = "<div class=\"ui-corner-all\" style = \"background-color:#eeeeee; font-family:courier; font-size:14px; color:#112211; padding:1em; margin-left:1em; margin-right:1em; margin-bottom:.2em;\">" . $commentText . "</div>";
			$finalLine = "<div class=\"ui-corner-all\" style=\"background-color:#E6FFF8; border:solid 1px green; margin-top:.5em; margin-left:2em; margin-right:2em; padding-left:1em; padding-right:1em; padding-top:1em; margin-bottom:2em; padding-bottom:1em; border-bottom:solid 3 #555555;\">" . $line1 . $line2 . $line3 . "</div>";
		}
		echo $finalLine;
		$index++;
	} //while
	
	closeDBConnection();
} //doGetUpdates()

//SELECT DISTINCT VerseID FROM Comments ORDER BY ID DESC
//SELECT * from Comments where VerseID=(SELECT DISTINCT VerseID FROM Comments ORDER BY ID DESC)
//SELECT * from Comments where VerseID = ANY (SELECT DISTINCT VerseID FROM Comments ORDER BY ID DESC);
?>

