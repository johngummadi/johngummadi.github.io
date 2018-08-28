


function CreateTabs(containerDivID)
{
    // create TWO divs (tabsheader and tabscontent).
    var tabsheaderID = containerDivID + "_tabsheaderID";
    var tabsheaderDiv = null;    
    tabsheaderDiv = document.getElementById(tabsheaderID);
    if (!tabsheaderDiv)
    {
        tabsheaderDiv = document.createElement('div');
        tabsheaderDiv.setAttribute('id', tabsheaderID);
    }
    if (tabsheaderDiv != null)
    {
        tabsheaderDiv.style.position = "relative";
        tabsheaderDiv.style.float = "top";
        tabsheaderDiv.style.width = "100%";
        tabsheaderDiv.style.height = "20px";
        //tabsheaderDiv.style.backgroundColor = "#86b8f4";
    }
    
    var tabscontentID = containerDivID + "_tabscontentID";
    var tabscontentDiv = null;    
    tabscontentDiv = document.getElementById(tabscontentID);
    if (! tabscontentDiv)
    {
        tabscontentDiv = document.createElement('div');
        tabscontentDiv.setAttribute('id', tabscontentID);
    }
    if (tabscontentDiv != null)
    {
        tabscontentDiv.style.position = "relative";
        tabscontentDiv.style.float = "top";
        tabscontentDiv.style.width = "100%";
        tabscontentDiv.style.height = "80%"; //(document.body.clientHeight-140) + "px";
        tabscontentDiv.style.backgroundColor = "#eeeeee";
	tabscontentDiv.style.border = "solid 1";
    }
   
    var tabscontainerDiv = document.getElementById(containerDivID);
    if (tabscontainerDiv && tabsheaderDiv && tabscontentDiv)
    {
        tabscontainerDiv.appendChild(tabsheaderDiv);
        tabscontainerDiv.appendChild(tabscontentDiv);
    }
} //CreateTabs()
 
function AddTab(containerDivID, tabDivID, tabTitle, tabContent)
{
    var tabTitleID = tabDivID + "_Title";
    var tabcontentID = tabDivID + "_Content";
    
    if (document.getElementById(tabTitleID) != null)
        return false; //tab exists already.
    else if (document.getElementById(tabcontentID) != null)
        return false; //tab exists already.
    
    var containerDiv = document.getElementById(containerDivID);
    var tabsheaderDiv = document.getElementById(containerDivID + "_tabsheaderID");
    var tabscontentDiv = document.getElementById(containerDivID + "_tabscontentID");
    if (containerDiv && tabsheaderDiv && tabscontentDiv)
    {
        // Create tab content
        var tabContentDiv = document.createElement('div');
        tabContentDiv.setAttribute('id', tabcontentID);
        tabContentDiv.innerHTML = tabContent;
        //tabscontentDiv.appendChild(tabContentDiv);
        tabContentDiv.style.visibility = "hidden";
        containerDiv.appendChild(tabContentDiv);
        
        // Create tab title
        var tabTitleDiv = document.createElement('span');
        tabTitleDiv.setAttribute('id', tabTitleID);
        tabTitleDiv.style.borderWidth = "1";
        tabTitleDiv.style.borderStyle = "solid";
        tabTitleDiv.style.borderColor = "#aa0000";
	tabTitleDiv.style.fontSize = "large";
	tabTitleDiv.style.heigh = "50px";
	tabTitleDiv.style.padding = "1em";
        tabTitleDiv.innerHTML = tabTitle;
        tabTitleDiv.onMouseOver = tabTitleDiv.style.cursor = 'pointer';
        var tabsContanersDivTmp = new String(containerDivID + "_tabscontentID");
        var tabsHeaderDivIDTmp = containerDivID + "_tabsheaderID";
        tabTitleDiv.onclick = new Function("onTabClick(" + tabcontentID + ", " + tabsContanersDivTmp + "," + tabTitleID  + "," + tabsHeaderDivIDTmp + ")");
		//tabTitleDiv.onclick = new Function("onTabClick(" + tabcontentID + ", " + tabsContanersDivTmp + "," + tabTitleDiv  + "," + tabsheaderDiv + ")");
		//tabTitleDiv.onclick = "javascript:onTabClick(" + tabcontentID + ", " + tabsContanersDivTmp + "," + tabTitleDiv  + "," + tabsheaderDiv + ")";
        /*
        tabTitleDiv.onclick = function(tabContentDiv, tabscontentDiv) { 
            var sibling = tabscontentDiv.firstChild;
            while (sibling)
            {
                //alert("clicked" + sibling.innerHTML);
                sibling.style.visibility = "hidden";
                sibling = sibling.nextSibling;
            }
            tabContentDiv.style.visibility = "visible";
            tabscontentDiv.innerHTML = tabContentDiv.innerHTML;
        };
        */
        tabsheaderDiv.appendChild(tabTitleDiv);
        tabscontentDiv.innerHTML = tabContentDiv.innerHTML;
		tabTitleDiv.style.position = "relative";
		tabTitleDiv.style.height = "90px";
    }
} //AddTab()
 
function onTabClick(tabContentDivID, tabsContentDivID, tabTitleDivID, tabsHeaderDivID)
{
	var tabContentDiv = null;
	var tabsContentDiv = null;
	var tabTitleDiv = null;
	var tabsHeaderDiv = null;
	
	if (tabContentDivID)
		tabContentDiv = document.getElementById(tabContentDivID);
	
	if (tabsContentDivID)
		tabsContentDiv = document.getElementById(tabsContentDivID);
		
	if (tabTitleDivID)
		tabTitleDiv = document.getElementById(tabTitleDivID);
		
	if (tabsHeaderDivID)
		tabsHeaderDiv = document.getElementById(tabsHeaderDivID);
	
	
    if (tabContentDiv && tabsContentDiv)
    {
        tabsContentDiv.innerHTML = tabContentDiv.innerHTML;
        
        // Clear all tab headers selection
        var sibling = tabsHeaderDiv.firstChild;
        while (sibling)
        {
            sibling.style.backgroundColor = "#86b8f4";
	    sibling.style.border = "1px solid";
            sibling = sibling.nextSibling;
        }
        tabTitleDiv.style.backgroundColor = "#eeeeee";
		tabTitleDiv.style.borderTop = "1px solid";
		tabTitleDiv.style.borderBottom = "0";
    }
    else
    {
        if (tabContentDiv == null)
            alert("tabContentDiv is null, id = " + tabContentDivID);
        if (tabsContentDiv == null)
            alert("tabsContentDiv is null,  id = " + tabsContentDivID);
        //alert("Umm... not yet!\n" + tabContentDiv==null?"tabContentDiv is null\n" + tabsContentDiv==null?"tabsContentDiv is null\n");
    }    
}


function selectTab(containerDivID, tabDivID)
{
    var tabTitleID = tabDivID + "_Title";
    var tabcontentID = tabDivID + "_Content";
	var tabsContanersDivTmp = containerDivID + "_tabscontentID";
	var tabsHeaderDivIDTmp = containerDivID + "_tabsheaderID";
	
	onTabClick(tabcontentID, tabsContanersDivTmp, tabTitleID, tabsHeaderDivIDTmp);
} //selectTab()