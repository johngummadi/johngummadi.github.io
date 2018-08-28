<?php
	ReadAndParseFromFile();
	
	
	function ParseAndAddBook($line)
	{
		$bookname = "";
		sscanf($line, "<BN>%[^[]]</BN>", $bookname); //%s ignores rest of the string after space
		if ($bookname!=null && $bookname != "")
		{
			echo "<br><br><b>" . $bookname . "</b><br>";
			return true;
		}
		return false;
	} //ParseAndAddBook()
	
	function ParseAndAddChapter($line)
	{
		$chapter = "";
		sscanf($line, "<CN>%[^[]]</CN>", $chapter); //%s ignores rest of the string after space
		if ($chapter!=null && $chapter != "")
		{
			echo "<br>&nbsp;&nbsp;<i>" . $chapter . "</i><br>";
			return true;
		}
		return false;
	} //ParseAndAddChapter()
	
	function ParseAndAddSubheading($line)
	{
		$subheading = "";
		sscanf($line, "<SH>%[^[]]</SH>", $subheading); //%s ignores rest of the string after space
		if ($subheading!=null && $subheading != "")
		{
			echo "&nbsp;&nbsp;<blue>" . $subheading . "</blue><br>";
			return true;
		}
		return false;
	} //ParseAndAddSubheading()
	 
	function ParseAndAddVerse($line)
	{
		$verse = "";
		$dummy="";
		$booknumber="";
		$chapternumber="";
		$versenumber = "";
		
		//$dblBraces = array("{{", "}}");
		//$line = str_replace($dblBraces, "", $line);
		//sscanf($line, "<%s>%d:%d%[^[]]", $dummy, $booknumber, $chapternumber, $verse); //%s ignores rest of the string after space
		
		// <C>{{01:1}}1 In the beginning God created the heavens and the earth.
		//<V>{{01:1}}2 The earth was <$FOr {a waste and emptiness}>>formless and void, ...	
		
		//%s ignores rest of the string after space
		sscanf($line, "<%[A-Z]>{{%d:%d}}%d%[^[]]", $dummy, $booknumber, $chapternumber, $versenumber, $verse); // This works perfectly
		//$specialSearchStrings = array("/<[\$F]/", "!>>!", "!{!", "!}!");
		//$searchStrings = array("/<[\$F]/", "!{!", "!}!", "!>>!");
		$searchStrings = array(
				"/<[\$F]/", 
				"!{!", 
				"!}!", 
				"!>>!", 
				'/<RS>/', 
				"/<\/RS>\]/", //</RS>]
				'/<\/RS>/');
				
		$replaceStrings = array(
				"<span style=\"color:#ff0000; cursor:help;\" title=\"", 
				"[", 
				"]", 
				"\" ><sup><b>i</b></sup></span>", 
				"<span style=\"color:#ff0000;\">",
				"</span>",  
				"</span>");
		$verse = preg_replace($searchStrings, $replaceStrings, $verse);
		
		
		
		
		
		// http://cloudstudybible.com/installversions/nasb/nasb.php
		if ($verse!=null && $verse != "")
		{
			echo "&nbsp;&nbsp;&nbsp;&nbsp;v.$versenumber:&nbsp;" . $verse . "<br>";
			return true;
		}
		return false;
	}
	
	function ReadAndParseFromFile()
	{
		echo "<html><body>";
		$f = fopen ("NASBNNR.TXT", "r");
    	$ln= 0;
    	$bookCount = 0;
	    while ($line= fgets ($f)) 
	    {
    	    ++$ln;
    	    if ($bookCount==0 && !stristr($line, "matthew"))
    	    	continue; //ignore
    	    if (ParseAndAddBook($line)==true)
    	    {
    	    	$bookCount++;
    	    	if ($bookCount>1)
    	    		break;
    	    	continue;
    	    }
    	    if (ParseAndAddChapter($line)==true)
    	    	continue;
    	    if (ParseAndAddSubheading($line)==true)
	    	    continue;
	    	if (ParseAndAddVerse($line)==true)
	    		continue;
	    }
    	fclose ($f);
    	echo "</body></html>";
	} //ReadAndParseFromFile()
?>
