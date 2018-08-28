
function CsbPanel(panelId, modal, panelHasTitle, titleText, contentHTML, left, top, width, height)
{
	var panelOuterDiv = null;
	var panelDiv = null;
	
	this.outerPanelId = panelId + "_Outer";
	this.panelId = panelId;
	this.titleText = titleText;
	this.contentHTML = contentHTML;
	this.titleBarColor = "#86B8F4"; //"#6699ff";
	this.onHide = null;
	this.onDestroy = null;
	
	//this.modal = true;
	this.modal = modal;
	
	this.panelLeft = left;
	this.panelTop = top;
	this.panelWidth = width;
	this.panelHeight = height;
	this.panelRight = this.panelLeft + this.panelWidth;
	this.panelBottom = this.panelTop + this.panelHeight;
	
	this.panelBorderWidth = 5;
	this.panelBorderStyle = "solid";
	this.panelBorderColor = "#888888";
	
	this.panelRoundedCornerTopLeft = true;
	this.panelRoundedCornerTopRight = true;
	this.panelRoundedCornerBottomLeft = true;
	this.panelRoundedCornerBottomRight = true;
	
	this.panelHasCloseButton = true;
	
	this.Create(panelHasTitle);
}

CsbPanel.prototype.Destroy = function ()
{
	if (this.panelDiv)
	{
		while(this.panelDiv.firstChild)
		{
			this.panelDiv.removeChild(this.panelDiv.firstChild);
		}
		
		if (this.panelOuterDiv)
		{
			this.panelOuterDiv.removeChild(this.panelDiv);
			document.body.removeChild(this.panelOuterDiv);
			this.panelDiv = null;
			this.panelOuterDiv = null;
		}
		else
		{
			document.body.removeChild(this.panelDiv);
			this.panelDiv = null;
		}
		if (this.panelDiv.onDestroy)
			this.panelDiv.onDestroy();
	}
}

function HidePanel(panelOuterDiv, panelDiv)
{
	if (!panelDiv)
		return;
	
	if (panelDiv)
		panelDiv.style.display = "none";
	
	if (panelOuterDiv)
		panelOuterDiv.style.display = "none";
	
	if (panelDiv.onHide)
		panelDiv.onHide();
} //HidePanel()

CsbPanel.prototype.Hide = function ()
{
	HidePanel(this.panelOuterDiv, this.panelDiv);
}


function ShowPanel(panelOuterDiv, panelDiv, panelWidth, panelHeight)
{
	if (panelOuterDiv)
	{
		panelOuterDiv.style.display = "block";
	}
	if (panelDiv)
	{
		panelDiv.style.display = "block";
		// Show inner content div
		var panelDivID = panelDiv.getAttribute("id");
		var contentDivID = panelDivID + "_content";
		contentDiv = document.getElementById(contentDivID);
		if (contentDiv)
		{
			contentDiv.style.display = "block";
		}
	}
}

CsbPanel.prototype.Show = function ()
{
	ShowPanel(this.panelOuterDiv, this.panelDiv, this.panelWidth, this.panelHeight);
}

CsbPanel.prototype.CenterPanel = function ()
{
	if (this.panelOuterDiv)
	{
		this.panelOuterDiv.style.width = "0px";
		this.panelOuterDiv.style.height = "0px";
		this.panelOuterDiv.style.width = documentWidth() + "px";
		this.panelOuterDiv.style.height = documentHeight() + "px";
	}
	
	this.panelLeft = Math.round((documentWidth()/2) - (this.panelWidth/2));
	this.panelTop = Math.round((documentHeight()/2) - (this.panelHeight/2));
	if (this.panelLeft<0)
		this.panelLeft = 0;
	if (this.panelTop<0)
		this.panelTop = 0;
	this.panelDiv.style.left = this.panelLeft + "px";
	this.panelDiv.style.top = this.panelTop + "px";
	
	var contentDiv = document.getElementById(this.panelId + "_content");
	if (contentDiv)
	{
		var titleHeight = 12;
		var othersHeight = 26; //borders, etc.,
		contentDiv.style.height = (this.panelHeight-titleHeight-othersHeight) + "px";
		contentDiv.style.width = (this.panelWidth - 10) + "px";
		contentDiv.setAttribute("ContentHeight", contentDiv.style.height);
		contentDiv.setAttribute("ContentWidth", contentDiv.style.width);
	}
};

CsbPanel.prototype.AddCloseButton = function ()
{
	var titleDivID = this.panelId + "_title";
	var titleDiv = document.getElementById(titleDivID);
	if (titleDiv)
	{
		var path = "themes/" + $g_theme + "/close_normal.png";
		var closeDivID = titleDivID + "_closeDiv";
		var closeBtnID = titleDivID + "_closeBtn";
		var closeBtnDiv = document.createElement('span');
		closeBtnDiv.setAttribute('id', closeDivID);
		
		var floatStr = "right";
		/*
		if (isMac())
		{
			floatStr = "left";
		}
		*/
		
		closeBtnDiv.innerHTML = "<img id=\"" + 
		closeBtnID + "\" src=\"" + $gcloseBtn.src + "\" style=\"position:relative; float:" + floatStr + "; top:0px;\" onmousedown=\"javascript:mouseDownPanelCloseBtn('" + 
			closeBtnID + "');\" onmouseup=\"javascript:mouseUpPanelCloseBtn('" + 
			closeBtnID + "', '" + this.panelId + "');\" onclick=\"javascript:onClickPanelCloseBtn('" + 
			closeBtnID + "', '" + this.panelId + "','" + this.outerPanelId + "');\" onMouseOut = \"javascript:mouseOutPanelCloseBtn('" + 
			closeBtnID + "')\"></img>";
		titleDiv.appendChild(closeBtnDiv);
		//this.panelOuterDiv.setAttribute('onclick', "javascript:onClickOuterPanel(event, '" + this.panelId +
		//			"', '" + this.outerPanelId + "');");
		closeBtnDiv.style.zIndex = "1";
		closeBtnDiv.style.position = "relative";
		closeBtnDiv.style.float = floatStr; //"right";
		closeBtnDiv.style.paddingRight = "2px";
		//closeBtnDiv.style.paddingTop = "-1px";
		closeBtnDiv.style.top = "-1px";
		disableSelection(closeBtnDiv);
	}
}

//function onClickOuterPanel(evt, outerDivID)
function onClickOuterPanel(evt, panelId, outerPanelId)
{
	//var evt = event;
	var panelDiv = document.getElementById(panelId);
	var outerPanelDiv = document.getElementById(outerPanelId);
	if (panelDiv && outerPanelDiv)
	{
		var target = null;
		if (isFirefox())
			target = evt.target;
		else if (isIE())
			target = evt.srcElement;
		else
			target = evt.target;
		//alert(target + " - " + outerPanelDiv);
		if (target == outerPanelDiv)
		{
			HidePanel(outerPanelDiv, panelDiv);
			/*
			outerDiv.style.visibility = "hidden";
			if (outerDiv.firstChild)
				outerDiv.firstChild.style.visibility = "hidden";
			*/
		}
	}
}

CsbPanel.prototype.Create = function (panelHasTitle)
{
	var titleHeight = 12;
	var othersHeight = 26; //borders, etc.,
	
	this.panelOuterDiv = document.getElementById(this.outerPanelId);
	if (!this.panelOuterDiv && this.modal)
	{
		this.panelOuterDiv = document.createElement('div');
		this.panelOuterDiv.setAttribute('id', this.outerPanelId);
		document.body.appendChild(this.panelOuterDiv);
		//this.panelOuterDiv.onclick=new Function("javascript:onClickOuterPanel('" + this.outerPanelId + "')");
		//this.panelOuterDiv.onclick = "onClickOuterPanel('" + this.outerPanelId + "')";
		//this.panelOuterDiv.setAttribute('onclick', "javascript:onClickOuterPanel(event, '" + this.outerPanelId + "');");
		if (isIE())
			this.panelOuterDiv.onclick=new Function("javascript:onClickOuterPanel(event, '" + this.panelId + "','" + this.outerPanelId + "')");
		else
			this.panelOuterDiv.setAttribute('onclick', "javascript:onClickOuterPanel(event, '" + this.panelId + "', '" + this.outerPanelId + "');");
	}
	if (this.panelOuterDiv)
	{
		this.panelOuterDiv.style.position = "absolute";
		this.panelOuterDiv.style.width = documentWidth() + "px";
		this.panelOuterDiv.style.height = documentHeight() + "px";
		this.panelOuterDiv.style.left = "0px";
		this.panelOuterDiv.style.top = "0px";
		if (isIE())
		{
			document.body.style.autoScroll = "true";
			document.body.style.overflow = "auto";
			
			//this.panelOuterDiv.style.backgroundMsFilter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)"; 
			this.panelOuterDiv.style.backgroundColor = "#777777";
			this.panelOuterDiv.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";
			
			//this.panelOuterDiv.style.backgroundMsFilter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)"; 
			//this.panelOuterDiv.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000050, endColorstr=#99000050);";
			
			//this.panelOuterDiv.style.backgroundColor = "#777777";
			//-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)"; 
			//this.panelOuterDiv.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);";
		}
		else
		{
			this.panelOuterDiv.style.backgroundColor = "rgba(0, 0, 0, .75)";
		}
	}
	
	this.panelDiv = document.getElementById(this.panelId);
	if (!this.panelDiv)
	{
		this.panelDiv = document.createElement('div');
		if (!this.panelDiv)
			return null;
		
		this.panelDiv.onHide = this.onHide;
		this.panelDiv.onDestroy = this.onDestroy;
		this.panelDiv.setAttribute('id', this.panelId);
		if (this.panelOuterDiv)
			this.panelOuterDiv.appendChild(this.panelDiv);
		else
			document.body.appendChild(this.panelDiv);
		
		this.panelDiv.style.position = "relative";
		var classStr = "";
		if (this.panelRoundedCornerTopLeft == true)
			classStr += "ui-corner-tl ";
		if (this.panelRoundedCornerTopRight == true)
			classStr += "ui-corner-tr ";
		if (this.panelRoundedCornerBottomLeft == true)
			classStr += "ui-corner-bl ";
		if (this.panelRoundedCornerBottomRight == true)
			classStr += "ui-corner-br ";
		this.panelDiv.setAttribute('class', classStr);
		
		this.panelDiv.style.position = "absolute";
		this.panelDiv.style.zIndex = "1";
		this.panelDiv.style.backgroundColor = "#ffffff";
		this.panelDiv.style.marginTop = ".5em";
		this.panelDiv.style.marginBottom = ".5em";
		
		this.panelDiv.style.borderStyle = this.panelBorderStyle; //"solid 2";
		this.panelDiv.style.borderWidth = this.panelBorderWidth + "px";
		this.panelDiv.style.borderColor = this.panelBorderColor;
		
		if (panelHasTitle == true)
		{
			var path = "themes/" + $g_theme + "/close_normal.png";
			var titleDivID = this.panelId + "_title";
			var closeBtnID = titleDivID + "_closebtn";
			
			var titleDiv = document.createElement('div');
			if (!titleDiv)
				return null;
			titleDiv.setAttribute('id', titleDivID);
			titleDiv.style.height = titleHeight + "px";
			titleDiv.style.paddingLeft = ".4em";
			titleDiv.style.paddingRight = ".4em";
			titleDiv.style.paddingBottom = ".7em";
			titleDiv.style.paddingTop = ".4em";
			titleDiv.style.margin = ".1em";
			titleDiv.style.color = "white";
			titleDiv.style.fontSize = "small";
			titleDiv.style.fontWeight = "bold";
			titleDiv.innerHTML = this.titleText;
			//titleDiv.appendChild(closeBtnDiv);
			titleDiv.style.backgroundColor = this.titleBarColor;
			this.panelDiv.appendChild(titleDiv);
		} //if (panelHasTitle == true)
		
		var contentDivID = this.panelId + "_content";
		var contentDiv = document.createElement('div');
		if (!contentDiv)
			return null;
		contentDiv.setAttribute('id', contentDivID);
		contentDiv.style.padding = ".3em";
		contentDiv.style.fontSize = "13px";
		contentDiv.style.height = (this.panelHeight-titleHeight-othersHeight) + "px";
		//contentDiv.style.backgroundColor = "red";
		contentDiv.innerHTML = this.contentHTML;
		
		//this.Refresh();
		this.panelDiv.appendChild(contentDiv);
	} //if (!this.panelDiv)
	
	
	//this.panelDiv.style.opacity = "100";
	//this.panelDiv.style.filter = "alpha(opacity=100)";
	
	// Remove children if any
	/*
	while(this.panelDiv.firstChild)
	{
		this.panelDiv.removeChild(this.panelDiv.firstChild);
	}
	*/
	if (this.panelOuterDiv)
		return this.panelOuterDiv;
	return this.panelDiv;
};

function mouseDownPanelCloseBtn(divID)
{
	var btndiv = document.getElementById(divID);
	if (btndiv)
	{
		btndiv.src = $gcloseBtnDown.src;
	}
} //mouseDownPanelCloseBtn()

function onClickPanelCloseBtn(divID, panelDivId, outerPanelId)
{
	var panelDiv = document.getElementById(panelDivId);
	var outerPanelDiv = document.getElementById(outerPanelId);
	HidePanel(outerPanelDiv, panelDiv);
} //onClickPanelCloseBtn()

function mouseUpPanelCloseBtn(divID, panelID)
{
	var btndiv = document.getElementById(divID);
	if (btndiv)
	{
		btndiv.src = $gcloseBtn.src;
	}
} //mouseUpPanelCloseBtn()

function mouseOutPanelCloseBtn(divID)
{
	var btndiv = document.getElementById(divID);
	if (btndiv)
	{
		btndiv.src = $gcloseBtn.src;
	}
} //mouseOutPanelCloseBtn()

CsbPanel.prototype.Refresh = function()
{
	if (this.panelOuterDiv)
	{
		this.panelOuterDiv.style.width = "0px";
		this.panelOuterDiv.style.height = "0px";
		this.panelOuterDiv.style.width = documentWidth() + "px";
		this.panelOuterDiv.style.height = documentHeight() + "px";
	}
	
	if (this.panelWidth == null)
		this.panelDiv.style.width = null;
	else
		this.panelDiv.style.width = this.panelWidth + "px";
	
	if (this.panelHeight == null)
		this.panelDiv.style.height = null;
	else
		this.panelDiv.style.height = this.panelHeight + "px";

	if (this.panelLeft == null)
		this.panelDiv.style.left = null;
	else
		this.panelDiv.style.left = this.panelLeft + "px";
	
	if (this.panelTop == null)
		this.panelDiv.style.top = null;
	else
		this.panelDiv.style.top = this.panelTop + "px";
	
	if (this.panelRight == null)
		this.panelDiv.style.right = null;
	else
		this.panelDiv.style.right = this.panelRight + "px";
	
	if (this.panelBottom == null)
		this.panelDiv.style.bottom = null;
	else
		this.panelDiv.style.bottom = this.panelBottom + "px";
	
	var classStr = "";
	if (this.panelRoundedCornerTopLeft == true)
		classStr += "ui-corner-tl ";
	if (this.panelRoundedCornerTopRight == true)
		classStr += "ui-corner-tr ";
	if (this.panelRoundedCornerBottomLeft == true)
		classStr += "ui-corner-bl ";
	if (this.panelRoundedCornerBottomRight == true)
		classStr += "ui-corner-br ";
	this.panelDiv.setAttribute('class', classStr);
	
	this.panelDiv.style.borderStyle = this.panelBorderStyle; //"solid 2";
	this.panelDiv.style.borderWidth = this.panelBorderWidth + "px";
	this.panelDiv.style.borderColor = this.panelBorderColor;
	
	this.panelDiv.onHide = this.onHide;
	this.panelDiv.onDestroy = this.onDestroy;

	var titleDiv = document.getElementById(this.panelId + "_title");
	if (titleDiv)
	{
		titleDiv.innerHTML = this.titleText;
		titleDiv.style.backgroundColor = this.titleBarColor;
		this.AddCloseButton();
	}
	
	var contentDiv = document.getElementById(this.panelId + "_content");
	if (contentDiv)
	{
		contentDiv.innerHTML = this.contentHTML;
		var titleHeight = 12;
		var othersHeight = 26; //borders, etc.,
		contentDiv.style.height = (this.panelHeight-titleHeight-othersHeight) + "px";
	}
};

CsbPanel.prototype.GetDiv = function ()
{
	return this.panelDiv;
};

CsbPanel.prototype.GetContentDiv = function ()
{
	var contentDiv = document.getElementById(this.panelId + "_content");
	return contentDiv;
};

CsbPanel.prototype.SetSize = function (panelWidth, panelHeight)
{
	if (this.panelDiv)
	{
		this.panelWidth = panelWidth;
		this.panelHeight = panelHeight;
		this.panelDiv.style.width = this.panelWidth + "px";
		this.panelDiv.style.height = this.panelHeight + "px";
	}
};
