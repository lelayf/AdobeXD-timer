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

function createText(selection, startDigit, endDigit, pos, x, y) {

    console.log(startDigit + " " + endDigit);
    console.log(typeof(startDigit));
    
    const startTime = selection.items[0].text;
    const endTime = selection.items[1].text;
    const previousStart = Number(startTime[pos-1]);
    const previousEnd = Number(endTime[pos-1]);
    const replication = previousStart-previousEnd;

    const startStrip = new Text();
    const endStrip = new Text();
    const sd = Number(startDigit); // 1
    const ed = Number(endDigit);   // 0
    
    if(pos == 0){
        var j = sd ;
        startStrip.text = new String("");
        while( j > ed ){
            startStrip.text += new String(j);
            startStrip.text += "\n";
            j -= 1;          
        }
        startStrip.text += endDigit;
    }

    if(pos == 1){
        var j = sd ;
        startStrip.text = new String("");
        var appends = 0;
        while( appends < (replication*10)-1 ){
            // while( j > ed ){
            startStrip.text += new String(j);
            startStrip.text += "\n";
            j -= 1;
            if(j <0) {
                j = 9;
            }
            appends +=1;
        }
        startStrip.text += endDigit;
    }

    endStrip.text = startStrip.text; 

    console.log(startStrip + " " + endStrip);
    // console.log(typeof(startDigit));


    startStrip.fill = new Color("#FF0000");     
    startStrip.fontSize = 30;
    endStrip.fill = new Color("#FF0000");     
    endStrip.fontSize = 30;

    console.log(selection.items[0].parent);
    console.log(selection.items[1].parent);
    selection.items[0].parent.addChild(startStrip); 
    //selection.insertionParent.addChild(startStrip);   
    selection.items[1].parent.addChild(endStrip);   
    //selection.insertionParent.addChild(endStrip);   

    startStrip.moveInParentCoordinates(x, y);   
    endStrip.moveInParentCoordinates(x, y);   
}

function makeAnimationStrips(selection) {

    // Go to Plugins > Development > Developer Console to see this log output
    const startTime = selection.items[0].text;
    const endTime = selection.items[1].text;

    console.log(startTime + " " + endTime);

    createText(selection, startTime[1], endTime[1], 1, 20+(0*30), 50);
    // for( var i=0; i< startTime.length; i++){
    //     createText(selection, startTime[i], endTime[i], i, 20+(i*30), 50);
    // }    
}


module.exports = {
    commands: {
        countdownTimer,
        makeAnimationStrips
    }
};
