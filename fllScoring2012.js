//
// Are you learning something from this code?  Cool!
// Spot something that could be done better?  Let me know:  jayfrancis@aol.com
//
// Want to re-use this for another project?  Go ahead, re-use away!
//
// This code is FREE, as in, well, FREE...
//

// Version 1.3 - initial release to the public
// Version 1.4 - removed limitation of 6 balls if team color is in center
//               for ball game
// Version 2.0 - revamped to match official FLL scoring sheet
// Version 2.1/2.2 - Removed the "Both" option from the ball game
// Version 2.3 - Fixed typo

function getInfo() {
    alert("This web app is FREE, as in, well, FREE...\n" + 
        "Spot something that could be done better?\n" +
        "Let me know:  jayfrancis@aol.com\n" +
        "TM and SM are owned by FIRST and LEGO\n" +
        "V2.3\n");
}

var scoringItems;
var timerOn;
var countDownSeconds;
var timer;
var countDown = true;

function timerRun() {
    if ( ((countDown && (countDownSeconds > 0)) || !countDown) && timerOn) {
        var t = document.getElementById('timerText');
        var minutes = Math.floor(countDownSeconds / 60);
        var seconds = countDownSeconds % 60;    
        var tstring = String(minutes) + ":";
        if (seconds < 10)
            tstring += "0";
        tstring += String(seconds);
        t.innerHTML = tstring;
        if (countDown)
            countDownSeconds--;
        else
            countDownSeconds++;
    }
    else if (countDownSeconds == 0) {
        var t = document.getElementById('timerText');
        t.innerHTML = "0:00";
    }
    timer = setTimeout("timerRun();", 1000);
}

function timerToggle() {
    var b = document.getElementById('startStopButton');

    if (!timerOn) {
        b.innerHTML = "Pause";
        timerOn = true;
    }
    else {
        b.innerHTML = "Start";
        timerOn = false;                
    }
}

function countDirectionChange(direction) {
    timerOn = false;

    if (direction == "up") {
        countDown = false;
        countDownSeconds = 0;
    }
    else {
        countDown = true;
        countDownSeconds = 150;
    }

    var t = document.getElementById('countUpButton');
    t.checked = !countDown;
    t = document.getElementById('countDownButton');
    t.checked = countDown;

    t = document.getElementById('timerText');
    var minutes = Math.floor(countDownSeconds / 60);
    var seconds = countDownSeconds % 60;    
    var tstring = String(minutes) + ":";
    if (seconds < 10)
        tstring += "0";
    tstring += String(seconds);
    t.innerHTML = tstring;
    
    var b = document.getElementById('startStopButton');
    b.innerHTML = "Start";

}

function reset() {
    var item;
    var select;
    var option;    
    
    scoringItems = {
        "chairFixedInBase": "no",
        "chairFixedUnderTable": "no",
        "greenBottleInBase": "no",
        "dogInBase": "no",
        "pinsKnockedDown": "0",
        "weightHeight": "notLifted",
        "stoveBurnersOff": "no",
        "plantsInGarden": "no",
        "flagsUp": "0",
        "blueQuilts": "0",
        "orangeQuilts": "0",
        "pointerMajor": "3",
        "pointerMinor": "0",
        "yellowLoopsInBase": "0",
        "robotTilted": "no",
        "robotBalanced": "no",
        "platformTouching": "yes",
        "pointersParallel": "no",
        "ballsOnRacks": "7",
        "centerBall": "neither"
    };
    
    for (item in scoringItems) {
        select = document.getElementById(item);
        for (option in select.children) {
            if (select[option].nodeName == "OPTION") {
                if (select[option].value == scoringItems[item]) {
                    select[option].selected = true;
                }
                else {
                    select[option].selected = false;
                }
            }
        }
    }

    if (countDown)
        countDirectionChange('down');
    else
        countDirectionChange('up');
    
    update();

    if (!timer)
        timerRun();
}

function checkPointer() {
    //
        
    var pointerMajor = parseInt(document.getElementById("pointerMajor").value);
    var pointerMinor = parseInt(document.getElementById("pointerMinor").value);
    
    if ( (pointerMajor == 9) && (pointerMinor > 0) ) {
        var minorSelector;
        minorSelector = document.getElementById('pointerMinor');
        for (var i = 0; i < minorSelector.options.length; i++) {
            minorSelector.options[i].selected = false;
            if (minorSelector.options[i].value == String(0))
                minorSelector.options[i].selected = true;
        }
    }
}

function checkChair(choice) {
    var chairFixedInBase = document.getElementById('chairFixedInBase');
    var chairFixedUnderTable = document.getElementById('chairFixedUnderTable');

    switch(choice) {
        case 'inBase':
            if ( chairFixedInBase.value == "yes" ) {
                chairFixedInBase.value = "yes";
                chairFixedUnderTable.value = "no";
            }
            break;
        case 'underTable':
            if ( chairFixedUnderTable.value == "yes" ) {
                chairFixedInBase.value = "no";
                chairFixedUnderTable.value = "yes";
            }
            break;
    }
}

function checkTransitions(choice) {
    var robotTilted = document.getElementById('robotTilted');
    var robotBalanced = document.getElementById('robotBalanced');

    switch(choice) {
        case 'tilted':
            if ( robotTilted.value == "yes" ) {
                robotTilted.value = "yes";
                robotBalanced.value = "no";
            }
            break;
        case 'balanced':
            if ( robotBalanced.value == "yes" ) {
                robotTilted.value = "no";
                robotBalanced.value = "yes";
            }
            break;
    }
}

function update() {
    var item;
    var value;
    var score = 0;
    
    // update the current values
    for (item in scoringItems) {
        value =  document.getElementById(item).value;
        scoringItems[item] = value;
    }

    // 15 points for chair fixed and in base
    // 25 points for chair fixed and under the table
    // mutual exclusion occurs in checkChair code, but is somewhat enforced here
    if (scoringItems.chairFixedUnderTable == 'yes')
                score += 25;
    else if (scoringItems.chairFixedInBase == 'yes')
                score += 15;
    
    // 25 points for green bottle in base with no orange bottles disturbed
    if ((scoringItems.greenBottleInBase == 'yes'))
        score += 25;
        
    // 20 points for the dog in base
    if (scoringItems.dogInBase == 'yes')
        score += 20;
  
    // 7 points for each pin knocked down for 1 - 5 pins
    // 60 points if 6 pins knocked down
    if (scoringItems.pinsKnockedDown == '6')
        score += 60;
    else
        score += 7 * parseInt(scoringItems.pinsKnockedDown);

    // 15 points for weight lifted in low position
    // 25 points for weight lifted in high position
    switch (scoringItems.weightHeight) {
        case 'low':
            score += 15;
            break;
        case 'high':
            score += 25;
            break;
    }
  
    // 25 points for stove burners off
    if (scoringItems.stoveBurnersOff == 'yes')
        score += 25;

    // 25 points for plant base touching garden
    if (scoringItems.plantsInGarden == 'yes')
        score += 25;

    // 20 points for each flag that is up
    score += 20 * parseInt(scoringItems.flagsUp);
    
    // 15 points for each blue quilt touching the target
    score += 15 * parseInt(scoringItems.blueQuilts);

    // 30 points for each orange quilt touching the target
    score += 30 * parseInt(scoringItems.orangeQuilts);
    
    // Cardiovascular Exercise
    //   This is complicated...
    //   If between 1-0 and 4-5, start at -60 and 5 points per position
    //   Between 5-0 and 6-0, start at +60 and 3 points per position
    //   From 6-1 to 7-0, start at 91 and 3 points per position
    //   from 7-0 to 9-0, start at 106 and 1 point per position

    var pointerMajor = parseInt(scoringItems.pointerMajor);
    var pointerMinor = parseInt(scoringItems.pointerMinor);
    var pointerScore = 0;
    
    if (pointerMajor < 5)
        pointerScore = -60 + ((pointerMajor - 1) * 30) + (pointerMinor * 5);
    else if ( (pointerMajor == 5) )
        pointerScore = 60 + (pointerMinor * 3);
    else if ( (pointerMajor == 6) && (pointerMinor == 0) )
        pointerScore = 78;
    else if ( (pointerMajor == 6) && (pointerMinor > 0) )
        pointerScore = 88 + (pointerMinor * 3);
    else if (pointerMajor >= 7)    
        pointerScore = 106 + ((pointerMajor - 7) * 6) + pointerMinor;
        
    score += pointerScore;

    // 20 points for yellow loop in base
    score += 20 * parseInt(scoringItems.yellowLoopsInBase);

    // 45 points for robot touching tilted center
    // 65 points for robot touching balanced center
    // platform must only be touching robot and mat
    if (scoringItems.platformTouching == 'yes') {
        if (scoringItems.robotBalanced == 'yes')
            score += 65;
        else if (scoringItems.robotTilted == 'yes')
            score += 45;
    }
 
    // 45 points for similarity pointers parallel
    if (scoringItems.pointersParallel == 'yes')
        score += 45;

    // 10 points for each ball on the racks
    score += 10 * parseInt(scoringItems.ballsOnRacks);

    // 60 points for your team's ball in the center
    switch (scoringItems.centerBall) {
        case 'yours':
            score += 60;
            break;
        case 'theirs':
            break;
        case 'neither':
            break;
    }

    // display the score
    var scoreText = document.getElementById('scoreText');
    scoreText.innerHTML = score;
}