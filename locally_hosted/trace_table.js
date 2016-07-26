var thisData = {};
var correctAnswers = {};
var thisRand = Math.round(Math.random()*10,000);
function hashCode(val){
	val = val.concat(thisRand);
	var hash = 0, i, chr, len;
	if (val.length === 0) return hash;
	for (i = 0, len = val.length; i < len; i++) {
		chr   = val.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return Math.abs(hash);
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
	if(keynum && (keynum == 0 || keynum == 1 || keynum == 13 || keynum == 32)){
		// HARVEST THE SECOND PART OF THE CLICKED ELEMENT'S CLASSNAME
		if(clickedThis.tagName != "BUTTON"){
			clickedThis = clickedThis.parentNode;
			while(clickedThis.tagName != "BUTTON"){
				clickedThis = clickedThis.nextSibling;
			}
		}
		var interactiveType = clickedThis.className.split("_")[1];
		// DETERMINE IF THE SECOND PART OF THE CLICKED ELEMENT'S CLASSNAME MATCHES AN EXPECTED CLASSNAME
		if(interactiveType == "immediately" || interactiveType == "reset" || interactiveType == "answers"){
			// CALL THE APPROPRIATE SUB-FUNCTION OF THE DOSTUFF VARIABLE BASED ON THE INTERACTIVE TYPE (HARVESTED FROM THE ELEMENT'S CLASSNAME)
			doStuff[interactiveType](clickedThis);
		}
	}
}

var defaultAnswerArray = ["Incorrect. ", "Correct! "];
doStuff = {
	immediately: function(thisButton){
		// combine all ids and answers to determine the hash value
		var inputString = "", thisValue = "";
		var theseInputs = thisButton.parentNode.getElementsByTagName("INPUT");
		for(var i=0, imax = theseInputs.length; i<imax; i++){
			thisValue = theseInputs[i].value || "";
			thisId = theseInputs[i].id;
			inputString += thisId + thisValue;
		}
		var answerSpot = thisButton.nextSibling;
		while(answerSpot.tagName != "P"){answerSpot = answerSpot.nextSibling;}
		if(thisData[hashCode(inputString.replace(/ /g,''))]){
			answerSpot.innerHTML = defaultAnswerArray[thisData[hashCode(inputString.replace(/ /g,''))][0]] + thisData[hashCode(inputString.replace(/ /g,''))][1];
			answerSpot.className = "feedbackP"+thisData[hashCode(inputString.replace(/ /g,''))][0];
			if(thisData[hashCode(inputString.replace(/ /g,''))][0] == 0){thisButton.innerHTML = "Resubmit"; thisButton.style.display = "block";}
			else{thisButton.style.display = "none";}
		}
		else{
			answerSpot.innerHTML = defaultAnswerArray[0];
			answerSpot.className = "feedbackP0";
			thisButton.innerHTML = "Resubmit";
			thisButton.style.display = "block";
		}
	},
	reset: function(thisButton){
		var clearThese = document.getElementsByTagName("INPUT");
		for(var i=0, imax=clearThese.length; i<imax; i++){
			clearThese[i].value="";
		}
		var allPs = document.getElementsByTagName("P");
		for(var j=0, jmax=allPs.length; j<jmax; j++){
			if(allPs[j].className=="feedbackP0" || allPs[j].className=="feedbackP1"){
				allPs[j].innerHTML = "";
				allPs[j].className="feedbackP";
			}
		}
		var allButtons = document.getElementsByTagName("BUTTON");
		for(var k=0, kmax=allButtons.length; k<kmax; k++){
			if(allButtons[k].innerHTML == "Resubmit" || allButtons[k].innerHTML == "Submit"){
				allButtons[k].innerHTML = "Submit";
				allButtons[k].style.display="block";
			}
		}
	},
	answers: function(thisButton){
		for (var key in correctAnswers) {
			if (correctAnswers.hasOwnProperty(key)) {
				document.getElementById(key).value = correctAnswers[key];
			}
		}
	}
};

function findTableContent(){
	// FIND THE ANSWER TABLE AND DETERMINE THE NUMBER OF COLUMNS AND ROWS TO MAKE FOR THE STUDENT INTERFACE
	var inputTable = document.getElementsByTagName("TABLE")[0];
	inputTable.style.display = "none";
	var tableRows = inputTable.getElementsByTagName("TR");
	var headerElements = tableRows[0].getElementsByTagName("TH");
	var rowElements = [];
	var varCount = 0; var lineNumTD = 0; var emptyCol = {};
	var tempHeaderElement = "";
	for(var i=0, imax = headerElements.length; i<imax; i++){
		tempHeaderElement = headerElements[i].textContent || headerElements[i].innerText || "";
		if(tempHeaderElement != ""){
			varCount++;
			if(tempHeaderElement == "line#"){
				lineNumTD = i;
			}
		}
		else{emptyCol[i]=2;}
	}
	varCount-=3;
	var cellWrapperDivWidth = Math.floor(50/varCount);
	var maxRows = 0;
	for(var i=0, imax=tableRows.length; i<imax; i++){
		maxRows = Math.max(maxRows,tableRows[i].getElementsByTagName("TD")[lineNumTD]);
	}
	// CREATE A SUBSET OF ELEMENTS THAT WILL BE REUSED DURING THE INTERFACE BUILDING PROCESS
	var interfaceWrapper = document.createElement("DIV");
	interfaceWrapper.className = "clearfix";
	var rowWrapperDiv = document.createElement("DIV");
	rowWrapperDiv.className = "rowWrapper clearfix";
	var tempRowWrapperDiv = "";
	var columnTitleP = document.createElement("P");
	columnTitleP.className = "columnTitle";
	var tempColumnTitleP = "";
	var cellWrapperDiv = document.createElement("DIV");
	cellWrapperDiv.className = "cellWrapper";
	cellWrapperDiv.style.width = cellWrapperDivWidth + "%";
	cellWrapperDiv.style.minHeight = "22px";
	var tempCellWrapperDiv = "";
	tempRowWrapperDiv = rowWrapperDiv.cloneNode(true);
	
	// CREATE THE COLUMN NAMES FOR THE STUDENT INTERFACE
	for(var i=0, imax=lineNumTD; i<imax; i++){
		tempHeaderElement = headerElements[i].textContent || headerElements[i].innerText || "";
		if(tempHeaderElement != ""){
			tempColumnTitleP = columnTitleP.cloneNode(true);
			tempColumnTitleP.innerHTML = tempHeaderElement;
			tempCellWrapperDiv = cellWrapperDiv.cloneNode(true);
			tempCellWrapperDiv.appendChild(tempColumnTitleP);
			tempRowWrapperDiv.appendChild(tempCellWrapperDiv);
		}
	}
	interfaceWrapper.appendChild(tempRowWrapperDiv);
	
	// CREATE THE REMAINING SUBSET OF ELEMENTS THAT WILL BE REUSED DURING THE INTERFACE BUILDING PROCESS
	var answerInput = document.createElement("INPUT");
	answerInput.type = "text";
	var tempAnswerInput = "";
	var answerButton = document.createElement("BUTTON");
	answerButton.className = "check_immediately";
	answerButton.innerHTML = "Submit";
	var tempAnswerButton = "";
	var feedbackP = document.createElement("P");
	feedbackP.className = "feedbackP";
	var tempFeedbackP = "";
	var tempLn = 0;
	var tempRw = 0;
	var tempFb = "";
	var tempID = "";
	
	// LOOP THROUGH THE ANSWER TABLE, BUILD THE INTERFACE & BUILD THE JSON ANSWER KEY
	var existingRows = {};
	var rowString = ""; emptyRowString = "";
	for(var i=1, imax=tableRows.length; i<imax; i++){
		rowElements = tableRows[i].getElementsByTagName("TD");
		tempLn = rowElements[lineNumTD].textContent || rowElements[lineNumTD].innerText;
		if(!existingRows[tempLn] || existingRows[tempLn] != tempLn){
			tempRowWrapperDiv = rowWrapperDiv.cloneNode(true);
			tempRw = rowElements[lineNumTD+1].textContent || rowElements[lineNumTD+1].innerText;
			tempFb = rowElements[lineNumTD+2].textContent || rowElements[lineNumTD+2].innerText || "";
			for(var j=0; j<lineNumTD; j++){
				if(!emptyCol[j] || emptyCol[j]!=2){
					// determine if the element has an answer in it, if yes, build a div and an input, if no, just build a div
					tempText = rowElements[j].textContent || rowElements[j].innerText || "";
					if(tempText != "" && tempRw == 1){
						tempAnswerInput = answerInput.cloneNode(true);
						tempAnswerInput.id = "q" + tempLn + "a" + j;
						tempID = tempAnswerInput.id;
						tempCellWrapperDiv = cellWrapperDiv.cloneNode(true);
						tempCellWrapperDiv.appendChild(tempAnswerInput);
						tempRowWrapperDiv.appendChild(tempCellWrapperDiv);
						rowString += tempID + tempText;
						emptyRowString += tempID;
						correctAnswers[tempID] = tempText;
					}
					else if(tempText != "" && tempRw == 0){
						tempAnswerInput.id = "q" + tempLn + "a" + j;
						tempID = tempAnswerInput.id;
						// thisData[hashCode(tempID.concat(tempText).replace(/ /g,''))] = [tempRw,tempFb];
						tempCellWrapperDiv = cellWrapperDiv.cloneNode(true);
						tempRowWrapperDiv.appendChild(tempCellWrapperDiv);
						rowString += tempID + tempText;
						emptyRowString += tempID;
					}
					else{
						// just build and then append the cellWrapperDiv to the rowWrapperDiv
						tempAnswerInput = answerInput.cloneNode(true);
						tempAnswerInput.id = "q" + tempLn + "a" + j;
						tempID = tempAnswerInput.id;
						tempCellWrapperDiv = cellWrapperDiv.cloneNode(true);
						tempCellWrapperDiv.appendChild(tempAnswerInput);
						tempRowWrapperDiv.appendChild(tempCellWrapperDiv);
						rowString += tempID + tempText;
						emptyRowString += tempID;
					}
				}
			}
			// combine all ids and answers to determine the hash value
				// gonna need some sort of array to keep track of this stuff... which I will have to create earlier in the code
				
			// append an answer button and a feedbackP to the tempRowWrapperDiv
			if(rowString != emptyRowString){
				tempAnswerButton = answerButton.cloneNode(true);
				tempFeedbackP = feedbackP.cloneNode(true);
				tempRowWrapperDiv.appendChild(tempAnswerButton);
				tempRowWrapperDiv.appendChild(tempFeedbackP);
				interfaceWrapper.appendChild(tempRowWrapperDiv);
				existingRows[tempLn] = tempLn;
				thisData[hashCode(rowString.replace(/ /g,''))] = [tempRw,tempFb];
			}
			rowString = ""; emptyRowString = "";
		}
		else{
			tempRw = rowElements[lineNumTD+1].textContent || rowElements[lineNumTD+1].innerText;
			tempFb = rowElements[lineNumTD+2].textContent || rowElements[lineNumTD+2].innerText || "";
			for(var j=0; j<lineNumTD; j++){
				if(!emptyCol[j] || emptyCol[j]!=2){
					// determine if the element has an answer in it, if yes, build a div and an input, if no, just build a div
					tempText = rowElements[j].textContent || rowElements[j].innerText || "";
					tempID = "q" + tempLn + "a" + j;
					rowString += tempID + tempText;
					emptyRowString += tempID;
				}
			}
			if(rowString != emptyRowString){
				thisData[hashCode(rowString.replace(/ /g,''))] = [tempRw,tempFb];
			}
			rowString = "";	emptyRowString = "";
		}
	}
	// append a "Reset" button
	var resetButton = document.createElement("BUTTON");
	resetButton.className = "check_reset";
	resetButton.innerHTML = "Reset";
	// append a "Show answers" button
	var answersButton = document.createElement("BUTTON");
	answersButton.className = "check_answers";
	answersButton.innerHTML = "Show answers";
	var metaButtons1 = document.createElement("DIV");
	metaButtons1.className = "meta_buttons";
	var metaButtons2 = document.createElement("DIV");
	metaButtons2.className = "meta_buttons";
	metaButtons1.appendChild(resetButton);
	metaButtons2.appendChild(answersButton);
	interfaceWrapper.appendChild(metaButtons1);
	interfaceWrapper.appendChild(metaButtons2);
	// PLACE THE STUDENT INTERFACE INTO THE PAGE, JUST IN FRONT OF THE PROF'S INTERFACE TABLE, THEN REMOVE THE PROF'S INTERFACE TABLE
	inputTable.parentNode.insertBefore(interfaceWrapper, inputTable);
	inputTable.parentNode.removeChild(inputTable);
	// NOW THAT THE STUDENT INTERFACE TABLE HAS BEEN REMOVED, LOAD THE STUDENT INTERFACE ELEMENT LISTENERS
	whichListener[whichListenerLoader]();
}


// LISTENER LOADERS
var whichListenerLoader = "newListener";

var whichListener = {
	newListener: function(nothing) {
		var allButtons = document.getElementsByTagName("BUTTON");
		for(var i=0; i<allButtons.length; i++){
			if(allButtons[i].className && allButtons[i].className.indexOf("check")>=0){
				allButtons[i].addEventListener ('mouseup', clickedStuff, false);
				allButtons[i].addEventListener ('keyup', clickedStuff, false);
			}
		}
		var allInputs = document.getElementsByTagName("INPUT");
		for(var i=0; i<allInputs.length; i++){
			allInputs[i].addEventListener ('keyup', clickedStuff, false);
		}
	},
	oldListener: function(nothing) {
		var allButtons = document.getElementsByTagName("BUTTON");
		for(var i=0; i<allButtons.length; i++){
			if(allButtons[i].className  && allButtons[i].className.indexOf("check")>=0){
				allButtons[i].attachEvent ('onmouseup', clickedStuff);
				allButtons[i].attachEvent ('onkeyup', clickedStuff);
			}
		}
		var allInputs = document.getElementsByTagName("INPUT");
		for(var i=0; i<allInputs.length; i++){
			allInputs[i].attachEvent ('onkeyup', clickedStuff);
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
var stopIt = 0;
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
	else if(stopIt<10){
		stopIt++;
		globalTimeout = setTimeout(checkJax,1000);
	}
	else {clearTimeout(globalTimeout);}
}
