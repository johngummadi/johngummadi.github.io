<?php
$gTask="";
$gUserName="";
$gSeedID="";
$gHash="";
$gBookID="";
$gChapterID="";
$gVerseID="";
$gComment="";
$gIsPublic="";

$con;

getInput();
doTask();


function getInput()
{
	global $gTask;
	global $gUserName;
	global $gSeedID;
	global $gHash;
	global $gBookID;
	global $gChapterID;
	global $gVerseID;
	global $gComment;
	global $gIsPublic;

	$gTask = $_GET["t"];
	$gUserName = $_GET["uname"];
	$gSeedID = $_GET["sid"];
	$gHash = $_GET["h"];
	$gBookID = $_GET["bid"];
	$gChapterID = $_GET["cid"];
	$gVerseID = $_GET["vid"];
	$gComment = $_GET["c"];
	$gIsPublic = $_GET["ispub"];
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


function doTask()
{
	global $gTask;

	openDBConnection();

	if ($gTask == "postcomment")
	{
		doPostComment();
	}
	else if($gTask == "getcomments")
	{
		doGetComments();
	}
	else if ($gTask == "getcommentsjson")
	{
		doGetCommentsJSON();
	}
	else if($gTask == "getcommentcount")
	{
		doGetCommentCount();
	}
	else
	{
		echo "false|Invalid request";
	}
	closeDBConnection();
}


function GetCommentCount($bookID, $chapterID, $verseID)
{
	$sql = "SELECT COUNT(ID) FROM Comments WHERE Deleted='0'";
	if ($verseID != null)
		$sql = $sql . " AND VerseID='" . $verseID . "'";
	else if ($chapterID != null)
		$sql = $sql . " AND ChapterID='" . $chapterID . "'";
	else if ($bookID != null)
		$sql = $sql . " AND BookID='" . $bookID . "'";

	$result = mysql_query($sql);
	$countResult = mysql_fetch_array($result);
	return $countResult[0];
} //GetCommentCount()

function GetVerseCommentCount($verseID)
{
	if ($verseID == null)
		return "-1";
	$sql = "SELECT COUNT(ID) FROM Comments WHERE Deleted='0' AND VerseID='" . $verseID . "'";
	$result = mysql_query($sql);
	$countResult = mysql_fetch_array($result);
	return $countResult[0];
} //GetVerseCommentCount()

function GetChapterCommentCount($chapterID)
{
	if ($chapterID == null)
		return "-1";
	$sql = "SELECT COUNT(ID) FROM Comments WHERE Deleted='0' AND ChapterID='" . $chapterID . "'";
	$result = mysql_query($sql);
	$countResult = mysql_fetch_array($result);
	return $countResult[0];
} //GetChapterCommentCount()

function GetBookCommentCount($bookID)
{
	if ($bookID == null)
		return "-1";
	$sql = "SELECT COUNT(ID) FROM Comments WHERE Deleted='0' AND BookID='" . $bookID . "'";
	$result = mysql_query($sql);
	$countResult = mysql_fetch_array($result);
	return $countResult[0];
} //GetBookCommentCount()

function doGetCommentCount()
{
	global $gBookID;
	global $gChapterID;
	global $gVerseID;

	$commentCountVerses = -1;
	$commentCountChapters = -1;
	$commentCountBooks = -1;
	//$commentCount = GetCommentCount($gBookID, $gChapterID, $gVerseID);

	if ($gVerseID != null)
		$commentCountVerses = GetVerseCommentCount($gVerseID);
	if ($gChapterID != null)
		$commentCountChapters = GetChapterCommentCount($gChapterID);
	if ($gBookID != null)
		$commentCountBooks = GetBookCommentCount($gBookID);

	echo $gBookID . "|" . $gChapterID . "|" . $gVerseID . "|" . $commentCountBooks . "|" . $commentCountChapters . "|" . $commentCountVerses;
} //doGetCommentCount()


function doGetCommentsJSON()
{
	global $gUserName;
	global $gSeedID;
	global $gHash;
	global $gBookID;
	global $gChapterID;
	global $gVerseID;
	global $gComment;
	global $gIsPublic;
	$userFullName = "";
	//$commentCountForVerse = 0;

	// This gives count for ALL comments in this verse (regardless of user/public)
	//$commentCountForVerse = GetCommentCount($gBookID, $gChapterID, $gVerseID);

	$commentCountVerses="-1";
	$commentCountChapters="-1";
	$commentCountBooks="-1";

	if ($gVerseID != null)
		$commentCountVerses = GetVerseCommentCount($gVerseID);
	if ($gChapterID != null)
		$commentCountChapters = GetChapterCommentCount($gChapterID);
	if ($gBookID != null)
		$commentCountBooks = GetBookCommentCount($gBookID);

	$userID = getUserID(false, $userFullName);
	$sql = "";
	$sql = sprintf("SELECT * FROM Comments WHERE Deleted='0'");

	if ($gVerseID != null)
		$sql = $sql . " AND VerseID='" . $gVerseID . "'";
	else if ($gChapterID != null)
		$sql = $sql . " AND ChapterID='" . $gChapterID . "'";
	else if ($gBookID != null)
		$sql = $sql . " AND BookID='" . $gBookID . "'";

	$result = mysql_query($sql);
	$rowCount=mysql_numrows($result);
	$index = 0;
	$lastIndex = $rowCount-1;
	//echo $commentCountForVerse . "^";
	echo "{\"Comments\": [";
	//echo $commentCountBooks . "|" . $commentCountChapters . "|" . $commentCountVerses . "^";
	while ($index < $rowCount)
	{
		$commentedUserID=-1;
		$commentedUserName = "";
		$commentedUserFullName = "";
		$isLoggedIn = 0;
		$privilegeID = 0;

		// From comment table
		$commentID = mysql_result($result, $index, "ID");
		$commentedUserID = mysql_result($result, $index, "UserID");;
		$verseID = mysql_result($result, $index, "VerseID");
		$chapterID = mysql_result($result, $index, "ChapterID");
		$bookID = mysql_result($result, $index, "BookID");
		$isPublic = mysql_result($result, $index, "IsPublic");
		$commentText = mysql_result($result, $index, "Comment");
		$timeStamp = mysql_result($result, $index, "UpdatedDateTime");

		// Get user details from User table
		getUserDetailsFromUserID($commentedUserID, $commentedUserName, $commentedUserFullName, $isLoggedIn, $privilegeID);

		// Filter
		$isHidden = "0";
		if ($isPublic == 0)
		{
			if ($userID != $commentedUserID)
			{
				// private comment
				$isHidden = "1";
				if ($userID > 0)
				{
					$commentText = "This is a private comment";
				}
				else
				{
					$commentText = "This comment is hidden, please login to see your private comments or friends' protected comments";
				}

			}
		}
		$commentText = str_replace("\"", "&#34;", $commentText);

		// TODO: Get verse details also (like chapter number, book name, etc.,)
		// <Here>

		if ($index >= $lastIndex) // if this is last one, don't put coma at the end
			echo "{\"ID\": \"$commentID\", \"CommentedUserID\": \"$commentedUserID\", \"VerseID\": \"$verseID\", \"ChapterID\": \"$chapterID\", \"BookID\": \"$bookID\", \"IsPublic\": \"$isPublic\", \"IsHidden\": \"$isHidden\", \"TimeStamp\": \"$timeStamp\", \"CommentText\": \"$commentText\", \"CommentedUserName\": \"$commentedUserName\", \"CommentedUserFullName\": \"$commentedUserFullName\", \"IsLoggedIn\": \"$isLoggedIn\", \"PrivilegeID\": \"$privilegeID\"}";
		else
			echo "{\"ID\": \"$commentID\", \"CommentedUserID\": \"$commentedUserID\", \"VerseID\": \"$verseID\", \"ChapterID\": \"$chapterID\", \"BookID\": \"$bookID\", \"IsPublic\": \"$isPublic\", \"IsHidden\": \"$isHidden\", \"TimeStamp\": \"$timeStamp\", \"CommentText\": \"$commentText\", \"CommentedUserName\": \"$commentedUserName\", \"CommentedUserFullName\": \"$commentedUserFullName\", \"IsLoggedIn\": \"$isLoggedIn\", \"PrivilegeID\": \"$privilegeID\"},";


		//echo $commentID . "|" . $commentedUserID . "|" . $verseID . "|" . $chapterID . "|" . $bookID . "|" . $isPublic . "|" . $isHidden . "|" . $timeStamp . "|" .
		//	$commentText . "|" . $commentedUserName . "|". $commentedUserFullName . "|" . $isLoggedIn . "|" . $privilegeID . "^";
		$index ++;
	}
	echo "]}"; //Comments array end
} //doGetCommentsJSON()



function doGetComments()
{
	global $gUserName;
	global $gSeedID;
	global $gHash;
	global $gBookID;
	global $gChapterID;
	global $gVerseID;
	global $gComment;
	global $gIsPublic;
	$userFullName = "";
	//$commentCountForVerse = 0;

	// This gives count for ALL comments in this verse (regardless of user/public)
	//$commentCountForVerse = GetCommentCount($gBookID, $gChapterID, $gVerseID);

	$commentCountVerses="-1";
	$commentCountChapters="-1";
	$commentCountBooks="-1";

	if ($gVerseID != null)
		$commentCountVerses = GetVerseCommentCount($gVerseID);
	if ($gChapterID != null)
		$commentCountChapters = GetChapterCommentCount($gChapterID);
	if ($gBookID != null)
		$commentCountBooks = GetBookCommentCount($gBookID);

	$userID = getUserID(false, $userFullName);
	$sql = "";
	$sql = sprintf("SELECT * FROM Comments WHERE Deleted='0'");

	if ($gVerseID != null)
		$sql = $sql . " AND VerseID='" . $gVerseID . "'";
	else if ($gChapterID != null)
		$sql = $sql . " AND ChapterID='" . $gChapterID . "'";
	else if ($gBookID != null)
		$sql = $sql . " AND BookID='" . $gBookID . "'";

	$result = mysql_query($sql);
	$rowCount=mysql_numrows($result);
	$index = 0;
	//echo $commentCountForVerse . "^";
	echo $commentCountBooks . "|" . $commentCountChapters . "|" . $commentCountVerses . "^";
	while ($index < $rowCount)
	{
		$commentedUserID=-1;
		$commentedUserName = "";
		$commentedUserFullName = "";
		$isLoggedIn = 0;
		$privilegeID = 0;

		// From comment table
		$commentID = mysql_result($result, $index, "ID");
		$commentedUserID = mysql_result($result, $index, "UserID");;
		$verseID = mysql_result($result, $index, "VerseID");
		$chapterID = mysql_result($result, $index, "ChapterID");
		$bookID = mysql_result($result, $index, "BookID");
		$isPublic = mysql_result($result, $index, "IsPublic");
		$commentText = mysql_result($result, $index, "Comment");
		$timeStamp = mysql_result($result, $index, "UpdatedDateTime");

		// Get user details from User table
		getUserDetailsFromUserID($commentedUserID, $commentedUserName, $commentedUserFullName, $isLoggedIn, $privilegeID);

		// Filter
		$isHidden = "0";
		if ($isPublic == 0)
		{
			if ($userID != $commentedUserID)
			{
				// private comment
				$isHidden = "1";
				if ($userID > 0)
				{
					$commentText = "This is a private comment";
				}
				else
				{
					$commentText = "This comment is hidden, please login to see your private comments or friends' protected comments";
				}

			}
		}

		// TODO: Get verse details also (like chapter number, book name, etc.,)
		// <Here>

		echo $commentID . "|" . $commentedUserID . "|" . $verseID . "|" . $chapterID . "|" . $bookID . "|" . $isPublic . "|" . $isHidden . "|" . $timeStamp . "|" .
			$commentText . "|" . $commentedUserName . "|". $commentedUserFullName . "|" . $isLoggedIn . "|" . $privilegeID . "^";
		$index ++;
	}
} //doGetComments()

function doPostComment()
{
	global $gUserName;
	global $gSeedID;
	global $gHash;
	global $gBookID;
	global $gChapterID;
	global $gVerseID;
	global $gComment;
	global $gIsPublic;

	$userFullName = "";

	$userID = getUserID(true, $userFullName);

	if ($userID > 0)
	{
		$gComment = str_replace("_PERCENTSYMBOL_", "%%", $gComment);
		$modifiedComment = mysql_real_escape_string($gComment);
		$insertSQL = sprintf("INSERT INTO Comments (UserID,VerseID,ChapterID,BookID,Comment,IsPublic) VALUES('$userID','$gVerseID','$gChapterID','$gBookID','$modifiedComment','$gIsPublic')");
		$result = mysql_query($insertSQL); // insert a new row with default values
		if ($result)
			echo "true|" . $userFullName . "|" . $userID;
		else
			echo "false|Failed to post comment for user:" . $gUserName . "|$modifiedComment";
	}
} //doPostComment()

function getUserDetailsFromUserID($userID, &$userName, &$userFullName, &$isLoggedIn, &$privilegeID)
{
	$sql = 'SELECT * FROM Users WHERE ID = \'' . mysql_real_escape_string($userID) . '\'';
	$result = mysql_query($sql);
	if (!$result)
		return false;

	$user_row = mysql_fetch_assoc($result);
	if (!$user_row)
		return false;

	$userName = $user_row['UserName'];
	$isLoggedIn = $user_row['IsLoggedIn'];
	$privilegeID = $user_row['PrivilegeID'];
	if ($user_row['MiddleInitial'] && $user_row['MiddleInitial'] != "")
		$userFullName = $user_row['FirstName'] . " " . $user_row['MiddleInitial'] . " " . $user_row['LastName'];
	else
		$userFullName = $user_row['FirstName'] . " " . $user_row['LastName'];

	return true;
} //getUserDetailsFromUserID()

function getUserID($echoOnError, &$userFullName)
{
	global $gUserName;
	global $gSeedID;
	global $gHash;
	global $gBookID;
	global $gChapterID;
	global $gVerseID;
	global $gComment;
	global $gIsPublic;

	// formulate query for username
	$sql = 'SELECT * FROM Users WHERE UserName = \'' . mysql_real_escape_string($gUserName) . '\'';
	$result = mysql_query($sql);

	// fail on sql failure
	if (!$result)
	{
		if ($echoOnError)
			echo "false|Could not connect to login database.  Please try again (-1)";
		return -1;
	}

	// get the first user with username in the table (should only be one)
	$user_row = mysql_fetch_assoc($result);
	// if there isn't one
	if (!$user_row)
	{
		if ($echoOnError)
			echo "false|Invalid username and password combination (-2)";
		return -2;
	}

	// formulate query for random timestamp for given id
	$sql = 'SELECT * FROM Seeds WHERE ID=' . (int)$gSeedID;
	$result =  mysql_query($sql);

	// die if no value for given id
	if (!$result)
	{
		if ($echoOnError)
			echo "false|Unknown error (hacking attempt) (-3)";
		return -3;
	}

	// get the first (only) seed
	$seed_row = mysql_fetch_assoc($result);

	// fail if no row
	if (!$seed_row)
	{
		if ($echoOnError)
			echo "false|Unknown error (hacking attempt) (-4)";
		return -4;
	}

	// if the md5 hashes are equal to those generated by the clientside js
	$md5str = md5(md5($user_row['Password']) . $seed_row['Seed']);

	if ($md5str == $gHash)
	{
		// now remove the random key that was made for this request
		mysql_query('DELETE FROM Seed WHERE ID=' . (int)$gSeedID);

		if ($user_row['MiddleInitial'] && $user_row['MiddleInitial'] != "")
			$userFullName = $user_row['FirstName'] . " " . $user_row['MiddleInitial'] . " " . $user_row['LastName'];
		else
			$userFullName = $user_row['FirstName'] . " " . $user_row['LastName'];

		return $user_row['ID'];
	}
	else
	{
		// not logged in.. incorrect password
		if ($echoOnError)
			echo "false|Invalid username and password combination (-5)";
		return -5;
	}
}
?>
