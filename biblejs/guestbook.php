<?php

$gTask = "";
$gUserID = "";
$gName = "";
$gIPAddress = "";
$gComment = "";
$con;

getInput();

doTask();


function getInput()
{
	global $gTask;
	global $gUserID;
	global $gName;
	global $gIPAddress;
	global $gComment;
	
	$gTask=$_GET["t"];
	$gUserID=$_GET["uid"];
	$gName=$_GET["n"];
	$gIPAddress=$_SERVER['REMOTE_ADDR'];
	$gComment=$_GET["c"];
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

function validateInputForTaskAdd()
{
	global $gTask;
	global $gUserID;
	global $gName;
	global $gIPAddress;
	global $gComment;
	
	if (!$gName || strlen($gName) <=0 )
		$gName = "Anonymous";
	if (!$gComment || strlen($gComment) <=0 )
		return false;
	return true;
} //validateInputForTaskAdd()


function doTask()
{
	global $gTask;
	global $gUserID;
	global $gName;
	global $gIPAddress;
	global $gComment;
	
	if ($gTask == "add")
	{
		if (!validateInputForTaskAdd())
			die('Invalid input');
		openDBConnection();
		addGuestComment();
		closeDBConnection();
	}
	else //get
	{
		openDBConnection();
		getGuestComments();
		closeDBConnection();
	}
}

function getGuestComments()
{
	global $gTask;
	global $gUserID;
	global $gName;
	global $gIPAddress;
	global $gComment;
	
	$sql = "SELECT * FROM GuestbookComments ORDER BY DateTime DESC";
	
	$result=mysql_query($sql);
	$rowCount=mysql_numrows($result);
	$index = 0;
	while ($index < $rowCount)
	{
		$guestCommentID=mysql_result($result,$index,"ID");
		$userID=mysql_result($result,$index,"UserID");
		$name=mysql_result($result,$index,"Name");
		$datetime=mysql_result($result,$index,"DateTime");
		$comment=mysql_result($result,$index,"Comment");
		$line = "$guestCommentID|$userID|$name|$datetime|$comment^";
		echo $line;
		++$index;
	} //while
} //getGuestComments()

function addGuestComment()
{
	global $gTask;
	global $gUserID;
	global $gName;
	global $gIPAddress;
	global $gComment;
	
	$modifiedComment = mysql_real_escape_string($gComment);
	$sql = "INSERT INTO GuestbookComments (UserID,Name,IPAddress,Comment) VALUES ('$gUserID','$gName','$gIPAddress','$modifiedComment')";
	$result = mysql_query($sql); // insert a new row with default values
	// fail on sql failure
	if (!$result)  
	{
		echo "false|Could not connect to login database.  Please try again";
		return false;
	}
	echo "true|Added guest comment successfully.";
}

?>
