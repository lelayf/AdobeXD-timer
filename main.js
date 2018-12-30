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

    const x = 20 ;
    const y = 50 ;

    const start = selection.items[0].text ;
    const end   = selection.items[1].text ;

    const startMinuteTens   = start[0] ;
    const startMinuteUnits  = start[1] ;
    const startSecondTens  = start[3] ;
    const startSecondUnits = start[4] ;

    const startMinute       = Number( startMinuteTens + startMinuteUnits ) ;
    const startSecond       = Number( startSecondTens + startSecondUnits) ;

    const endMinuteTens     = end[0] ;
    const endMinuteUnits    = end[1] ;
    const endSecondTens     = end[3] ;
    const endSecondUnits    = end[4] ;

    const endMinute         = Number( endMinuteTens + endMinuteUnits ) ;
    const endSecond         = Number( endSecondTens + endSecondUnits ) ;

    const minuteSpan        = startMinute - endMinute ;
    const minuteTensSpan    = Number(startMinuteTens) - Number(endMinuteTens) ;
    

    const startMinuteTensStrip  = new Text() ;
    const startMinuteUnitsStrip = new Text() ;
    const endMinuteTensStrip    = new Text() ;
    const endMinuteUnitsStrip   = new Text() ;
    const columnStart           = new Text() ;
    const columnEnd             = new Text() ;
    const startSecondTensStrip  = new Text() ;
    const startSecondUnitsStrip = new Text() ;
    const endSecondTensStrip    = new Text() ;
    const endSecondUnitsStrip   = new Text() ;

    // Minutes tens 
    startMinuteTensStrip.text   = new String("") ;
    var j = Number(endMinuteTens) ;  
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

    // Seconds tens 
    startSecondTensStrip.text   = new String("") ;
    var cycles = 6-Number(endSecondTens)+Number(startSecondTens)+(minuteSpan-1)*6 ; 
    console.log("cycles=" + cycles) ;
    for( var j=0; j< cycles; j++){
        startSecondTensStrip.text += new String( (Number(endSecondTens)+j) % 6 ) ;
        startSecondTensStrip.text += "\n";
    }
    startSecondTensStrip.text += startSecondTens;
    endSecondTensStrip.text = startSecondTensStrip.text;  


    // column
    columnStart.text    = ":" ;
    columnEnd.text      = ":" ;

    // set text properties
    startMinuteTensStrip.fill = new Color("#FF0000");     
    startMinuteTensStrip.fontSize = 30;
    startMinuteTensStrip.lineSpacing = startMinuteTensStrip.fontSize + 4 ;

    startMinuteUnitsStrip.fill = new Color("#FF0000");     
    startMinuteUnitsStrip.fontSize = 30;
    startMinuteUnitsStrip.lineSpacing = startMinuteUnitsStrip.fontSize + 4 ;

    endMinuteTensStrip.fill = new Color("#FF0000");     
    endMinuteTensStrip.fontSize = 30;
    endMinuteTensStrip.lineSpacing = endMinuteTensStrip.fontSize + 4 ;

    endMinuteUnitsStrip.fill = new Color("#FF0000");     
    endMinuteUnitsStrip.fontSize = 30;
    endMinuteUnitsStrip.lineSpacing = endMinuteUnitsStrip.fontSize + 4 ;

    columnStart.fill = new Color("#FF0000");     
    columnStart.fontSize = 30 ;
    columnStart.lineSpacing = columnStart.fontSize  + 4 ;

    columnEnd.fill = new Color("#FF0000");     
    columnEnd.fontSize = 30 ;
    columnEnd.lineSpacing = columnEnd.fontSize  + 4 ;

    startSecondTensStrip.fill = new Color("#FF0000");     
    startSecondTensStrip.fontSize = 30 ;
    startSecondTensStrip.lineSpacing = startSecondTensStrip.fontSize + 4;

    endSecondTensStrip.fill = new Color("#FF0000");     
    endSecondTensStrip.fontSize = 30 ;
    endSecondTensStrip.lineSpacing = endSecondTensStrip.fontSize + 4;


    // add to artboards
    selection.items[0].parent.addChild(startMinuteTensStrip); 
    selection.items[0].parent.addChild(startMinuteUnitsStrip);   
    selection.items[0].parent.addChild(columnStart);
    selection.items[0].parent.addChild(startSecondTensStrip);   
    selection.items[1].parent.addChild(endMinuteTensStrip); 
    selection.items[1].parent.addChild(endMinuteUnitsStrip);
    selection.items[1].parent.addChild(columnEnd);
    selection.items[1].parent.addChild(endSecondTensStrip);   

    // reposition
    startMinuteTensStrip.height = minuteTensSpan * startMinuteTensStrip.lineSpacing - 1 ; 
    startMinuteTensStrip.moveInParentCoordinates(x, 34-startMinuteTensStrip.height);   
    startMinuteUnitsStrip.height = minuteSpan * startMinuteUnitsStrip.lineSpacing - 1 ; 
    startMinuteUnitsStrip.moveInParentCoordinates(x+20, 34-startMinuteUnitsStrip.height); 
    columnStart.moveInParentCoordinates(x+40,34);
    startSecondTensStrip.height = cycles * startSecondTensStrip.lineSpacing - 1 ; 
    startSecondTensStrip.moveInParentCoordinates(x+50, 34-startSecondTensStrip.height); 
 
    endMinuteTensStrip.moveInParentCoordinates(x, 34);   
    endMinuteUnitsStrip.moveInParentCoordinates(x+20, 34);
    columnEnd.moveInParentCoordinates(x+40, 34);
    endSecondTensStrip.moveInParentCoordinates(x+50, 34);

    // add masks 
    const rectStart = new Rectangle();
    rectStart.width = 150;
    rectStart.height = 34;
    rectStart.name = "Mask" ; 
    selection.items[0].parent.addChild(rectStart); 
    rectStart.moveInParentCoordinates(0,8);

    const rectEnd = new Rectangle();
    rectEnd.width = 150;
    rectEnd.height = 34;
    rectEnd.name = "Mask" ; 
    selection.items[1].parent.addChild(rectEnd); 
    rectEnd.moveInParentCoordinates(0,8);

    selection.items = [startMinuteTensStrip, startMinuteUnitsStrip, columnStart, startSecondTensStrip, rectStart];
    commands.createMaskGroup();
    let startMaskedGroup = selection.items[0];
    startMaskedGroup.name = "CounterMask" ;

    selection.items = [endMinuteTensStrip, endMinuteUnitsStrip, columnEnd, endSecondTensStrip, rectEnd];
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
