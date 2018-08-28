<?php
// Returns list of books and IDs and other info for the developer in both translations (for comparison)

ShowBooksData();


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

function ShowBooksData()
{
	openDBConnection();
	
	$sql1="SELECT * FROM Books";
	$sql2="SELECT * FROM AsvBooks";
	
	$result1=mysql_query($sql1);
	$result2=mysql_query($sql2);
	$rowCount1=mysql_numrows($result1);
	$rowCount2=mysql_numrows($result2);
	
	$maxRows = $rowCount1>$rowCount2?$rowCount1:$rowCount2;
	$index = 0;
	echo '<div> <span style\"margin-right:2em;\"> <u>KJV</u> </span>   <span style\"margin-left:2em;\">  <u>ASV</u> </span></div><br>';
	while ($index < $maxRows) 
	{
		$id1 = "?";
		$name1 = "?";
		$id2 = "?";
		$name2 = "?";
		if ($index < $rowCount1)
		{
			$id1=mysql_result($result1,$index,"ID");
			$name1=mysql_result($result1,$index,"FullName");
		}
		
		if ($index < $rowCount2)
		{
			$id2=mysql_result($result2,$index,"ID");
			$name2=mysql_result($result2,$index,"FullName");
		}
		
		echo "<div> <span style\"margin-right:2em;\">" . $id1 . ". " . $name1 . "</span>   <span style\"margin-left:2em;\"> " . $id2 . ". " . $name2 . "</span></div><br>";
		
		$index++;
	}
	closeDBConnection();
} //ShowBooksData()
?>