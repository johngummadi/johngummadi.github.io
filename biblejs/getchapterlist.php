<?php
// Returns list of books in given translation

$bookNumber=0;
$wantCommentCount=0;
$con;



getInput();
getChapterList();


function getInput()
{
	global $bookNumber;
	global $wantCommentCount;
	$bookNumber=$_GET["b"];
	$wantCommentCount=$_GET["cc"];
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

function getChapterList()
{
	global $bookNumber;
	global $wantCommentCount;
	
	openDBConnection();
	
	$sql="SELECT ID,ChapterNumber FROM Chapters WHERE BookID='$bookNumber'";
	$result=mysql_query($sql);
	$chapterCount=mysql_numrows($result);
	
	$index = 0;
	$chaptersList="";
	//echo "chapterCount = $chapterCount <br>";
	while ($index < $chapterCount) 
	{
		$chapterID=mysql_result($result, $index, "ID");
		$chapterNumber=mysql_result($result, $index, "ChapterNumber");
		
		if ($wantCommentCount == 0)
		{
			$line = $bookNumber . "^" . $chapterID . "^" . $chapterNumber . "|";
		}
		else
		{
			$sql2="SELECT COUNT(ID) FROM Comments WHERE ChapterID='$chapterID' AND Deleted='0'";
			$result2=mysql_query($sql2);
			$result2 = mysql_fetch_array($result2); 
			$commentCount = $result2[0];
			$line = $bookNumber . "^" . $chapterID . "^" . $chapterNumber . "^" . $commentCount . "|";
		}
		//echo $line . "<br>";
		$chaptersList = $chaptersList . $line;
		$index++;
	} //while
	closeDBConnection();
	echo $chaptersList;
} //getChapterList()

// Obsolete
function getChapterCount()
{
	global $bookNumber;
	
	openDBConnection();
	$sql="SELECT COUNT(ID) FROM Chapters WHERE BookID='$bookNumber'";
	$result=mysql_query($sql);
	closeDBConnection();
	$result = mysql_fetch_array($result); 
	echo $result[0];
} //getChapterCount()

?>
