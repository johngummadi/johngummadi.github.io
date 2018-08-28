// This script implements Google gears functionality on Bible content.
var gGearsDB = null;

// Open this page's local database.
function GearInit() 
{
	var success = false;
	if (window.google && google.gears) 
	{
		try 
		{
			if (!gGearsDB)
				gGearsDB = google.gears.factory.create('beta.database');
			if (gGearsDB) 
			{
				gGearsDB.open('cloudstudybible');
				gGearsDB.execute('create table if not exists Demo' + ' (Phrase varchar(255), Timestamp int)');
				gGearsDB.execute('create table if not exists Translations' + ' (ID int, ShortName varchar(20), FullName varchar(50), Notes varchar(2048))');
				gGearsDB.execute('create table if not exists KjvBooks' + ' (ID int, TranslationID int, FullName varchar(25), ShortName varchar(10), Testament int, ChapterCount int, Notes varchar(1024))');
				//gGearsDB.execute('create table if not exists KjvChapters(ID int(11) unsigned NOT NULL, BookID INT(11) unsigned NOT NULL, ChapterNumber INT(11) unsigned NOT NULL, Notes VARCHAR(2048) CHARACTER SET ASCII DEFAULT NULL, PRIMARY KEY(ID))');
				//gGearsDB.execute('create table if not exists KjvVerses(ID int(11) unsigned NOT NULL, ChapterID INT(11) unsigned NOT NULL, VerseNumber INT(11) unsigned NOT NULL, Verse VARCHAR(2048) CHARACTER SET ASCII NOT NULL, Notes VARCHAR(2048) CHARACTER SET ASCII DEFAULT NULL, PRIMARY KEY (ID), FULLTEXT KEY Notes (Notes)');
				success = true;
			}
		} 
		catch (ex) 
		{
			// something went wrong, reset gGearsDB
			success = false;
			//gGearsDB = null;
		}
	}
	return success;
} //GearInit()

function GearAddBooksKjv(booksArray)
{
	var success = false;
	try 
	{
		if (gGearsDB == null || booksArray == null || booksArray.length<=0)
			return false;
		var index = 0;
		while (index < booksArray.length)
		{
			var id = booksArray[index]["id"];
			var translationID = booksArray[index]["translationID"];
			var bookFullName = booksArray[index]["fullName"];
			var bookShortName = booksArray[index]["shortName"];
			var testament = booksArray[index]["testament"];
			var chapterCount = booksArray[index]["chapterCount"];
			var notes = booksArray[index]["notes"];
			gGearsDB.execute('insert into KjvBooks values (?, ?, ?, ?, ?, ?, ?)', [id, translationID, bookFullName, bookShortName, testament, chapterCount, notes]);
			index++;
		}
		success = true;
	}
	catch (ex)
	{
		success = false;
	}
	return success;
} //GearAddBooksKjv()
/*
function GearAddBooksKjv(booksContent)
{
	//var success = false;
	var booksArray = new Array();
	try 
	{
		if (gGearsDB == null)
			return false;
		
		var bookLines = booksContent.split('|');
		var index = 0;
		while (index < bookLines.length-1)
		{
			var line = "";
			var bookLine = bookLines[index].split('^');
			var id = bookLine[0];
			var bookFullName = bookLine[1];
			var chapterCount = bookLine[2];
			var commentCount = bookLine[3];
			var translationID = 1;
			var bookShortName = "";
			var testament = 1;
			var notes = '';
			if (id > 39)
				testament = 2;
			gGearsDB.execute('insert into KjvBooks values (?, ?, ?, ?, ?, ?, ?)', [id, translationID, bookFullName, bookShortName, testament, chapterCount, notes]);
			booksArray[index] = new Book(id, translationID, bookFullName, bookShortName, testament, chapterCount, notes);
			index++;
		}
	}
	catch (ex)
	{
		booksArray = null;
	}
	return booksArray;
} //GearAddBooksKjv()
*/

function Book(id, translationID, fullName, shortName, testament, chapterCount, commentCount, notes)
{
	this.id = id;
	this.translationID = translationID;
	this.fullName = fullName;
	this.shortName = shortName;
	this.testament = testament;
	this.chapterCount = chapterCount;
	this.commentCount = commentCount;
	this.notes = notes;
}

function GearGetBooksKjv()
{
	var booksArray = new Array();
	try
	{
		if (gGearsDB == null)
			return null;
		
		var rs = gGearsDB.execute('select * from KjvBooks');
		var index = 0;
		if (rs && rs.isValidRow())
		while (rs && rs.isValidRow() && index<66) 
		{
			var id = rs.field(0);
			var translationID = rs.field(1);
			var fullName = rs.field(2);
			var shortName = rs.field(3);
			var testament = rs.field(4);
			var chapterCount = rs.field(5);
			var notes = rs.field(6);
			booksArray[index] = new Book(id, translationID, fullName, shortName, testament, chapterCount, "", notes);
			++index;
			rs.next();
		}
	}
	catch (ex)
	{
		booksArray = null;
	}
	return booksArray;
} //GearGetBooksKjv()




