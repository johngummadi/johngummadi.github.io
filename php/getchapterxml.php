<?php
// Returns list of books in given translation

$bookNumber=0;
$chapterNumber=0;
$verseNumber=0;

$userName="";
$userBookNumber=0;
$userChapterNumber=0;
$userVerseNumber=0;

$con;
header ("Content-Type:text/xml");
getInput();
getContent();

function getInput()
{
	global $bookNumber;
	global $chapterNumber;
	global $verseNumber;
	
	global $userName;
	global $userBookNumber;
	global $userChapterNumber;
	global $userVerseNumber;
	
	$bookNumber=$_GET["b"];
	$chapterNumber=$_GET["c"];
	$verseNumber=$_GET["v"];
	
	$userName = $_GET["uname"];
	$userBookNumber=$_GET["ub"];
	$userChapterNumber=$_GET["uc"];
	$userVerseNumber=$_GET["uv"];
	
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

function saveUserCurrentPosition()
{
	global $userName;
	global $userBookNumber;
	global $userChapterNumber;
	global $userVerseNumber;
	
	if ($userName != "" && $userName != null && $userBookNumber != null && $userBookNumber != 0)
	{
		if ($userChapterNumber <= 0)
			$userChapterNumber = 1;
		if ($userVerseNumber <= 0)
			$userVerseNumber = 1;
		$sql = "UPDATE Users SET LastBookID='" . $userBookNumber . "',LastChapterNumber='" . $userChapterNumber . "',LastVerseNumber='" . $userVerseNumber . "' WHERE UserName='" . $userName . "'";
		$result = mysql_query($sql);
	}
} //saveUserCurrentPosition()

function getContent()
{
	global $bookNumber;
	global $chapterNumber;
	global $verseNumber;
	global $globalBackColor;
	
	openDBConnection();
	
	// save the book/chapter position
	saveUserCurrentPosition();
	
	$sql0="SELECT FullName, ShortName FROM Books WHERE ID='$bookNumber'";
    //echo $sql0 . "<br>";
	$result0=mysql_query($sql0);
	$bookName=mysql_result($result0,0,"FullName");
	$bookShortName=mysql_result($result0,0,"ShortName");
	if ($bookShortName == "")
		$bookShortName = $bookName;
    
    
	$sql1="SELECT ID FROM Chapters WHERE BookID='$bookNumber' AND ChapterNumber='$chapterNumber'";
    //echo $sql1 . "<br>";
	$result1=mysql_query($sql1);
	$chapterID=mysql_result($result1,0,"ID");
	
	$sql2="";
	
	if ($verseNumber>0)
		$sql2="SELECT * FROM Verses WHERE ChapterID='$chapterID' AND VerseNumber='$verseNumber'";
	else
		$sql2="SELECT * FROM Verses WHERE ChapterID='$chapterID'";
    //echo $sql2 . "<br>";

	$result2=mysql_query($sql2);
	$rowCount=mysql_numrows($result2);
	
	//commentCount for the chapter
	$commentCountSql="SELECT COUNT(ID) FROM Comments WHERE ChapterID='$chapterID'";
	$commentCountResult=mysql_query($commentCountSql);
	$commentCountResult = mysql_fetch_array($commentCountResult); 
	$commentCount = $commentCountResult[0];
    
	
	$index=0;
	$headerLine = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\r\n";
	
	$startLine = "<chapter ChapterID=\"$chapterID\" ChapterNumber=\"$chapterNumber\" CommentCount=\"$commentCount\" BookID=\"$bookNumber\" BookName=\"$bookName\" BookShortName=\"$bookShortName\" VerseCount=\"$rowCount\" Version=\"KJV\">\r\n";
	
	echo $headerLine;
	echo $startLine;
	while ($index < $rowCount) {
		$verseID=mysql_result($result2,$index,"ID");
		$verseNumber=mysql_result($result2,$index,"VerseNumber");
		$verse=mysql_result($result2,$index,"Verse");
		$sql3="SELECT Comment FROM Comments WHERE VerseID='$verseID' AND Deleted='0'";
		
		$result3=mysql_query($sql3);
		$rowCountComments=mysql_numrows($result3);	
		$divID=0;
		$divID=$index+1;
		
		$verseLine = "	<verse VerseID=\"$verseID\" VerseNumber=\"$verseNumber\" CommentCount=\"$rowCountComments\"> \r\n$verse \r\n</verse>\r\n";
		echo $verseLine;
		
		$index++;
	}
	$endLine = "</chapter>\r\n";
	echo $endLine;
    closeDBConnection();
}

?>