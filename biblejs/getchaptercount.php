<?php
// Returns list of books in given translation

$bookNumber=0;
$con;



getInput();
getChapterCount();




/////////////////////////////////////////////////////////

function getInput()
{
	global $bookNumber;
	$bookNumber=$_GET["b"];
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

function getChapterCount()
{
	global $bookNumber;
	
	openDBConnection();
	$sql="SELECT COUNT(ID) FROM Chapters WHERE BookID='$bookNumber'";
	$result=mysql_query($sql);
	closeDBConnection();
	$result = mysql_fetch_array($result); 
	echo $result[0];
}
?>
