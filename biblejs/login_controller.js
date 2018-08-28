// js handling the login procedures

// constants
var NORMAL_STATE = 4;
var LOGIN_PREFIX = "biblejs/userlogin.php?";

// variables
var http = getHTTPObject(); // We create the HTTP Object
var hasSeed = false;
var loggedIn = false;
var seed_id = 0;
var seed = 0;
var gFullname = '';
var messages = '';
var gUsername = '';
var gPassword = '';
var gLoginSuccessfulCallback=0;
var gLoginFailedCallback=0;
var gStatusMessagesCallback=0;

function isLoggedIn()
{
	if (loggedIn == true)
		return true;
	return false; 
}

function getFullName()
{
	return gFullname;
}

function doLogin(username, password, loginSuccessfulCallback, loginFailedCallback, statusMessagesCallback)
{
	gUsername = username;
	gPassword = password;
	gLoginSuccessfulCallback = loginSuccessfulCallback;
	gLoginFailedCallback = loginFailedCallback;
	gStatusMessagesCallback = statusMessagesCallback;
	getSeed();
}

// getSeed method:  gets a seed from the server for this transaction
function getSeed() 
{		// only get a seed if we're not logged in and we don't already have one
		if (!loggedIn && !hasSeed) {
			// open up the path
			http.open('GET', LOGIN_PREFIX + "t=getseed", true);
			http.onreadystatechange = handleHttpGetSeed;
			http.send(null);
		}
		else
		{
			//gLoginFailedCallback("Already logged in");
			validateLogin();
		}
}

// handleHttpGetSeed method: called when the seed is returned from the server
function handleHttpGetSeed()
{
	// if there hasn't been any errors
	if (http.readyState == NORMAL_STATE) {
		// split by the divider |
		results = http.responseText.split('|');
		
		// id is the first element
		seed_id = results[0];
		
		// seed is the second element
		seed = results[1];
		
		// now we have the seed
		hasSeed = true;
		//gLoginFailedCallback("Got seed, now validating...");
		gStatusMessagesCallback("Got seed, now validating...");
		validateLogin();
	}
	else
	{
		//gLoginFailedCallback("Login progress, seed state =" + http.readyState + "");
		gStatusMessagesCallback("Login progress, seed state =" + http.readyState + "");
	}
}

// validateLogin method: validates a login request
function validateLogin()
{
	// ignore request if we are already logged in
	if (loggedIn)
	{
		gLoginFailedCallback("validateLogin: Logged in already!");
		return;
	}
		
	// ignore if either is empty
	if (gUsername != '' && gPassword  != '') 
	{
		// compute the hash of the hash of the password and the seed
		hash = hex_md5(hex_md5(gPassword) + seed);
		
		// open the http connection
		http.open('GET', LOGIN_PREFIX + "t=checklogin&u="+gUsername+"&sid="+seed_id+"&h="+hash, true);
		
		// where to go
		http.onreadystatechange = handleHttpValidateLogin;
		http.send(null);
	}
	else
	{
		gLoginFailedCallback("validateLogin: User/password is empty!");
	}
}

// handleHttpValidateLogin method: called when the validation results are returned from the server
function handleHttpValidateLogin()
{
	// did the connection work?
	if (http.readyState == NORMAL_STATE) 
	{
		//gLoginFailedCallback("Got response");
		gStatusMessagesCallback("Got response");
		// split by the pipe
		results = http.responseText.split('|');
		if (results[0] == 'true')
		{
			hasSeed = false;
			loggedIn = true;
			gFullname = results[1];
			messages = '';
			var lastBookID = results[2];
			var lastChapterNumber = results[3];
			var lastVerseNumber = results[4];
			gLoginSuccessfulCallback(gFullname, gUsername, gPassword, lastBookID, lastChapterNumber, lastVerseNumber);
		}
		else
		{
			messages = results[1];
			gStatusMessagesCallback(messages);
			//gLoginFailedCallback(messages);
		}
	}
	else
	{
		//gLoginFailedCallback("Login progress, login state =" + http.readyState + "");
		gStatusMessagesCallback("Login progress, login state =" + http.readyState + "");
	}
}

function logout()
{
	//TODO: Send the logout message to database, for now just set the local variables
	loggedIn = false;
	hasSeed = false;
	
}
// resetLogin method: if logged in, 'logs out' and allows a different user/pass to be entered
function resetLogin()
{
	loggedIn = false;
	hasSeed = false;
}
