<?php

$writeToDb=1;
$con = null;

// KJV:1, NIV:2, ASV:3
$translationID = 3;

$verseID = 0;
$chapterID = 0;
$bookID = 0;

if ($writeToDb == 1)
{
	echo "Will write to database... <br><br>";
	openDBConnection();
}

$xmlFile = "Output/asv-combined.xml";
if (!($xmlFp = fopen($xmlFile, "w"))) {
	die("could not create XML output");
}

$path = "SFM/*.sfm";
$files   = glob($path);
foreach ($files as $file) 
{
	echo "$file - START <br>";
	$fp = null;
	if (!($fp = fopen($file, "r"))) 
		die("<br>could not open $file");
	AppendFile($fp, $xmlFp);
	fclose($fp);
	echo "$file - END <br>";
}
fclose($xmlFp);

if ($writeToDb == 1)
{
	closeDBConnection();
}


function AppendFile($fp, $xmlFp)
{
	global $writeToDb;
	global $verseID;
	global $chapterID;
	global $bookID;
	
	$chapterNumber = 0;
	$verseNumber = 0;
	$bookOpened=0;
	$chapterOpened=0;
	$verseOpened=0;
	while(!feof($fp))
	{
		$line = fgets($fp);
		
		//Replace "\add*" with "</i>"
		$line = str_replace("\add*","</i>", $line);
		
		//Replace "\add" with "</i>"
		$line = str_replace("\add","<i>", $line);
		
		$line = str_replace("\r","", $line);
		$line = str_replace("\n","", $line);
		
		
		// Close Verse
		if ($verseOpened == 1)
		{
			$newTag = "\\";
			$tagFound = substr($line, 0, strlen($newTag));
			if ($tagFound == $newTag)
			{
				fwrite($xmlFp, "</Verse>\r\n");
				$verseOpened = 0;
				echo "<br>";
			}
			else
			{
				// Some verses are split in more than one line, so append the left 
				//	over verse text here.
				fwrite($xmlFp, " $line");
				echo " $line";
				continue;
			}
		}
		
		
		// Book name
		$bookTag = "\h ";
		$tagFound = substr($line, 0, strlen($bookTag));
		if ($tagFound == $bookTag)
		{
			$bookID++;
			// Close chapter
			if ($chapterOpened == 1)
			{
				fwrite($xmlFp, "</Chapter>\r\n");
				$chapterOpened = 0;
			}
			$chapterNumber = 0;
			$verseNumber = 0;
			
			
			$bookName = substr($line, strlen($bookTag));
			$bookName = str_replace("\r","", $bookName);
			$bookName = str_replace("\n","", $bookName);
			if ($bookOpened == 1)
				fwrite($xmlFp, "</Book>\r\n");
			fwrite($xmlFp, "<Book name=\"" . $bookName . "\">\r\n");
			$bookOpened=1;
			
			if ($writeToDb == 1)
			{
				if ($bookID < 40)
					addBookRecord($bookID, $bookName, "Old");
				else
					addBookRecord($bookID, $bookName, "New");
			}
			echo "" . $bookName . "<br><br>";
			continue;
		}
	
		// Chapter number
		$chapterTag = "\c ";
		$tagFound = substr($line, 0, strlen($chapterTag));
		if ($tagFound == $chapterTag)
		{
			$verseNumber = 0;
			$chapterNumber++;
			$chapterID++;
		
			$chapterNumberStr = substr($line, strlen($chapterTag));
			$chapterNumberStr = str_replace("\r", "", $chapterNumberStr);
			$chapterNumberStr = str_replace("\n", "", $chapterNumberStr);
			if ($chapterOpened == 1)
				fwrite($xmlFp, "</Chapter>\r\n");
			fwrite($xmlFp, "<Chapter ID=\"" . $chapterID . "\"" . " Number=\"" . $chapterNumberStr . "\">\r\n");
			$chapterOpened=1;
			if ($writeToDb == 1)
			{
				addChapterRecord($chapterID, $bookID, $chapterNumber);
			}
			echo "Chapter " . $chapterNumberStr . "(ID=" . $chapterID . ")<br><br>";
			continue;
		}
	
		// Verse
		$verseTag = "\\v ";
		$tagFound = substr($line, 0, strlen($verseTag));
		if ($tagFound == $verseTag)
		{
			$tmpVerseNumber = $verseNumber + 1;
			$verseNumberTag = "\\v $tmpVerseNumber";
			$tagFound = substr($line, 0, strlen($verseNumberTag));
			if ($tagFound == $verseNumberTag)
			{
				$verseNumber++;
				$verseID++;
			
				$verseStr = substr($line, strlen($verseNumberTag));
				$verseStr = str_replace("\r", "", $verseStr);
				$verseStr = str_replace("\n", "", $verseStr);
				fwrite($xmlFp, "<Verse ID=\"" . $verseID . "\"" . " Number=\"" . $verseNumber . "\">" . $verseStr . "");
				$verseOpened = 1;
				if ($writeToDb == 1)
				{
					addVerseRecord($verseID, $chapterID, $verseNumber, $verseStr);
				}
				echo "Verse $verseNumber (ID=$verseID): $verseStr";
				continue;
			}
		}
		else
		{
			//echo "Looking for " . $verseTag . " but found " . $tagFound . "<br>";
		}
	
	}
	if ($chapterOpened == 1)
		fwrite($xmlFp, "</Chapter>\r\n");
	
	if ($bookOpened == 1)
		fwrite($xmlFp, "</Book>\r\n");
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


// $bookID: The unique number of the book (Eg: Revelation is 66)
function addBookRecord($bookID, $bookFullName, $testamentName)
{
	global $translationID;
	$testamentID = 0;
	if ($testamentName == "Old")
		$testamentID = 1;
	else
		$testamentID = 2;
	
	echo "Adding to database $bookID, $bookFullName, $testamentName <br>";
	//$sql = "INSERT INTO  'davean8_Bible'.'AsvBooks' ('ID', 'TranslationID', 'FullName', 'ShortName', 'Testament', 'Notes') VALUES ('$bookID',  $translationID,  '$bookFullName',  '', '$testamentID', '')";
	$sql = "INSERT INTO  AsvBooks VALUES ('$bookID',$translationID,'$bookFullName','','$testamentID','')";
	
	//if (mysql_query($sql, $con))
    if (mysql_query($sql))
	{
		echo "Added book: $bookFullName";
	}
	else
	{
		echo "Failed to add book: $bookFullName";
	}
	echo "<br>";
}

// $chapterID: The unique chapter number in the whole Bible - 
//	We take the universal chapter number as ID
function addChapterRecord($chapterID, $currentBookID, $chapterNumber)
{
	// Ignore the calculation below
	//$chapterID = $chapterNumber + (10000 * $currentBookID);
	// To get the book number, do: $chapterID/10000;
	// To get the chapter number (in that book), do: $chapterID%10000;
	$sql = "INSERT INTO AsvChapters VALUES ('$chapterID','$currentBookID','$chapterNumber','')";
	
	//if (mysql_query($sql, $con))
	if (!mysql_query($sql))
	{
		echo "<br>>> Failed to add chapter ($chapterNumber of Book:$currentBookID) <br>";
	}
}


function addVerseRecord($verseID, $chapterID, $verseNumber, $verse)
{
	$sql ="INSERT INTO AsvVerses VALUES('$verseID','$chapterID','$verseNumber','$verse','')";
	
	if (!mysql_query($sql))
	{
		echo "<br>>> Failed to add chapter ($verseNumber of $currentBook:$currentChapter)<br>";
	}
}

?>
