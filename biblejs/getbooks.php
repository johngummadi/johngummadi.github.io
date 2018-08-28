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
	mysql_query($insertSQL);

	
	
	$index=0;
	$booksDiv="";
	$styleStr1 = "style=\"padding-left:1em; padding-right:1em; padding-top:.2em; padding-bottom:.2em; background-color:$globalBackColor; font-family:Tahoma; border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc;\"";
	
	while ($index < $rowCount) {
		$id=mysql_result($result,$index,"ID");
		$fullName=mysql_result($result,$index,"FullName");
		//$testamentID=mysql_result($result,$index,"Testament");
		//$styleStr2 = "style=\"padding-left:1em; padding-right:1em; padding-top:.2em; padding-bottom:.2em; background-color:transparent; font-family:Tahoma; border-bottom: 1px solid #cccccc;\"";
	
		//$mouseEventStr = "onMouseOver=\"mouseOnBook('bookId$id');\"; onMouseOut=\"mouseOffBook('bookId$id');\";";
		//$line = "<div id='bookId$id' $styleStr2 $mouseEventStr onclick=\"javascript:loadBookChapterNumbers('$id', '$fullName','0','1','1');\">$fullName</div>";

		$chapterCount = -1;
		$countSql="SELECT COUNT(ID) FROM Chapters WHERE BookID='$id'";
		$countResult=mysql_query($countSql);
		$countResult = mysql_fetch_array($countResult); 
		$chapterCount = $countResult[0];
		
		$sql3="SELECT COUNT(ID) FROM Comments WHERE BookID='$id' AND Deleted='0'";
		$countResult3=mysql_query($sql3);
		$countResult3 = mysql_fetch_array($countResult3);
		$commentCount = $countResult3[0];
		
		$line = $id . "^" . $fullName . "^" . $chapterCount . "^" . $commentCount . "|";
		
		
		$booksDiv = $booksDiv . $line;
		$index++;
	}
	closeDBConnection();
	echo $booksDiv;	
}

?>