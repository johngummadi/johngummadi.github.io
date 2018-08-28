<?php

//$file = "http://api.biblia.com/v1/bible/content/ASV.txt.txt?passage=John3.16&callback=myCallbackFunction&key=fd37d8f28e95d3be8cb4fbc37e15e18e";
$file = "SFM/01-GEN-asv.sfm";
$fp=null;

$xmlFile = "Output/gen-asv.xml";
$xmlFp = null;

if (!($fp = fopen($file, "r"))) {
    die("could not open SFM input");
}

if (!($xmlFp = fopen($xmlFile, "w"))) {
    die("could not create XML output");
}

$chapterNumber = 0;
$chapterID = 0;
$verseNumber = 0;
$verseID = 0;
$bookOpened=0;
$chapterOpened=0;
while(!feof($fp))
{
	$line = fgets($fp);
	
	// Book name
	$bookTag = "\h ";
	$tagFound = substr($line, 0, strlen($bookTag));
	if ($tagFound == $bookTag)
	{
		$bookName = substr($line, strlen($bookTag));
		$bookName = str_replace("\r","", $bookName);
		$bookName = str_replace("\n","", $bookName);
		if ($bookOpened == 1)
			fwrite($xmlFp, "</Book>\r\n");
		fwrite($xmlFp, "<Book name=\"" . $bookName . "\">\r\n");
		$bookOpened=1;
		echo "" . $bookName . "<br><br>";
		
		// Close chapter
		if ($chapterOpened == 1)
		{
			fwrite($xmlFp, "\r\n</Chapter>\r\n");
			$chapterOpened = 0;
		}
		$chapterNumber = 0;
		$verseNumber = 0;
		continue;
	}
	
	// Chapter number
	$chapterTag = "\c ";
	$tagFound = substr($line, 0, strlen($chapterTag));
	if ($tagFound == $chapterTag)
	{
		$chapterNumber++;
		$chapterID++;
		
		$chapterNumberStr = substr($line, strlen($chapterTag));
		$chapterNumberStr = str_replace("\r", "", $chapterNumberStr);
		$chapterNumberStr = str_replace("\n", "", $chapterNumberStr);
		if ($chapterOpened == 1)
			fwrite($xmlFp, "</Chapter>\r\n");
		fwrite($xmlFp, "<Chapter ID=\"" . $chapterID . "\"" . " Number=\"" . $chapterNumberStr . "\">\r\n");
		$chapterOpened=1;
		echo "Chapter " . $chapterNumberStr . "(ID=" . $chapterID . ")<br><br>";
		$verseNumber = 0;
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
			fwrite($xmlFp, "<Verse ID=\"" . $verseID . "\"" . " Number=\"" . $verseNumber . "\">" . $verseStr . "</Verse>\r\n");
			echo "Verse " . $verseNumber . "(ID=" . $verseID . "): " . $verseStr . "<br>";
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
	
fclose($fp);
fclose($xmlFp);
?>
