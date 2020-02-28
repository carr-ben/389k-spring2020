// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.
var states = ["Idaho", "South Dakota", "Hawaii", "Alaska", "Alabama", "New York"];

// These are all the states. It maps the state name to the number which you'll
// want to use in your API call.
var abvMap = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District Of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
}


/*
 * The majority of this project is done in JavaScript.
 *
 * 1. Start the timer when the click button is hit. Also, you must worry about
 *    how it will decrement (hint: setInterval).
 * 2. Check the input text with the group of states that has not already been
 *    entered. Note that this should only work if the game is currently in
 * 3. Realize when the user has entered all of the states, and let him/her know
 *    that he/she has won (also must handle the lose scenario). The timer must
 *    be stopped as well.
 *
 * There may be other tasks that must be completed, and everyone's implementation
 * will be different. Make sure you Google! We urge you to post in Piazza if
 * you are stuck.
 */
var timer = 0;
var startButton = document.getElementById("start");
var textEntry = document.getElementById("entrybox");
var timeout = null;
var oldText = '';
var statesFound = [];
var foundList = document.getElementById("foundList");
var missedList = document.getElementById("missedList");
var statesCopy = states.slice();
var foundHead = document.getElementById("foundHead");

initGame();

$('body').on({
    'mouseenter': function(){
        ($(this)).children().show();
    }},
    'li.state'
);
$('body').on({
    'mouseleave': function(){
        ($(this)).children().hide();
    }},
    'li.state'
);

function startTimer() {
    initGame()
    startButton.disabled = true;
    textEntry.disabled = false;
    textEntry.focus();
    timeout = setInterval(decrementTimer, 1000);
}

function decrementTimer() {
    timer -= 1;
    $('#timeDisplay').text("Time Left: " +timer);
    if (timer <= 0) {
        timeElapsed()
        clearInterval(timeout);
    }
}

function timeElapsed() {
    for (elem of statesCopy) {
        var entry = document.createElement('li');
        entry.className = "state";
        entry.appendChild(document.createTextNode(elem));
        appendSpanishData(entry, elem);
        missedList.appendChild(entry);
    }
    textEntry.disabled = true;
    startButton.disabled = false;
    finishGame();
}

function appendSpanishData(element, text) {
    var url = 'https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:' +abvMap[text] +'&LAN=625';
    $.get(url, function (data) {
        console.log(data[1][0]);
        var dataNode = document.createElement('div');
        dataNode.appendChild(document.createTextNode("Spanish speakers: " +data[1][0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")));
        dataNode.hidden = true;
        element.appendChild(dataNode);
    });
}

function handleChange() {
    var newText = textEntry.value;
    if (newText == oldText) {
        return;
    } else {
        checkState(newText);
        oldText = newText;
    }
}

function checkState(text) {
    var found = statesCopy.indexOf(text);
    if (found != -1) {
        var entry = document.createElement('li');
        entry.className = "state";
        entry.appendChild(document.createTextNode(text));
        appendSpanishData(entry, text);
        foundList.appendChild(entry);
        statesCopy.splice(found, 1);
    }
    if (statesCopy.length == 0) {
        textEntry.disabled = true;
        startButton.disabled = false;
        clearInterval(timeout);
        finishGame();
    }
}

function initGame() {
    statesCopy = states.slice();
    foundList.innerHTML = "";
    missedList.innerHTML = "";
    timer = 20;
    $('#timeDisplay').text("Time Left: " +timer);
    textEntry.value = "";
    document.getElementById("foundHead").textContent = "States Found: ";
    document.getElementById("missedHead").textContent = "States Missed: ";
}

function finishGame() {
    document.getElementById("foundHead").textContent = "States Found: " +(states.length - statesCopy.length).toString() +"/" +states.length.toString();
    var missedHead = "";
    if (statesCopy.length == 0) {
        missedHead = "States Missed: 0/" +states.length.toString() + " You win!";
    } else {
        missedHead = "States Missed: " +statesCopy.length.toString() +"/" +states.length.toString() + " Try Again!";
    }
    document.getElementById("missedHead").textContent = missedHead;
}