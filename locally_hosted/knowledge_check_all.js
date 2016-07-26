// TABLE DATA
var thisData = {};

// HASHIFY
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

// FIND TABLES
function findTableContent(){
	var foundTables = document.body.getElementsByTagName("TABLE");
	for (var i=0, iMAX=foundTables.length; i<iMAX; i++){
		// CHECK TO SEE IF EACH TABLE HAS A CLASSNAME THAT RELATES TO A SPECIFIC BUILDER FUNCTION, IF YES, CALL THAT SPECIFIC BUILDER FUNCTION ON THAT TABLE
		if(foundTables[i].className && (foundTables[i].className=="knowledge_check")){
			builder(foundTables[i]);
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
	if(keynum && (keynum == 0 || keynum == 1 || keynum == 13 || keynum == 32)){
		if(clickedThis.tagName == "LABEL"){
			clickedThis.getElementsByTagName("INPUT")[0].checked=true;
			evnt.preventDefault();
		}
		// MAKE SURE THAT YOU PULL ALL TEXT FROM THE LABEL AND NOT JUST FROM SOME INTERNAL COMPONENTS
		while(!clickedThis.className || (clickedThis.className != "check_immediately" && clickedThis.className != "check_all" && clickedThis.className != "check_reset" && clickedThis.className != "check_undo")){
			clickedThis = clickedThis.parentNode;
		}
		// HARVEST THE SECOND PART OF THE CLICKED ELEMENT'S CLASSNAME
		var interactiveType = clickedThis.className.split("_")[1];
		// DETERMINE IF THE SECOND PART OF THE CLICKED ELEMENT'S CLASSNAME MATCHES AN EXPECTED CLASSNAME
		if(interactiveType == "immediately" || interactiveType == "all" || interactiveType == "reset" || interactiveType == "undo"){
			// CALL THE APPROPRIATE SUB-FUNCTION OF THE DOSTUFF VARIABLE BASED ON THE INTERACTIVE TYPE (HARVESTED FROM THE ELEMENT'S CLASSNAME)
			doStuff[interactiveType](clickedThis);
		}
		else {alert("something is amiss :( " + clickedThis.tagName);}
	}
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


// THE DOSTUFF VARIABLE CONTAINS WITHIN IT A SET OF FUNCTIONS THAT ADD INTERACTIVITY TO THE PAGE
var defaultAnswerArray = ["Incorrect.<br>", "Correct!<br>"];
var doStuff = {
	// THE BUTTON FUNCTION WILL UPDATE THE TEXT SEEN IN A TEXTTARGET DIV WHEN A BUTTON OR TAB IS CLICKED
	immediately: function(thisButton){
		var findP = thisButton.parentNode.previousSibling;
		while(!findP.tagName || findP.tagName != "P"){
			findP = findP.previousSibling;
		}
		// alert(findP.textContent || findP.innerText);
		if(thisData[hashCode(thisButton.textContent.concat(findP.textContent).replace(/ /g,''))]){
			//alert(thisData[hashCode(thisButton.textContent.concat(findP.textContent).replace(/ /g,''))][1]);
			var questionPs = thisButton.parentNode.getElementsByTagName("DIV");
			var answerSpot = questionPs[0];
			answerSpot.innerHTML = defaultAnswerArray[thisData[hashCode(thisButton.textContent.concat(findP.textContent).replace(/ /g,''))][0]] + thisData[hashCode(thisButton.textContent.concat(findP.textContent).replace(/ /g,''))][1];
			answerSpot.className = "feedbackText"+thisData[hashCode(thisButton.textContent.concat(findP.textContent).replace(/ /g,''))][0];
		}
		else{alert("please try again")};
	},
	all: function(notUsed){
		var allDivs = document.getElementsByTagName("DIV");
		var theseInputs = "";
		var anyChecks = 0;
		var answerSpot = ""; var thisButton = ""; var findP = "";
		for(var i=0, iMAX=allDivs.length; i<iMAX; i++){
			if (allDivs[i].className && allDivs[i].className == "clearfix question"){
				theseInputs = allDivs[i].getElementsByTagName("INPUT");
				for(var j=0, jMAX=theseInputs.length; j<jMAX; j++){
					if(theseInputs[j].checked===true){
						thisButton = theseInputs[j].parentNode;
						// get the first div inside of allDivs[i]... this is the feedback target :D
						findP = thisButton.parentNode.previousSibling;
						while(!findP.tagName || findP.tagName != "P"){
							findP = findP.previousSibling;
						}
						answerSpot = allDivs[i].getElementsByTagName("DIV")[0];
						answerSpot.innerHTML = defaultAnswerArray[thisData[hashCode(thisButton.textContent.concat(findP.textContent).replace(/ /g,''))][0]] + thisData[hashCode(thisButton.textContent.concat(findP.textContent).replace(/ /g,''))][1];
						answerSpot.className = "feedbackText"+thisData[hashCode(thisButton.textContent.concat(findP.textContent).replace(/ /g,''))][0];
						anyChecks = 1;
						break;
					}
					if(theseInputs[j].type=="text" && theseInputs[j].value && theseInputs[j].value != ""){
						anyChecks = 1;
						thisButton = theseInputs[j];
						// get the first div inside of allDivs[i]... this is the feedback target :D
						findP = thisButton.parentNode.previousSibling;
						while(!findP.tagName || findP.tagName != "P"){
							findP = findP.previousSibling;
						}
						if(thisData[hashCode(thisButton.value.concat(findP.textContent).replace(/ /g,''))]){
							answerSpot = allDivs[i].getElementsByTagName("DIV")[0];
							answerSpot.innerHTML = defaultAnswerArray[thisData[hashCode(thisButton.value.concat(findP.textContent).replace(/ /g,''))][0]] + thisData[hashCode(thisButton.value.concat(findP.textContent).replace(/ /g,''))][1];
							answerSpot.className = "feedbackText"+thisData[hashCode(thisButton.value.concat(findP.textContent).replace(/ /g,''))][0];
						}
						else{
							answerSpot = allDivs[i].getElementsByTagName("DIV")[0];
							answerSpot.innerHTML = "Incorrect.";
							answerSpot.className = "feedbackText0";
						}
					}
				}
				if(anyChecks ==0){
					answerSpot = allDivs[i].getElementsByTagName("DIV")[0];
					answerSpot.innerHTML = "Unanswered.";
					answerSpot.className = "feedbackText0";
				}
				anyChecks = 0;
			}
		}
		notUsed.innerHTML = "Resubmit";
	},
	reset: function(notUsed){
		var allDivs = document.getElementsByTagName("DIV");
		for(var i=0, iMAX=allDivs.length; i<iMAX; i++){
			if(allDivs[i].className && (allDivs[i].className == "feedbackText0" || allDivs[i].className == "feedbackText1")){
				allDivs[i].className = "feedbackText";
			}
		}
	},
	undo: function(notUsed){
		var allDivs = document.getElementsByTagName("DIV");
		for(var i=0, iMAX=allDivs.length; i<iMAX; i++){
			if(allDivs[i].className && (allDivs[i].className == "feedbackText0" || allDivs[i].className == "feedbackText1")){
				allDivs[i].className = "feedbackText";
			}
		}
		var allInputs = document.getElementsByTagName("INPUT")
		for(var j=0, jMAX=allInputs.length; j<jMAX; j++){
			if(allInputs[j].checked === true){
				allInputs[j].checked = false;
			}
			if(allInputs[j].type=="text"){
				allInputs[j].value = "";
			}
		}
	}
};



// THE BUILDER FUNCTION PULLS INFORMATION FROM TABLES IN ORDER TO GENERATE INTERACTIVE CONTENT
function builder(thisTable){
	// FIRST THING FIRST... HIDE THE DATA TABLES FROM THE USER SO THEY AREN'T SEEN NEXT TO THE INTERACTIVE COMPONENTS ON THE PAGE
	thisTable.style.display="none";
	// INITIALIZE SOME VARIABLES THAT WILL STORE INFORMATION FOUND IN THISTABLE
	var lastSection = "", lastQuestion = ""; lastSectionText = "NOPE_123", lastQuestionText = "NOPE_123";
	var tableRows, rowElements, section, sectionText="", question, questionText="", answer, answerText, isCorrect, answerType, feedback, hashedAll, hashedAnswer, sectionArray = [], questionArray = [];
	var sectionCounter = -1; questionCounter = -1; outerQuestionCounter = 0; innerQuestionCounter = 0; answerCounter = 0; alreadyAnswer = 0;
	var kcWrapper = document.createElement("DIV"), sectionWrapper = document.createElement("DIV"), questionWrapper = document.createElement("DIV");
	kcWrapper.className = "clearfix"; sectionWrapper.className = "clearfix section"; questionWrapper.className = "clearfix question";
	var sectionP = document.createElement("P"), questionP = document.createElement("P"), answerSpan = document.createElement("SPAN");
	sectionP.className = "sectionText"; questionP.className = "questionText"; answerSpan.className = "answerText";
	var feedbackP = document.createElement("P"); feedbackP.className = "feedbackText";
	var feedbackDiv = document.createElement("DIV"); feedbackDiv.className = "feedbackDiv";
	var tempSectionP = "", tempQuestionP = "", tempQuestionNum = "", tempAnswerSpan = "", tempAnswerLetter = "", tempFeedbackP = "", tempFeedbackDiv = "";
	var radioInput = document.createElement("INPUT"), radioLabel = document.createElement("LABEL"), tempRadioInput = "", tempRadioLabel = "";
	radioLabel.tabIndex = 0;
	var tempAnswerId = "";
	var verticalBreak = document.createElement("BR"), tempBR = "";
	var textInput = document.createElement("INPUT"); tempTextInput = "";
	var numToLetter = ["A","B","C","D","E","F","G","H","I","J","K","L"];
	var numToRoman = ["i","ii","iii","iv","v","vi","vii","viii","ix","x","xi","xii"];
	textInput.type = "text";
	radioInput.type = "radio"; 
	// PULL CONTENT FROM THISTABLE
	// GET ALL OF THE ROWS FOUND IN THE TABLE
	tableRows = thisTable.getElementsByTagName("TR");
	// LOOP THROUGH THE TABLE ROWS, STARTING WITH THE SECOND ROW (BECAUSE THE FIRST ROW, ROW[0], IS THE HEADER ROW AND CONTAINS NO DATA)
	for(var i=1, iMAX=tableRows.length; i<iMAX; i++){
		// IN EVERY ROW LOOP, COLLECT ALL OF THE TD ELEMENTS
		rowElements = tableRows[i].getElementsByTagName("TD");
		// COLLECT THE SECTION, QUESTION, AND ANSWER TYPE AND WHETHER THE ANSWER IS CORRECT FOR EVERY ANSWER (EVERY ROW)
		section = rowElements[0].innerHTML;
		question = rowElements[1].innerHTML;
		answerType = rowElements[2].textContent || rowElements[2].innerText;
		sectionText = rowElements[0].textContent || rowElements[0].innerText || ""; // else find src function
		questionText = rowElements[1].textContent || rowElements[1].innerText || "";
		// DETERMINE WHETHER THERE IS SOME CONTENT IN THE TABLE, IF YES, GO AHEAD AND BUILD A RELATED INTERACTIVE ELEMENT
		// HERE, IT IS ASSUMED THAT THE BUTTON NAME AND TARGETTEXT VALUES WILL ONLY BE EQUAL IF THEY ARE BOTH BLANK. UNLIKELY EDGE CASES WILL CAUSE PROBLEMS AKA BUTTON NAME = TEXT TO SHOW.
		if(lastSectionText != sectionText){
			// PULL SECTION TEXT FROM TABLE CELL
//			sectionText = rowElements[0].textContent || rowElements[0].innerText;
			// CHECK TO SEE IF SECTION TEXT IS BLANK, IF YES, SET VARIABLE SO THAT QUESTIONS ARE APPENDED TO THE KCWRAPPER, OTHERWISE, CREATE A NEW SECTION WRAPPER AND SET VARIABLE SO THAT QUESTIONS ARE APPENDED TO THIS NEW SECTION TILL THERE IS A SECTION CHANGE
			if(!sectionText || sectionText == ""){
				sectionCounter++;
				sectionArray[sectionCounter] = kcWrapper;
				questionNumbering = "direct";
			}
			else {
				// create a new section div and append it to the kcWrapper;
				outerQuestionCounter++;
				innerQuestionCounter = 0;
				tempSectionP = sectionP.cloneNode(true);
				tempSectionP.innerHTML = outerQuestionCounter + ". " + section;
				kcWrapper.appendChild(tempSectionP);
				sectionCounter++;
				sectionArray[sectionCounter] = sectionWrapper.cloneNode(true);
				kcWrapper.appendChild(sectionArray[sectionCounter]);
				questionNumbering = "roman";
			}
			lastSectionText = sectionText;
		}
		if(lastQuestionText != questionText){
			
			if(questionNumbering == "direct"){
				outerQuestionCounter++;
				tempQuestionNum = outerQuestionCounter + ". ";
			}
			else{
				tempQuestionNum = numToRoman[innerQuestionCounter] + ". ";
				innerQuestionCounter++;
			}
//			questionText = rowElements[1].textContent || rowElements[1].innerText;
			questionCounter++;
			tempQuestionP = questionP.cloneNode(true);
			tempQuestionP.innerHTML = " " + tempQuestionNum + " " + question;
			sectionArray[sectionCounter].appendChild(tempQuestionP);
			questionArray[questionCounter] = questionWrapper.cloneNode(true);
			sectionArray[sectionCounter].appendChild(questionArray[questionCounter]);
			alreadyAnswer = 0; answerCounter = 0;
			lastQuestionText = questionText;
		}
		if(answerType == 2){
			answerText = rowElements[3].textContent || rowElements[3].innerText;
			isCorrect = rowElements[4].textContent || rowElements[4].innerText;
			feedback = rowElements[5].innerHTML;
			if(alreadyAnswer == 0){
				tempFeedbackDiv = feedbackDiv.cloneNode(true);
				questionArray[questionCounter].appendChild(tempFeedbackDiv);
				//questionArray[questionCounter].insertBefore(tempFeedbackDiv,questionArray[questionCounter].lastChild);
				tempTextInput = textInput.cloneNode(true);
				tempTextInput.name = "q"+questionCounter;
				questionArray[questionCounter].insertBefore(tempTextInput,questionArray[questionCounter].lastChild);
				//questionArray[questionCounter].appendChild(tempTextInput);
				// append a button that has a check_immediately className
			}
			alreadyAnswer = 1; answerCounter++;
			// UPDATE THE ANSWER JSON
			thisData[hashCode(answerText.concat(tempQuestionNum,questionText).replace(/ /g,''))] = [isCorrect,feedback];
		}
		else{
			answerText = rowElements[3].textContent || rowElements[3].innerText;
			answer = rowElements[3].innerHTML;
			isCorrect = rowElements[4].textContent || rowElements[4].innerText;
			feedback = rowElements[5].innerHTML;
			if(alreadyAnswer == 0){
				tempFeedbackDiv = feedbackDiv.cloneNode(true);
				questionArray[questionCounter].appendChild(tempFeedbackDiv);
			}
			// APPEND EACH ANSWER TO THE QUESTION DIV
			tempAnswerSpan = answerSpan.cloneNode(true);
			tempAnswerSpan.innerHTML = answer;
			tempAnswerId = "q"+questionCounter+"a"+answerCounter;
			tempRadioInput = radioInput.cloneNode(true);
			tempRadioInput.id = tempAnswerId;
			tempRadioInput.name = "q"+questionCounter;
			tempRadioLabel = radioLabel.cloneNode(true);
			tempRadioLabel.for = tempAnswerId;
			//tempRadioLabel.className = "check_immediately";
			tempAnswerLetter = answerSpan.cloneNode(true);
			tempAnswerLetter.innerHTML = " " + numToLetter[answerCounter] + ". ";
			tempRadioLabel.appendChild(tempRadioInput);
			tempRadioLabel.appendChild(tempAnswerLetter);
			tempRadioLabel.appendChild(tempAnswerSpan);
			questionArray[questionCounter].insertBefore(tempRadioLabel,questionArray[questionCounter].lastChild);
			tempBR = verticalBreak.cloneNode(true);
			questionArray[questionCounter].insertBefore(tempBR,questionArray[questionCounter].lastChild);
			tempBR = verticalBreak.cloneNode(true);
			questionArray[questionCounter].insertBefore(tempBR,questionArray[questionCounter].lastChild);
			alreadyAnswer = 1; answerCounter++;
			// UPDATE THE ANSWER JSON
			thisData[hashCode(tempAnswerLetter.innerHTML.concat(answerText,tempQuestionNum,questionText).replace(/ /g,''))] = [isCorrect,feedback];
		}
		// CLEAR THE ROWELEMENTS ARRAY BEFORE THE NEXT LOOP
		rowElements.length = 0;
	}
	thisTable.parentNode.insertBefore(kcWrapper, thisTable);
	thisTable.parentNode.removeChild(thisTable);
	tableRows.length = 0;
	var allButton = document.createElement("BUTTON");
	allButton.className = "check_all";
	allButton.innerHTML = "Submit";
	allButton.tabIndex = 0;
	document.body.appendChild(allButton);
	var resetButton = document.createElement("BUTTON");
	resetButton.className = "check_reset";
	resetButton.innerHTML = "Clear Feedback";
	resetButton.style.marginLeft = "1em";
	resetButton.tabIndex = 0;
	document.body.appendChild(resetButton);
	var clearButton = document.createElement("BUTTON");
	clearButton.className = "check_undo";
	clearButton.innerHTML = "Reset Answers";
	clearButton.style.marginLeft = "1em";
	clearButton.tabIndex = 0;
	document.body.appendChild(clearButton);
}


// LISTENER LOADERS
var whichListenerLoader = "newListener";

var whichListener = {
	newListener: function(nothing) {
		var allLabels = document.getElementsByTagName("LABEL");
		for(var i=0; i<allLabels.length; i++){
			//if(allLabels[i].className && allLabels[i].className.indexOf("check")>=0){
				allLabels[i].addEventListener ('mouseup', clickedStuff, false);
				allLabels[i].addEventListener ('keyup', clickedStuff, false);
			//}
		}
		var allButtons = document.getElementsByTagName("BUTTON");
		for(var i=0; i<allButtons.length; i++){
			if(allButtons[i].className && allButtons[i].className.indexOf("check")>=0){
				allButtons[i].addEventListener ('mouseup', clickedStuff, false);
				allButtons[i].addEventListener ('keyup', clickedStuff, false);
			}
		}
	},
	oldListener: function(nothing) {
		var allLables = document.getElementsByTagName("LABEL");
		for(var i=0; i<allLables.length; i++){
			//if(allLables[i].className  && allLables[i].className.indexOf("check")>=0){
				allLables[i].attachEvent ('onmouseup', clickedStuff);
				allLables[i].attachEvent ('onkeyup', clickedStuff);
			//}
		}
		var allButtons = document.getElementsByTagName("BUTTON");
		for(var i=0; i<allButtons.length; i++){
			if(allButtons[i].className  && allButtons[i].className.indexOf("check")>=0){
				allButtons[i].attachEvent ('onmouseup', clickedStuff);
				allButtons[i].attachEvent ('onkeyup', clickedStuff);
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