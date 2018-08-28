<?php
$gUsername = null;
$gPassword = null;
$gPrivilegeID = null;
$gFirstName = null;
$gLastName = null;
$gMiddleInitial = null;
$gNickName = null;
$gAddress = null;
$gCity = null;
$gState = null;
$gCountry = null;
$gZIP = null;
$gTimeZone = null;
$gEmail = null;
$gPhone = null;
$gSex = null;
$gMaritalStatus = null;
$gBirthday = null;
$gIsBornAgain = null;
$gFriends = null;
$gBlockedUsers = null;
$gIgnoredUsers = null;
$con = null;

getInput();
doRegisterUser();

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

function getInput()
{
	global $gUsername;
	global $gPassword;
	global $gPrivilegeID;
	global $gFirstName;
	global $gLastName;
	global $gMiddleInitial;
	global $gNickName;
	global $gAddress;
	global $gCity;
	global $gState;
	global $gCountry;
	global $gZIP;
	global $gTimeZone;
	global $gEmail;
	global $gPhone;
	global $gSex;
	global $gMaritalStatus;
	global $gBirthday;
	global $gIsBornAgain;
	global $gFriends;
	global $gBlockedUsers;
	global $gIgnoredUsers;
	
	$gUsername=$_GET["uname"];
	$gPassword=$_GET["pwd"];
	$gPrivilegeID="1";
	$gFirstName=$_GET["fname"];
	$gLastName=$_GET["lname"];
	$gMiddleInitial=$_GET["minit"];
	$gNickName=$_GET["nick"];
	$gAddress=$_GET["addr"];
	$gCity=$_GET["city"];
	$gState=$_GET["state"];
	$gCountry=$_GET["cntry"];
	$gEmail=$_GET["email"];
	$gPhone=$_GET["ph"];
	$gSex=$_GET["sex"];
	$gMaritalStatus=$_GET["mstatus"];
	$gIsBornAgain=$_GET["isba"];
	$gFriends=$_GET["frnds"];
	$gBlockedUsers=$_GET["blkdusers"];
	$gIgnoredUsers=$_GET["ignrdusers"];
} //getInput()

function userExists()
{
	global $gUsername;
	
	$sql="SELECT COUNT(ID) FROM Users WHERE UserName='$gUsername'";
	$result=mysql_query($sql);
	$result = mysql_fetch_array($result); 
	$count = $result[0];
	if ($count > 0)
		return true;
	else
		return false;
} //userExists()

function emailExists()
{
	global $gEmail;
	
	$sql="SELECT COUNT(ID) FROM Users WHERE Email='$gEmail'";
	$result = mysql_query($sql);
	$result = mysql_fetch_array($result); 
	$count = $result[0];
	if ($count > 0)
		return true;
	else
		return false;
} //emailExists()

function doRegisterUser()
{
	global $gUsername;
	global $gPassword;
	global $gPrivilegeID;
	global $gFirstName;
	global $gLastName;
	global $gMiddleInitial;
	global $gNickName;
	global $gAddress;
	global $gCity;
	global $gState;
	global $gCountry;
	global $gZIP;
	global $gTimeZone;
	global $gEmail;
	global $gPhone;
	global $gSex;
	global $gMaritalStatus;
	global $gBirthday;
	global $gIsBornAgain;
	global $gFriends;
	global $gBlockedUsers;
	global $gIgnoredUsers;
	global $con;
	
	// Validate
	if ($gUsername=="" || $gPassword=="" || $gFirstName=="" || $gLastName=="" || $gEmail=="")
	{
		echo "false|Invalid parameters";
		return;
	}
	
	openDBConnection();
	
	if (userExists())
	{
		closeDBConnection();
		echo "false| <b>$gUsername</b> is not available, please choose another user name.";
		return;
	}
	else if (emailExists())
	{
		closeDBConnection();
		echo "false|A user already exists with this email, please choose another one.";
		return;
	}
		
	
	$sql = "INSERT INTO Users (UserName,Password,PrivilegeID,FirstName,LastName,
		MiddleInitial,NickName,Address,City,State,Country,ZIP,TimeZone,Email,
		Phone,Sex,MaritalStatus,Birthday,IsBornAgain,Friends,BlockedUsers,IgnoredUsers)
		VALUES('$gUsername','$gPassword','$gPrivilegeID','$gFirstName','$gLastName',
		'$gMiddleInitial','$gNickName','$gAddress','$gCity','$gState','$gCountry',
		'$gZIP','$gTimeZone','$gEmail','$gPhone','$gSex','$gMaritalStatus','$gBirthday',
		'$gIsBornAgain','$gFriends','$gBlockedUsers','$gIgnoredUsers')";
	//echo $sql . "<br> <br>";
	$result = mysql_query($sql);
	closeDBConnection();
	
	if ($result)
		echo 'true|Successfully registered, you may login now.';
	else
		echo 'false|Unable to register at the moment, please contact biblecloud@gmail.com for help.';
	
} //doRegisterUser()

?>