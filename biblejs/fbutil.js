// File: fbutil.js - Facebook utility script
// Author: John K Gummadi
// Date: 5:01 PM 6/18/2010

function initFacebookScript()
{
	window.fbAsyncInit = function() {
		FB.init({appId: '198206686856112', status: true, cookie: true,
				 xfbml: true});
	  };
	
	var e = document.createElement('script'); 
	e.async = true;
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    document.getElementById('fb-root').appendChild(e);
}

function streamPublish(bookAndVerse, verseText, commentText)
{
	FB.ui( {
		method: 'stream.publish',
		
		//message: 'Getting educated about Facebook Connect',
		attachment: {
			name: "<b> Cloud Study Bible </b><br><br>",
			caption: bookAndVerse,
			description: (verseText + "<br><br>" + commentText), 
			href: 'http://www.cloudstudybible.com/',
     		}, 
	},
	
	function(response) {
		if (response && response.post_id) {
			//alert('Post was published.');
		} 
		else {
			//alert('Post was not published.');
		}
	} );
} //streamPublish()

