
// FIND TABLES
function findTableContent(){
	var foundTables = document.getElementsByTagName("TABLE");
	var interactiveType;
	for (var i=0, iMAX=foundTables.length; i<iMAX; i++){
		// CHECK TO SEE IF EACH TABLE HAS A CLASSNAME THAT RELATES TO A SPECIFIC BUILDER FUNCTION, IF YES, CALL THAT SPECIFIC BUILDER FUNCTION ON THAT TABLE
		if(foundTables[i].className && (foundTables[i].className=="button_button" || foundTables[i].className=="button_tab" || foundTables[i].className=="inlineHyperlink" || foundTables[i].className=="tooltip" || foundTables[i].className=="multipleChoice" )){
			interactiveType = foundTables[i].className.split("_")[0];
			builder[interactiveType](foundTables[i]);
		}
	}
	whichListener[whichListenerLoader]();
}

// REACT TO CLICK EVENTS ON INTERACTIVE ELEMENTS
function clickedStuff(evnt){
	// IF NO EVENT WAS PASSED DURING THE CLICK, USE AN EVENT THAT HAD BUBBLED TO THE WINDOW AS THE EVENT
	if (!evnt){ var evnt = window.event;}
	// FIND THE TARGET OF THE EVENT (.TARGET FOR FF ETC AND .SRCELEMENT FOR IE)
	if (evnt.target){var clickedThis = evnt.target;}
	else if (evnt.srcElement){var clickedThis = evnt.srcElement;}
	// IN THE CASE WHERE A TEXT NODE WAS CLICKED, CHANGE THE EVENT TARGET TO THE PARENT OF THAT TEXT NODE
	if (clickedThis.nodeType == 3){clickedThis = clickedThis.parentNode;} // http://www.quirksmode.org/js/events_properties.html safari hack;
	// FOR KEYBOARD INTERACTION, DETERMINE WHICH KEY WAS PRESSED WHILE AN ELEMENT HAD FOCUS (.WHICH, .BUTTON, AND .KEYCODE ARE CHECKED, IN ORDER, TO FIND THE RIGHT KEY IN ALL MAJOR BROWSERS)
	if(evnt.which){var keynum = evnt.which;}
	else if(evnt.button){var keynum = evnt.button;}
	else if(evnt.keyCode) {var keynum = evnt.keyCode;}
	// DETERMINE IF A LEFT CLICK OCCURRED (KEYNUM 0 OR 1, BROWSER DEPENDENT) OR IF THE SPACE BAR (13) OR ENTER KEY (32) WERE PRESSED
	if(keynum && (keynum == 0 || keynum == 1 || keynum == 13 || keynum == 32) && clickedThis.className){
		// HARVEST THE FIRST PART OF THE CLICKED ELEMENT'S CLASSNAME
		var interactiveType = clickedThis.className.split("_")[0];
		// DETERMINE IF THE FIRST PART OF THE CLICKED ELEMENT'S CLASSNAME MATCHES AN EXPECTED CLASSNAME
		if(interactiveType == "button" || interactiveType == "inlineHyperlink" || interactiveType == "tooltip" || interactiveType == "multipleChoice"){
			// CALL THE APPROPRIATE SUB-FUNCTION OF THE DOSTUFF VARIABLE BASED ON THE INTERACTIVE TYPE (HARVESTED FROM THE ELEMENT'S CLASSNAME)
			doStuff[interactiveType](clickedThis);
		}
	}
}

// REACT TO HOVER ACTION
function hoveredStuff(evnt){
	if (!evnt) var evnt = window.event;
	if (evnt.target){var hoveredThis = evnt.target;}
	else if (evnt.srcElement){var hoveredThis = evnt.srcElement;}
	if (hoveredThis.nodeType == 3){hoveredThis = hoveredThis.parentNode;} // http://www.quirksmode.org/js/events_properties.html safari hack;
	var hoverNum = prevSiblingCounter(hoveredThis);
	hoverNum++;
	document.getElementById("tooltip_target").innerHTML = hoveredThis.parentNode.nextSibling.getElementsByTagName("TR")[hoverNum].getElementsByTagName("TD")[2].innerHTML;
	document.getElementById("tooltip_target").style.display="block";
}
function followMouse(evnt){
	if (!evnt) var evnt = window.event;
	if (evnt.target){var hoveredThis = evnt.target;}
	else if (evnt.srcElement){var hoveredThis = evnt.srcElement;}
	if (hoveredThis.nodeType == 3){hoveredThis = hoveredThis.parentNode;} // http://www.quirksmode.org/js/events_properties.html safari hack;
	// determine window scroll position; cross-browser support from: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
	var supportPageOffset = window.pageXOffset !== undefined;
	var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
	var offX = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
	var offY = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	// update the position of the hover box
	document.getElementById("tooltip_target").style.top=evnt.clientY+offY+5 + "px";
	document.getElementById("tooltip_target").style.left=evnt.clientX+offX+5 + "px";	
}
function closeTip(){
	document.getElementById("tooltip_target").style.display="none";
}

// THE PREVSIBLINGCOUNTER FUNCTION RECEIVES A BUTTON ELEMENT AND DETERMINES THAT BUTTON ELEMENT'S NUMERIC POSITION IN ITS PARENT
// THIS INFORMATION IS USED TO THEN PULL THE APPROPRIATE INFORMATION OUT OF THE TABLE THAT WAS USED TO BUILD THE BUTTON AND RESPONSE TEXT ELEMENTS
function prevSiblingCounter(whichThat){
	var thisType = whichThat.tagName;
	var thisParent = whichThat.parentNode;
    var theseKids = thisParent.getElementsByTagName(thisType);
    for(var i=0, iMAX=theseKids.length; i<iMAX; i++){
       if(theseKids[i] == whichThat){
           return i;
       }
    }
}

// THIS GETOFFSET FUNCTION DETERMINES THE X AND Y COORDINATES OF ANY ELEMENT ON A PAGE, INSIDE OF AN IFRAME
// THIS INFORMATION IS USED WHEN A USER USES THE KEYBOARD TO ACCESS A TOOLTIP
function getOffset(docElem) {
	// http://javascript.info/tutorial/coordinates
	var box = docElem.getBoundingClientRect();
	var body = document.body;
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
	var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
	var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return { top: Math.round(top), left: Math.round(left) };
}



// THE DOSTUFF VARIABLE CONTAINS WITHIN IT A SET OF FUNCTIONS THAT ADD INTERACTIVITY TO THE PAGE
var doStuff = {
	// THE BUTTON FUNCTION WILL UPDATE THE TEXT SEEN IN A TEXTTARGET DIV WHEN A BUTTON OR TAB IS CLICKED
	button: function(thisButton){
		// DETERMINE APPROPRIATE TABLE DATA BASED ON BUTTON POSITION
		var buttonNum = prevSiblingCounter(thisButton);
		buttonNum++;
		// FIND APPROPRIATE TEXT TARGET
		var textTargetDiv = thisButton.parentNode.parentNode.lastChild;
		var sourceTD = thisButton.parentNode.parentNode.nextSibling.getElementsByTagName("TR")[buttonNum].getElementsByTagName("TD")[1];
		textTargetDiv.innerHTML = sourceTD.innerHTML;
		// SET THE CLASSES OF ALL BUTTONS IN THE GROUP TO notChosen
		var changeClassButtons = thisButton.parentNode.children;
		for (var bi=0, biMAX=changeClassButtons.length; bi<biMAX; bi++){
			changeClassButtons[bi].className = changeClassButtons[bi].className.replace("chosen","notChosen");
			changeClassButtons[bi].setAttribute("aria-selected","false");
		}
		// SET THE CLICKED BUTTON'S CLASS TO CHOSEN
		thisButton.className = thisButton.className.replace("notChosen","chosen");
		thisButton.setAttribute("aria-selected","true");
		textTargetDiv.focus();
	},
	inlineHyperlink: function(thisSpan){
		// DETERMINE WHETHER THISSPAN IS CHOSEN
		if(thisSpan.className.split("_")[1] == "notChosen"){
			thisSpan.nextSibling.className = "hiddenSpan";
			thisSpan.nextSibling.focus();
			thisSpan.className = "inlineHyperlink_chosen";
		}
		else {
			thisSpan.nextSibling.className = "hiddenSpan hidden";
			thisSpan.className = "inlineHyperlink_notChosen";
		}
	},
	tooltip: function(thisSpan){
		if(thisSpan.className=="tooltip_notHovered"){
			var hoverNum = prevSiblingCounter(thisSpan);
			hoverNum++;
			document.getElementById("tooltip_target").innerHTML = thisSpan.parentNode.nextSibling.getElementsByTagName("TR")[hoverNum].getElementsByTagName("TD")[2].innerHTML;
			document.getElementById("tooltip_target").style.left=getOffset(thisSpan).left + "px";
			document.getElementById("tooltip_target").style.top=getOffset(thisSpan).top + "px";
			document.getElementById("tooltip_target").style.display="block";
			document.getElementById("tooltip_target").focus();
			thisSpan.className = "tooltip_hovered";
		}
		else{
			closeTip();
			thisSpan.className = "tooltip_notHovered";
		}
	}
};



var tooltipTargetExists = 0;
// THE BUILDER VARIABLE CONTAINS WITHIN IT A SET OF FUNCTIONS THAT PULL INFORMATION FROM TABLES IN ORDER TO GENERATE INTERACTIVE CONTENT
var builder = {
	button: function(thisTable){
		// FIRST THING FIRST... HIDE THE DATA TABLES FROM THE USER SO THEY AREN'T SEEN NEXT TO THE INTERACTIVE COMPONENTS ON THE PAGE
		thisTable.style.display="none";
		// PULL THE SECONDARY TYPE VALUE FROM THE THISTABLE'S CLASSNAME IN ORDER TO DIFFERENTIATE BETWEEN THE REGULAR BUTTON LAYOUT AND THE TABBED BUTTON LAYOUT
		var secondType = thisTable.className.split("_")[1];
		// BEGIN BUILDING THE INTERACTIVE ELEMENTS
		var button_wrapper = document.createElement("DIV");
		button_wrapper.className = "button_wrapper_" + secondType;
		button_wrapper.setAttribute("role", "tablist");
		var target_text_wrapper = document.createElement("DIV");
		// ALLOW THE TARGET_TEXT_WRAPPER TO RECEIVE FOCUS FROM KEYBOARD
		target_text_wrapper.tabIndex = 0;
		target_text_wrapper.className = "target_text_wrapper_" + secondType;
		target_text_wrapper.setAttribute("role", "tabpanel");
		// INITIALIZE SOME VARIABLES THAT WILL STORE INFORMATION FOUND IN THE THISTABLE
		var checkVal, tableRows, buttonName, targetText, rowElements, thisButton, thisTargetText;
		checkVal = 0;
		// PULL ANY CONTENT FROM THISTABLE
		// GET ALL OF THE ROWS FOUND IN THE TABLE
		tableRows = thisTable.getElementsByTagName("TR");
		// LOOP THROUGH THE TABLE ROWS, STARTING WITH THE SECOND ROW (BECAUSE THE FIRST ROW, ROW[0], IS THE HEADER ROW AND CONTAINS NO DATA)
		for(var i=1, iMAX=tableRows.length; i<iMAX; i++){
			// IN EVERY ROW LOOP, COLLECT ALL OF THE TD ELEMENTS
			rowElements = tableRows[i].getElementsByTagName("TD");
			// FROM THE FIRST TD ELEMENT IN EACH ROW, PULL THE BUTTON NAME
			buttonName = rowElements[0].innerHTML;
			// FROM THE SECOND TD ELEMENT IN EACH ROW, PULL THE TEXT TO BE USED IN THE TEXT TARGET
			targetText = rowElements[1].innerHTML;
			// DETERMINE WHETHER THERE IS SOME CONTENT IN THE TABLE, IF YES, GO AHEAD AND BUILD A RELATED INTERACTIVE ELEMENT
			// HERE, IT IS ASSUMED THAT THE BUTTON NAME AND TARGETTEXT VALUES WILL ONLY BE EQUAL IF THEY ARE BOTH BLANK. UNLIKELY EDGE CASES WILL CAUSE PROBLEMS AKA BUTTON NAME = TEXT TO SHOW.
			if(buttonName != targetText){
				// CREATE A P ELEMENT THAT WILL FUNCTION AS A BUTTON
				thisButton = document.createElement("P");
				thisButton.tabIndex = 0;
				thisButton.setAttribute("role", "tab");
				// DETERMINE WHETHER WE ARE IN THE FIRST DATA ROW IN OUR LOOP, IF YES, THEN CHOOSE THIS ROW'S TARGET TEXT AS THE DEFAULT TEXT SHOWN IN THE TARGETTEXT DIV
				if(checkVal == 0){
					// PLACE TARGETTEXT INTO THE TARGET TEXT ELEMENT
					target_text_wrapper.innerHTML = targetText;
					// FURTHER, MAKE SURE THAT THE BUTTON ASSOCIATED WITH THIS FIRST ROW'S DATA IS SET TO THE CHOSEN CLASS.
					thisButton.className = "button_" + secondType + "_chosen";
					thisButton.setAttribute("aria-selected","true");
				}
				else {
					// FOR ALL OTHER ROWS OF DATA, SET THE BUTTON TO THE NOTCHOSEN CLASS
					thisButton.className = "button_" + secondType + "_notChosen";
					thisButton.setAttribute("aria-selected","false");
				}
				// APPEND THE BUTTON NAME TO THE NEWLY CREATED P ELEMENT
				thisButton.innerHTML = buttonName;
				// APPEND THE BUTTON TO THE BUTTON WRAPPER
				button_wrapper.appendChild(thisButton);
				// UPDATE THE VALUE USED TO CONDITIONALLY DETERMINE WHETHER WE'RE IN THE FIRST LOOP
				checkVal = 1;
			}
			else{
				// WHEN AN ENTIRE ROW IS BLANK, GO AHEAD AND BUILD A P ELEMENT AND APPEND IT TO THE BUTTON WRAPPER SO AS TO MAINTAIN A RELATIONSHIP BETWEEN BUTTON POSITION AND TABLE ROW DATA
				thisButton = document.createElement("P");
				thisButton.className = "button_" + secondType + "_chosen";
				thisButton.style.display = "none";
				button_wrapper.appendChild(thisButton);
			}
			// CLEAR THE BUTTON NAME AND TARGET TEXT VALUES BEFORE THE NEXT LOOP
			buttonName = targetText = "";
			rowElements.length = 0;
		}
		// AT THE END OF THE LOOP THROUGH THE THISTABLE'S ROWS, INSERT THE BUTTON WRAPPER AND TEXT TARGET INTO THE BUTTON AND TARGET WRAPPER, THEN PLACE THE BUTTON AND TARGET WRAPPER INTO THE PAGE JUST BEFORE THE POSITION OF THISTABLE SO THAT IT IS EASY FOR THE CLICK BASED INTERACTIVE DOSTUFF FUNCTION TO FIND THE APPROPRIATE TABLE DATA WITHOUT ANY NEED FOR ELEMENT IDS
		if(checkVal == 1){
			var button_and_text_wrapper = document.createElement("DIV");
			button_and_text_wrapper.className = "button_and_target_wrapper_" + secondType + " clearfix";
			button_and_text_wrapper.setAttribute("role", "application");
			button_and_text_wrapper.appendChild(button_wrapper);
			button_and_text_wrapper.appendChild(target_text_wrapper);
			thisTable.parentNode.insertBefore(button_and_text_wrapper, thisTable);
		}
		// CLEAR THE TABLE ROWS ARRAY
		tableRows.length = 0;
	},
	inlineHyperlink: function(thisTable){
		// FIRST THING FIRST... HIDE THE DATA TABLES FROM THE USER SO THEY AREN'T SEEN NEXT TO THE INTERACTIVE COMPONENTS ON THE PAGE
		thisTable.style.display="none";
		// CREATE A P ELEMENT THAT WILL HOLD REGULAR TEXT, THE CLICKABLE SPAN, AND THE HIDDEN TEXT/CONTENT
		var thisP = document.createElement("P");
		var checkVal, tableRows, rowElements;
		checkVal = 0;
		var preText = [0], activeText = [0], hiddenContent = [0], postText = [0], visibleSpan = [0], hiddenSpan = [0];
		// PULL ANY CONTENT FROM THISTABLE
		// GET ALL OF THE ROWS FOUND IN THE TABLE
		tableRows = thisTable.getElementsByTagName("TR");
		// LOOP THROUGH THE TABLE ROWS, STARTING WITH THE SECOND ROW (BECAUSE THE FIRST ROW, ROW[0], IS THE HEADER ROW AND CONTAINS NO DATA)
		for(var i=1, iMAX=tableRows.length; i<iMAX; i++){
			// IN EVERY ROW LOOP, COLLECT ALL OF THE TD ELEMENTS
			rowElements = tableRows[i].getElementsByTagName("TD");
			// FROM THE FIRST TD ELEMENT IN EACH ROW, PULL ANY TEXT TO BE USED IN THE PRETEXT
			preText[i] = rowElements[0].innerHTML;
			// FROM THE SECOND TD ELEMENT IN EACH ROW, PULL THE TEXT TO BE USED IN THE ACTIVE SPAN
			activeText[i] = rowElements[1].innerHTML;
			// FROM THE THIRD TD ELEMENT IN EACH ROW, PULL THE TEXT TO BE USED IN THE HIDDEN SPAN
			hiddenContent[i] = rowElements[2].innerHTML;
			// FROM THE FOURTH TD ELEMENT IN EACH ROW, PULL ANY TEXT TO BE USED IN THE POSTTEXT
			postText[i] = rowElements[3].innerHTML;
			// DETERMINE WHETHER THERE IS SOME CONTENT IN THE TABLE, IF YES, GO AHEAD AND BUILD A RELATED INTERACTIVE ELEMENT
			// HERE, IT IS ASSUMED THAT THE BUTTON NAME AND TARGETTEXT VALUES WILL ONLY BE EQUAL IF THEY ARE BOTH BLANK. UNLIKELY EDGE CASES WILL CAUSE PROBLEMS AKA BUTTON NAME = TEXT TO SHOW.
			if(preText[i] != "" || activeText[i] != "" || hiddenContent[i] != "" || postText[i] != ""){
				// CREATE A SPAN ELEMENT THAT WILL BE CLICKABLE
				visibleSpan[i] = document.createElement("SPAN");
				visibleSpan[i].tabIndex = 0;
				visibleSpan[i].className = "inlineHyperlink_notChosen";
				// CREATE A SPAN ELEMENT THAT WILL CONTAIN THE HIDDEN TEXT/CONTENT
				hiddenSpan[i] = document.createElement("SPAN");
				hiddenSpan[i].tabIndex = 0;
				hiddenSpan[i].className = "hiddenSpan hidden";
				visibleSpan[i].innerHTML = " " + activeText[i] + " ";
				hiddenSpan[i].innerHTML = " " + hiddenContent[i] + " ";
				thisP.innerHTML += preText[i]; thisP.appendChild(visibleSpan[i]); thisP.appendChild(hiddenSpan[i]); thisP.innerHTML += postText[i];
				checkVal = 1;
			}
		}
		// AT THE END OF THE LOOP THROUGH THE THISTABLE'S ROWS, INSERT THE BUTTON WRAPPER AND TEXT TARGET INTO THE BUTTON AND TARGET WRAPPER, THEN PLACE THE BUTTON AND TARGET WRAPPER INTO THE PAGE JUST BEFORE THE POSITION OF THISTABLE SO THAT IT IS EASY FOR THE CLICK BASED INTERACTIVE DOSTUFF FUNCTION TO FIND THE APPROPRIATE TABLE DATA WITHOUT ANY NEED FOR ELEMENT IDS
		if(checkVal == 1){
			thisTable.parentNode.insertBefore(thisP, thisTable);
		}
		// CLEAR THE TABLE ROWS ARRAY
		tableRows.length = 0;
	},
	tooltip: function(thisTable){
		// FIRST THING FIRST... HIDE THE DATA TABLES FROM THE USER SO THEY AREN'T SEEN NEXT TO THE INTERACTIVE COMPONENTS ON THE PAGE
		thisTable.style.display="none";
		// CREATE A P ELEMENT THAT WILL HOLD REGULAR TEXT, THE CLICKABLE SPAN, AND THE HIDDEN TEXT/CONTENT
		var thisP = document.createElement("P");
		var checkVal, tableRows, rowElements;
		checkVal = 0;
		var preText = [0], activeText = [0], postText = [0], visibleSpan = [0];
		// PULL ANY CONTENT FROM THISTABLE
		// GET ALL OF THE ROWS FOUND IN THE TABLE
		tableRows = thisTable.getElementsByTagName("TR");
		// LOOP THROUGH THE TABLE ROWS, STARTING WITH THE SECOND ROW (BECAUSE THE FIRST ROW, ROW[0], IS THE HEADER ROW AND CONTAINS NO DATA)
		for(var i=1, iMAX=tableRows.length; i<iMAX; i++){
			// IN EVERY ROW LOOP, COLLECT ALL OF THE TD ELEMENTS
			rowElements = tableRows[i].getElementsByTagName("TD");
			// FROM THE FIRST TD ELEMENT IN EACH ROW, PULL ANY TEXT TO BE USED IN THE PRETEXT
			preText[i] = rowElements[0].innerHTML;
			// FROM THE SECOND TD ELEMENT IN EACH ROW, PULL THE TEXT TO BE USED IN THE ACTIVE SPAN
			activeText[i] = rowElements[1].innerHTML;
			// FROM THE FOURTH TD ELEMENT IN EACH ROW, PULL ANY TEXT TO BE USED IN THE POSTTEXT
			postText[i] = rowElements[3].innerHTML;
			// DETERMINE WHETHER THERE IS SOME CONTENT IN THE TABLE, IF YES, GO AHEAD AND BUILD A RELATED INTERACTIVE ELEMENT
			// HERE, IT IS ASSUMED THAT THE BUTTON NAME AND TARGETTEXT VALUES WILL ONLY BE EQUAL IF THEY ARE BOTH BLANK. UNLIKELY EDGE CASES WILL CAUSE PROBLEMS AKA BUTTON NAME = TEXT TO SHOW.
			if(preText[i] != "" || activeText[i] != "" || postText[i] != ""){
				// CREATE A SPAN ELEMENT THAT WILL BE CLICKABLE
				visibleSpan[i] = document.createElement("SPAN");
				visibleSpan[i].tabIndex = 0;
				visibleSpan[i].className = "tooltip_notHovered";
				visibleSpan[i].innerHTML = " " + activeText[i] + " ";
				thisP.innerHTML += preText[i]; thisP.appendChild(visibleSpan[i]); thisP.innerHTML += postText[i];
				checkVal = 1; tooltipTargetExists++;
			}
		}
		// AT THE END OF THE LOOP THROUGH THE THISTABLE'S ROWS, INSERT THE BUTTON WRAPPER AND TEXT TARGET INTO THE BUTTON AND TARGET WRAPPER, THEN PLACE THE BUTTON AND TARGET WRAPPER INTO THE PAGE JUST BEFORE THE POSITION OF THISTABLE SO THAT IT IS EASY FOR THE CLICK BASED INTERACTIVE DOSTUFF FUNCTION TO FIND THE APPROPRIATE TABLE DATA WITHOUT ANY NEED FOR ELEMENT IDS
		if(checkVal == 1){
			thisTable.parentNode.insertBefore(thisP, thisTable);
		}
		// CLEAR THE TABLE ROWS ARRAY
		tableRows.length = 0;
		
		
		if(tooltipTargetExists == 1){
			// BUILD THE FLOATING TOOLTIP TARGET DIV
			var toolTipTargetDiv = document.createElement("DIV");
			toolTipTargetDiv.id = "tooltip_target";
			toolTipTargetDiv.style.display = "none";
			toolTipTargetDiv.style.left = "-200px";
			toolTipTargetDiv.style.top = "-200px";
			toolTipTargetDiv.tabIndex = 0;
			document.body.appendChild(toolTipTargetDiv);
		}
		
	},
	multipleChoice: function(thisTable){},
};

// TOOLTIP BUILDER

// MULTIPLE-CHOICE BUILDER


// LISTENER LOADERS
var whichListenerLoader = "newListener";

var whichListener = {
	newListener: function(nothing) {
		var allPs = document.getElementsByTagName("P");
		for(var i=0; i<allPs.length; i++){
			if(allPs[i].className && (allPs[i].className.indexOf("chosen")>=0 || allPs[i].className.indexOf("notChosen")>=0)){
				allPs[i].addEventListener ('mouseup', clickedStuff, false);
				allPs[i].addEventListener ('keyup', clickedStuff, false);
			}
		}
		var allSpans = document.getElementsByTagName("SPAN");
		for(var i=0; i<allSpans.length; i++){
			if(allSpans[i].className && (allSpans[i].className.indexOf("chosen")>=0 || allSpans[i].className.indexOf("notChosen")>=0)){
				allSpans[i].addEventListener ('mouseup', clickedStuff, false);
				allSpans[i].addEventListener ('keyup', clickedStuff, false);
			}
			else if(allSpans[i].className && (allSpans[i].className.indexOf("hovered")>=0 || allSpans[i].className.indexOf("notHovered")>=0)){
				allSpans[i].addEventListener ('mouseover', hoveredStuff, false);
				allSpans[i].addEventListener ('mousemove', followMouse, false);
				allSpans[i].addEventListener ('mouseout', closeTip, false);
				allSpans[i].addEventListener ('mouseup', clickedStuff, false);
				allSpans[i].addEventListener ('keyup', clickedStuff, false);
			}
		}
	},
	oldListener: function(nothing) {
		var allPs = document.getElementsByTagName("P");
		for(var i=0; i<allPs.length; i++){
			if(allPs[i].className  && (allPs[i].className.indexOf("chosen")>=0 || allPs[i].className.indexOf("notChosen")>=0)){
				allPs[i].attachEvent ('onmouseup', clickedStuff);
				allPs[i].attachEvent ('onkeyup', clickedStuff);
			}
		}
		var allSpans = document.getElementsByTagName("SPAN");
		for(var i=0; i<allSpans.length; i++){
			if(allSpans[i].className  && (allSpans[i].className.indexOf("chosen")>=0 || allSpans[i].className.indexOf("notChosen")>=0)){
				allSpans[i].attachEvent ('onmouseup', clickedStuff);
				allSpans[i].attachEvent ('onkeyup', clickedStuff);
			}
			else if(allSpans[i].className && (allSpans[i].className.indexOf("hovered")>=0 || allSpans[i].className.indexOf("notHovered")>=0)){
				allSpans[i].attachEvent ('onmouseover', hoveredStuff, false);
				allSpans[i].attachEvent ('onmousemove', followMouse, false);
				allSpans[i].attachEvent ('onmouseout', closeTip, false);
				allSpans[i].attachEvent ('onmouseup', clickedStuff);
				allSpans[i].attachEvent ('onkeyup', clickedStuff);
			}
		}
	}
};

// DETERMINE WHICH EVENT LISTENERS TO USE && LOAD CONTENT FROM DATA TABLES
if(document.addEventListener){
	document.addEventListener('DOMContentLoaded', function () {
		whichListenerLoader = "newListener";
		// whichListener[whichListenerLoader](); // not to be run here because interactive content not yet built onload
		findTableContent();
	});
}
else if(document.attachEvent){
	document.attachEvent('onreadystatechange', function(){
		if ( document.readyState === 'complete' ) {
			whichListenerLoader = "oldListener";
			// whichListener[whichListenerLoader](); // not to be run here because interactive content not yet built onload
			findTableContent();
		}
	});
}
else if (window.addEventListener){
	window.addEventListener('load', function () {
		whichListenerLoader = "newListener";
		// whichListener[whichListenerLoader](); // not to be run here because interactive content not yet built onload
		findTableContent();
	});
}
else if (window.attachEvent){
	window.attachEvent('onload', function () {
		whichListenerLoader = "oldListener";
		// whichListener[whichListenerLoader](); // not to be run here because interactive content not yet built onload
		findTableContent();
	});
}
else {
	var fn = window.onload;
	window.onload = function() {
		fn && fn();
		alert('This site will not function correctly using your current browser, please try the newest browser available to you.');
	}
}

// THIS SCRIPT WILL MAKE INVISIBLE THE VERTICAL LINE THAT SHOWS UP AT THE END OF EACH BIT OF MATHJAX AS OF 03/28/2016
var globalTimeout;
globalTimeout = setTimeout(checkJax,1000);
function checkJax(){
	if(document.getElementById("MathJax_Message")){
		MathJax.Hub.Startup.signal.Interest(
			function (message) {
				if (message == "End"){
					var theseNOBR = document.getElementsByTagName("NOBR");
					for(var i=0, iMAX = theseNOBR.length; i<iMAX; i++){
					    theseNOBR[i].childNodes[0].lastChild.style.borderLeftColor="transparent";
					}
					clearTimeout(globalTimeout);
				}
			}
		);
	}
	else{
		globalTimeout = setTimeout(checkJax,1000);
	}
}