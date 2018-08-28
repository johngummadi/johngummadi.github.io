<?php
// Returns list of books in given translation
$con;
$gUserId="-1";
$gVersionString="";
$gIPAddress="0.0.0.0";

getInput();
getBooks();


/////////////////////////////////////////////////////////
$translationID = 1;

function getInput()
{
	global $gUserId;
	global $gVersionString;
	global $gIPAddress;
	
	$gUserId = $_GET["uid"];
	$gVersionString = $_GET["vstr"];
	$gIPAddress=$_SERVER['REMOTE_ADDR'];
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


function getBooks()
{
	global $gUserId;
	global $gVersionString;
	global $gIPAddress;
	
	$globalBackColor="#fefefe";
	openDBConnection();
	$sql="SELECT * FROM Books";
	$result=mysql_query($sql);
	$rowCount=mysql_numrows($result);
	
	// Write visitor information into database
	$insertSQL = sprintf("INSERT INTO Visitors (IPAddress,UserID,VersionString) VALUES('$gIPAddress','$gUserId','$gVersionString')");
	//mysql_query($insertSQL);

	$index=0;
	// Beginning of books xml
	$booksLineStart = "{\"Books\": [";
	echo $booksLineStart;
	$lastIndex = $rowCount-1;
	while ($index < $rowCount) 
	{
		// Get name (full & short)
		$bookID=mysql_result($result,$index,"ID");
		$fullName=mysql_result($result,$index,"FullName");
		$shortName=mysql_result($result,$index,"ShortName");
		// Get chapter count
		$chapterCount = -1;
		$countSql="SELECT COUNT(ID) FROM Chapters WHERE BookID='$bookID'";
		$countResult=mysql_query($countSql);
		$countResult = mysql_fetch_array($countResult); 
		$chapterCount = $countResult[0];
		// Get comment count
		$sql3="SELECT COUNT(ID) FROM Comments WHERE BookID='$bookID' AND Deleted='0'";
		$countResult3=mysql_query($sql3);
		$countResult3 = mysql_fetch_array($countResult3);
		$commentCount = $countResult3[0];
		
		// Echo each book
		$bookLine = "";
		if ($index>=$lastIndex)
			$bookLine = "{\"BookID\":\"$bookID\", \"FullName\":\"$fullName\", \"ShortName\": \"$shortName\", \"ChapterCount\": \"$chapterCount\", \"CommentCount\": \"$commentCount\"}";
		else
			$bookLine = "{\"BookID\":\"$bookID\", \"FullName\":\"$fullName\", \"ShortName\": \"$shortName\", \"ChapterCount\": \"$chapterCount\", \"CommentCount\": \"$commentCount\"}, ";
		echo $bookLine;
		$index++;
	}
	$booksLineEnd = "]}";
	echo $booksLineEnd;
	closeDBConnection();
}

?>
