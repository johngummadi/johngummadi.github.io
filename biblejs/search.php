<?php
// Returns list of books in given translation

$gSearchText = "";

$con;
$globalBackColor="#fefefe";


getInput();
getResults();




/////////////////////////////////////////////////////////

function getInput()
{
	global $gSearchText;
	$gSearchText = $_GET["s"];
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


function getResults()
{
	global $gSearchText;
	global $globalBackColor;
	
	if ($gSearchText == "")
	{
		die("Please enter text to search");
	}
	
	openDBConnection();
	
	$gSearchTextSql = mysql_real_escape_string($gSearchText);
    
	$sql1 = "SELECT * FROM Verses WHERE Verse LIKE '%$gSearchTextSql%'";
	
	$result1=mysql_query($sql1);
	$rowCount=mysql_numrows($result1);
	$index = 0;
	
	
	$styleStr = "style=\"padding-left:1em; padding-right:1em; padding-top:1em; padding-bottom:1em; background-color:transparent; 
			font-family:Tahoma; border-top: 1px solid #cccccc; border-bottom: 1px solid #cccccc;\"";
	
	$line= "<div id=\"SearchResultsID\" $styleStr> <b><u> Search for the text \"$gSearchText\" produced $rowCount results:\t\t\t <a href= \"javascript: loadCurrentChapter();\"> << Back </a> </u></b></div>";
	echo $line;
	
	while ($index < $rowCount) {
		$verseID=mysql_result($result1,$index,"ID");
		$verseNumber=mysql_result($result1,$index,"VerseNumber");
		$verse=mysql_result($result1,$index,"Verse");
		$chapterID=mysql_result($result1,$index,"ChapterID");
		
		$sqlChapters = "SELECT * FROM Chapters WHERE ID='$chapterID'";
		$resultChapters = mysql_query($sqlChapters);
		$bookID  = mysql_result($resultChapters, 0, "BookID");
		$chapterNumber = mysql_result($resultChapters, 0, "ChapterNumber");
		
		$sqlBooks = "SELECT * FROM Books WHERE ID='$bookID'";
		$resultBooks = mysql_query($sqlBooks);
		$bookName  = mysql_result($resultBooks, 0, "FullName");
		
        //$hrefValueStr = "javascript:loadVerses('$bookName','$bookID','$chapterNumber',1,$verseNumber);";
		$mouseOverEventStr = "onMouseOver=\"javascript:mouseOnVerse('verseId$verseID');\" ";
		$mouseOutEventStr = "onMouseOut=\"javascript:mouseOffVerse('verseId$verseID');\" ";
		$hrefValueStr = "javascript:goToVerse('$bookName','$bookID','$chapterNumber','$verseNumber',1);";
		
		// Highlight the search text
		$verse = highlightSearchText($gSearchText, $verse);
		
		$line = "<div id=\"verseId$verseID\" $styleStr $mouseOverEventStr $mouseOutEventStr> <span><a href=\"$hrefValueStr\">$bookName $chapterNumber:$verseNumber</a>.</span> \t\t $verse </div>";
				
		echo $line;
		++$index;
	}
	
	closeDBConnection();
	//echo $resultsDiv;
}

function highlightSearchText($findme, $subject) 
{ 
     // Replaces $findme in $subject with $replacewith 
     // Ignores the case and do keep the original capitalization by using $1 in $replacewith 
     // Required: PHP 5 
	
	$rest = $subject; 
	$result = ''; 
	$highlightTagStart = "<SPAN style=\"BACKGROUND-COLOR: #ffff00\">";
	$highlightTagEnd = "</SPAN>";

	while (stripos($rest, $findme) !== false) { 
		$pos = stripos($rest, $findme);
		$result = $result . substr($rest, 0, $pos);
		$result = $result . $highlightTagStart;
		$result = $result . substr($rest, $pos, strlen($findme));
        $result = $result . $highlightTagEnd;
		$rest = substr($rest, $pos + strlen($findme));
		
	} 
	// After the last match, append the rest 
	$result = $result . $rest; 
	return $result; 
} //highlightSearchText()
?>
