/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */
const { alert, error, confirm } = require("./lib/dialogs.js");

var {Text, Rectangle, Color} = require("scenegraph");

async function countdownTimer(selection) {

        // Go to Plugins > Development > Developer Console to see this log output
        console.log("Plugin command is running!");

        // Insert a red square at (0, 0) in the current artboard or group/container
        await showConfirm().then( (feedback) => {
            var shape = new Rectangle();
            shape.width = 100;
            shape.height = 100;
            shape.fill = new Color("#00f");    
            switch (feedback.which) {
                case 0:
                    /* User canceled */
                    shape.fill = new Color("#f00");
                    break;
                case 1:
                    /* User clicked Enable */
                    shape.fill = new Color("#0f0");
                    break;
            }
            selection.insertionParent.addChild(shape);
        });
}

async function showAlert() {
    /* we'll display a dialog here */
    await alert("Countdown Timer", //[1]
    "In order to function correctly, this plugin requires access to your wallet. Please send me money."); //[2]
}


async function showConfirm(){
    console.log("showConfirm");
    const feedback = await confirm("Which color do you want your square to be?", //[1]
    "Color is always meaningful, choose wisely.", //[2]
    ["Red", "Green"] /*[3]*/ );
    return feedback;
}

function makeAnimationStrips(selection) {

    const x = 20;
    const y = 50;

    const start = selection.items[0].text;
    const end   = selection.items[1].text;

    const startMinuteTens = start[0];
    const startMinuteUnits = start[1];
    const startMinute = Number( startMinuteTens + startMinuteUnits );

    const endMinuteTens = end[0];
    const endMinuteUnits = end[1];
    const endMinute = Number( endMinuteTens + endMinuteUnits );

    const minuteSpan = startMinute - endMinute ;
    console.log(startMinute + " " + endMinute+ " " + minuteSpan);

    // const previousStart = Number(startTime[pos-1]);
    // const previousEnd = Number(endTime[pos-1]);
    // const replication = previousStart-previousEnd;

    const startMinuteTensStrip = new Text();
    const startMinuteUnitsStrip = new Text();
    const endMinuteTensStrip = new Text();
    const endMinuteUnitsStrip = new Text();

    // Minutes tens 
    startMinuteTensStrip.text  = new String("");
    var j = Number(startMinuteTens); 
    while( j > Number(endMinuteTens) ){
        startMinuteTensStrip.text += new String(j);
        startMinuteTensStrip.text += "\n";
        j -= 1;
    }
    startMinuteTensStrip.text += endMinuteTens;
    endMinuteTensStrip.text = startMinuteTensStrip.text;  

    // Minutes units
    startMinuteUnitsStrip.text = new String("");
    var j = startMinute; 
    while( j > endMinute ){
        startMinuteUnitsStrip.text += new String(j%10);
        startMinuteUnitsStrip.text += "\n";
        j -= 1;
    }
    startMinuteUnitsStrip.text += endMinuteUnits;
    endMinuteUnitsStrip.text = startMinuteUnitsStrip.text;  

    // display
    startMinuteTensStrip.fill = new Color("#FF0000");     
    startMinuteTensStrip.fontSize = 30;
    startMinuteUnitsStrip.fill = new Color("#FF0000");     
    startMinuteUnitsStrip.fontSize = 30;

    endMinuteTensStrip.fill = new Color("#FF0000");     
    endMinuteTensStrip.fontSize = 30;
    endMinuteUnitsStrip.fill = new Color("#FF0000");     
    endMinuteUnitsStrip.fontSize = 30;

    selection.items[0].parent.addChild(startMinuteTensStrip); 
    selection.items[0].parent.addChild(startMinuteUnitsStrip);   
    selection.items[1].parent.addChild(endMinuteTensStrip); 
    selection.items[1].parent.addChild(endMinuteUnitsStrip);   

    startMinuteTensStrip.moveInParentCoordinates(x, y);   
    startMinuteUnitsStrip.moveInParentCoordinates(x+20, y);
    endMinuteTensStrip.moveInParentCoordinates(x, y);   
    endMinuteUnitsStrip.moveInParentCoordinates(x+20, y);

}

module.exports = {
    commands: {
        countdownTimer,
        makeAnimationStrips
    }
};
