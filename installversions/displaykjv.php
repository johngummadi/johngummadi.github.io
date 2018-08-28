<?php
$file = "kjv/kjv.xml";
$depth = array();
$testamentCount = 0;
$bookCount = 0;
$chapterCount = 0;
$verseCount = 0;

// KJV:1, NIV:2, ASV:3
$translationID = 1;

$currentTestament="";
$currentBook="";
$currentChapter="";
$currentVerse="";

// IDs Unique in the Bible
$uniqueBookIDCurrent = 0;
$uniqueChapterIDCurrent = 0;
$uniqueVerseIDCurrent = 0;

$bookNumberInTestamentCurrent=0;
$chapterNumberInBookCurrent=0;
$verseNumberInChapterCurrent=0;

$con;

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
	$testamentID = 0;
	if (testamentName == "Old")
		$testamentID = 1;
	else
		$testamentID = 2;
	//$sql = "INSERT INTO  'davean8_Bible'.'Books' ('ID', 'TranslationID', 'FullName', 'ShortName', 'Testament', 'Notes') VALUES ('$bookID',  $translationID,  '$bookFullName',  '', '$testamentID', '')";
	$sql = "INSERT INTO  Books VALUES ('$bookID',$translationID,'$bookFullName','','$testamentID','')";
	
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
	
	$testamentID = 0;
	if (testamentName == "Old")
		$testamentID = 1;
	else
		$testamentID = 2;
	//$sql = "INSERT INTO  'davean8_Bible'.'Chapters' ('ID','BookID', 'ChapterNumber', 'Notes') VALUES ('$chapterID',  '$currentBookID',  '$chapterNumber', '')";
	$sql = "INSERT INTO Chapters VALUES ('$chapterID','$currentBookID','$chapterNumber','')";
	
	//if (mysql_query($sql, $con))
    if (mysql_query($sql))
	{
		echo ">> Added chapter: $chapterNumber of Book:$currentBookID";
	}
	else
	{
		echo ">> Failed to add chapter ($chapterNumber of Book:$currentBookID)";
	}
	echo "<br>";
}


function addVerseRecord($verseID, $chapterID, $verseNumber, $verse)
{
	//$sql ="INSERT INTO  'davean8_Bible'.'Verses' ('ID', 'ChapterID', 'VerseNumber', 'Verse', 'Notes') VALUES ('$verseID',  '$chapterID',  '$verseNumber', '$verse', '')";
	$sql ="INSERT INTO Verses VALUES('$verseID','$chapterID','$verseNumber','$verse','')";
	
	//if (mysql_query($sql, $con))
    if (mysql_query($sql))
	{
		echo ">> Added chapter: $verseNumber of Book:$currentBookNumber";
	}
	else
	{
		echo ">> Failed to add chapter ($verseNumber of $currentBook:$currentChapter)";
	}
	echo "<br>";
}



/*
INSERT INTO  'davean8_Bible'.'Translation' (
'ID' ,
'ShortName' ,
'FullName' ,
'Notes'
)
VALUES (
'1',  'KJV',  'King James Version',  'Authorized version - 1611'
);
*/

function startElement($parser, $name, $attrs) 
{
	// Unique in the whole Bible
	global $uniqueBookIDCurrent;
	global $uniqueChapterIDCurrent;
	global $uniqueVerseIDCurrent;

	// Unique in their own context
	global $bookNumberInTestamentCurrent;
	global $chapterNumberInBookCurrent;
	global $verseNumberInChapterCurrent;

	global $depth;
	global $testamentCount;
	global $bookCount;
	global $chapterCount;
	global $verseCount;

	global $currentTestament;
	global $currentBook;
	global $currentChapter;
	global $currentVerse;
	
	


	for ($i = 0; $i < $depth[$parser]; $i++) {
		echo "  ";
	}
	
	
	foreach ($attrs as $key => $value) { 
		echo "\n$padTag".str_pad(" ", 3); 
		//echo " $key=\"$value\"";
		
		//echo "$name:$value\n";
		if ($name == "TESTAMENT")
		{
			$bookNumberInTestamentCurrent=0;
			$chapterNumberInBookCurrent=0;
			$verseNumberInChapterCurrent=0;

			// Old stuff			
			$currentTestament = "$value";
			$currentBook = "nullbook";
			$currentChapter = "nullchapter";
			$currentVerse = "nullverse";
			echo "<br>"; 
		}
		else if ($name == "BOOK")
		{
			++$uniqueBookIDCurrent;
			++$bookNumberInTestamentCurrent;
			$chapterNumberInBookCurrent=0;
			$verseNumberInChapterCurrent=0;
			
			// Old stuff			
			$currentBook = "$value";
			$currentChapter = "nullchapter";
			$currentVerse = "nullverse";
			echo "<br>"; 
			
			addBookRecord($uniqueBookIDCurrent, $currentBook, $currentTestament);
		}
		else if ($name == "CHAPTER")
		{
			++$uniqueChapterIDCurrent;
			++$chapterNumberInBookCurrent;
			$verseNumberInChapterCurrent=0;
			
			// Old stuff
			$currentChapter = "$value";
			$currentVerse = "nullverse";
			echo "<br>"; 
			
			addChapterRecord($uniqueChapterIDCurrent, $uniqueBookIDCurrent, $chapterNumberInBookCurrent);
		}
		else if ($name == "VERSE")
		{
			++$uniqueVerseIDCurrent;
			++$verseNumberInChapterCurrent;
			
			// Old stuff
			$currentVerse = "$value";
		}
	} 
	
	//echo "$name\n";
	if ($name == "TESTAMENT")
	{
		++$testamentCount;
	}
	else if ($name == "BOOK")
	{
		++$bookCount;
	}
	else if ($name == "CHAPTER")
	{
		++$chapterCount;
	}
	else if ($name == "VERSE")
	{
		++$verseCount;
	}
	else
	{
		echo ">>>>ELSE:   $value";
		//++$chapterCount;
	}
	
	//echo "<br>";
	$depth[$parser]++;
}

function endElement($parser, $name) 
{
    global $depth;
    $depth[$parser]--;
}

function contents($parser, $data) { 
	// Unique in the whole Bible
	global $uniqueBookIDCurrent;
	global $uniqueChapterIDCurrent;
	global $uniqueVerseIDCurrent;

	// Unique in their own context
	global $bookNumberInTestamentCurrent;
	global $chapterNumberInBookCurrent;
	global $verseNumberInChapterCurrent;

	global $closeTag; 
	global $currentTestament;
	global $currentBook;
	global $currentChapter;
	global $currentVerse;
    
	$data = preg_replace("/^\s+/", "", $data); 
	$data = preg_replace("/\s+$/", "", $data); 

	if (!($data == ""))  { 
		echo "$currentTestament:$currentBook:$currentChapter:$currentVerse  &gt;$data\n"; 
		echo "<br>"; 
		
		addVerseRecord($uniqueVerseIDCurrent, $uniqueChapterIDCurrent, $verseNumberInChapterCurrent, $data);
		$closeTag = TRUE; 
	} 
	else { 
		$closeTag = FALSE; 
	} 
} 

function parseDEFAULT($parser, $data) { 
    
    $data = preg_replace("/</", "&lt;", $data); 
    $data = preg_replace("/>/", "&gt;", $data); 
    echo $data; 
} 

// Open database
openDBConnection();


$xml_parser = xml_parser_create();
xml_set_default_handler($xml_parser, "parseDEFAULT"); 
xml_set_element_handler($xml_parser, "startElement", "endElement");
xml_set_character_data_handler($xml_parser, "contents");
if (!($fp = fopen($file, "r"))) {
    die("could not open XML input");
}

while ($data = fread($fp, 4096)) {
    if (!xml_parse($xml_parser, $data, feof($fp))) {
        die(sprintf("XML error: %s at line %d",
                    xml_error_string(xml_get_error_code($xml_parser)),
                    xml_get_current_line_number($xml_parser)));
    }
}
xml_parser_free($xml_parser);

// Close database
closeDBConnection();

displayStats();

function displayStats() { 
	global $testamentCount;
	global $bookCount;
	global $chapterCount;
	global $verseCount;
	
	echo "<br>";
	echo "<br>";
	echo "No of testaments: $testamentCount";
	echo "<br>";
	echo "No of books: $bookCount";
	echo "<br>";
	echo "No of chapters: $chapterCount";
	echo "<br>";
	echo "No of verses: $verseCount";
	echo "<br>";
}

?>
