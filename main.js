/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */
const { alert, error, confirm } = require("./lib/dialogs.js");

var {Text, Rectangle, Color} = require("scenegraph");
let commands = require("commands");

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
    const minuteTensSpan = Number(startMinuteTens) - Number(endMinuteTens) ;
    console.log(startMinute + " " + endMinute+ " " + minuteSpan);

    // const previousStart = Number(startTime[pos-1]);
    // const previousEnd = Number(endTime[pos-1]);
    // const replication = previousStart-previousEnd;

    const startMinuteTensStrip = new Text();
    const startMinuteUnitsStrip = new Text();
    const endMinuteTensStrip = new Text();
    const endMinuteUnitsStrip = new Text();

    // Minutes tens 
    startMinuteTensStrip.text  = new String("") ;
    var j = Number(endMinuteTens); 
    while( j <  Number(startMinuteTens)){
        startMinuteTensStrip.text += new String(j);
        startMinuteTensStrip.text += "\n";
        j += 1;
    }
    startMinuteTensStrip.text += startMinuteTens;
    endMinuteTensStrip.text = startMinuteTensStrip.text;  

    // Minutes units
    startMinuteUnitsStrip.text = new String("");
    var j = endMinute; 
    while( j < startMinute ){
        startMinuteUnitsStrip.text += new String(j%10);
        startMinuteUnitsStrip.text += "\n";
        j += 1;
    }
    startMinuteUnitsStrip.text += startMinuteUnits;
    endMinuteUnitsStrip.text = startMinuteUnitsStrip.text;  

    // display
    startMinuteTensStrip.fill = new Color("#FF0000");     
    startMinuteTensStrip.fontSize = 30;
    startMinuteTensStrip.lineSpacing = startMinuteTensStrip.fontSize + 4 ;

    startMinuteUnitsStrip.fill = new Color("#FF0000");     
    startMinuteUnitsStrip.fontSize = 30;
    startMinuteUnitsStrip.lineSpacing = startMinuteUnitsStrip.fontSize + 4 ;

    console.log(startMinuteUnitsStrip.lineSpacing);

    endMinuteTensStrip.fill = new Color("#FF0000");     
    endMinuteTensStrip.fontSize = 30;
    endMinuteTensStrip.lineSpacing = endMinuteTensStrip.fontSize + 4 ;

    endMinuteUnitsStrip.fill = new Color("#FF0000");     
    endMinuteUnitsStrip.fontSize = 30;
    endMinuteUnitsStrip.lineSpacing = endMinuteUnitsStrip.fontSize + 4 ;

    selection.items[0].parent.addChild(startMinuteTensStrip); 
    selection.items[0].parent.addChild(startMinuteUnitsStrip);   
    selection.items[1].parent.addChild(endMinuteTensStrip); 
    selection.items[1].parent.addChild(endMinuteUnitsStrip);   

    //console.log(startMinuteTensStrip.height);
    startMinuteTensStrip.height = minuteTensSpan * (startMinuteTensStrip.lineSpacing) - 1 ; 
    console.log("startMinuteTensStrip.lineSpacing=" + startMinuteTensStrip.lineSpacing) ; 
    startMinuteTensStrip.moveInParentCoordinates(x, 34-startMinuteTensStrip.height);   
    startMinuteUnitsStrip.height = minuteSpan * (startMinuteUnitsStrip.lineSpacing) - 1 ; 
    startMinuteUnitsStrip.moveInParentCoordinates(x+20, 34-startMinuteUnitsStrip.height); 
    
    endMinuteTensStrip.moveInParentCoordinates(x, 34);   
    endMinuteUnitsStrip.moveInParentCoordinates(x+20, 34);

    const rectStart = new Rectangle();
    rectStart.width = 100;
    rectStart.height = 34;
    rectStart.name = "Mask" ; 
    selection.items[0].parent.addChild(rectStart); 
    rectStart.moveInParentCoordinates(0,8);

    const rectEnd = new Rectangle();
    rectEnd.width = 100;
    rectEnd.height = 34;
    rectEnd.name = "Mask" ; 
    selection.items[1].parent.addChild(rectEnd); 
    rectEnd.moveInParentCoordinates(0,8);

    selection.items = [startMinuteTensStrip, startMinuteUnitsStrip, rectStart];
    commands.createMaskGroup();
    let startMaskedGroup = selection.items[0];
    startMaskedGroup.name = "CounterMask" ;

    selection.items = [endMinuteTensStrip, endMinuteUnitsStrip, rectEnd];
    commands.createMaskGroup();
    let endMaskedGroup = selection.items[0];
    endMaskedGroup.name = "CounterMask" ;   

}

module.exports = {
    commands: {
        countdownTimer,
        makeAnimationStrips
    }
};
