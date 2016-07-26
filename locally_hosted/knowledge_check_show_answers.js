var changeDisplay = {"visibility":{"none":"block","block":"none"},"text":{"none":"Hide answer","block":"Show answer"}};
function showHide(evnt){
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
	if(keynum && (keynum == 0 || keynum == 1 || keynum == 13 || keynum == 32)){
		var showHideThis = clickedThis.previousSibling;
		while(!showHideThis.className || showHideThis.className != "answerWrapper"){showHideThis = showHideThis.previousSibling;}
		clickedThis.innerHTML = changeDisplay["text"][showHideThis.style.display];
		showHideThis.style.display = changeDisplay["visibility"][showHideThis.style.display];
	}
}

var answerButton = document.createElement("BUTTON");
answerButton.className = "answerButton"; answerButton.style.margin="10px;"
answerButton.innerHTML = "Show answer";
var tempAnswerButton = "";
function hideAll(){
	var thesePs = document.getElementsByTagName("P");
	for(var i=0, imax=thesePs.length; i<imax; i++){
		if(thesePs[i].className && thesePs[i].className == "answerWrapper"){
			thesePs[i].style.display="none";
			tempAnswerButton = answerButton.cloneNode(true);
			thesePs[i].parentNode.insertBefore(tempAnswerButton,thesePs[i].nextSibling);
		}
	}
	whichListener[whichListenerLoader]();
}

// LISTENER LOADERS
var whichListenerLoader = "newListener";

var whichListener = {
	newListener: function(nothing) {
		var allBUTTONs = document.getElementsByTagName("BUTTON");
		for(var i=0; i<allBUTTONs.length; i++){
			if(allBUTTONs[i].className && allBUTTONs[i].className == "answerButton"){
				allBUTTONs[i].addEventListener ('mouseup', showHide, false);
				allBUTTONs[i].addEventListener ('keyup', showHide, false);
			}
		}
	},
	oldListener: function(nothing) {
		var allBUTTONs = document.getElementsByTagName("BUTTON");
		for(var i=0; i<allBUTTONs.length; i++){
			if(allBUTTONs[i].className && allBUTTONs[i].className == "answerButton"){
				allBUTTONs[i].attachEvent ('onmouseup', showHide);
				allBUTTONs[i].attachEvent ('onkeyup', showHide);
			}
		}
	}
};

// DETERMINE WHICH EVENT LISTENERS TO USE && LOAD CONTENT FROM DATA TABLES
if(document.addEventListener){
	document.addEventListener('DOMContentLoaded', function () {
		whichListenerLoader = "newListener";
		// whichListener[whichListenerLoader](); // not to be run here because interactive content not yet built onload
		hideAll();
	});
}
else if(document.attachEvent){
	document.attachEvent('onreadystatechange', function(){
		if ( document.readyState === 'complete' ) {
			whichListenerLoader = "oldListener";
			// whichListener[whichListenerLoader](); // not to be run here because interactive content not yet built onload
			hideAll();
		}
	});
}
else if (window.addEventListener){
	window.addEventListener('load', function () {
		whichListenerLoader = "newListener";
		// whichListener[whichListenerLoader](); // not to be run here because interactive content not yet built onload
		hideAll();
	});
}
else if (window.attachEvent){
	window.attachEvent('onload', function () {
		whichListenerLoader = "oldListener";
		// whichListener[whichListenerLoader](); // not to be run here because interactive content not yet built onload
		hideAll();
	});
}
else {
	var fn = window.onload;
	window.onload = function() {
		fn && fn();
		alert('This site will not function correctly using your current browser, please try the newest browser available to you.');
		hideAll();
	}
}