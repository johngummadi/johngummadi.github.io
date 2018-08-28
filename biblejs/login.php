<?php
// Returns list of books in given translation

$gUsername = "";
$gPassword = "";

$con;


getInput();
doLogin();




/////////////////////////////////////////////////////////

function getInput()
{
	global $gUsername;
	global $gPassword;
	$gUsername=$_GET["u"];
	$gPassword=$_GET["p"];
}

function validate()
{
	global $gUsername;
	global $gPassword;
		
	if ($gUsername == "" || strlen($gUsername) <= 0)
		LoginFail();
	else if ($gPassword == "" || strlen($gPassword) <= 0)
		LoginFail();
}

function LoginFail()
{
	die("Invalid username/password");
}

function LoginSuccess()
{
	echo "success";
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


function doLogin()
{
	global $gUsername;
	global $gPassword;
	
	validate();
	
	openDBConnection();
    
	$loginQuery = "SELECT * FROM Users WHERE UserName='$gUsername' AND Password='$gPassword'";
	$resultLoginQuery=mysql_query($loginQuery);
	$rowCount=mysql_numrows($resultLoginQuery);
	
	if ($rowCount <= 0)
	{
		LoginFail();
	}
	closeDBConnection();
	LoginSuccess();
} //doLogin()
?>
