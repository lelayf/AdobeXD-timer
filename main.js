/*
*  Countdown Timer Adobe XD plugin
 * This lets the user create all elements for a countdown timer to auto-animate between two artboards.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */

var {Text, Rectangle, Color} = require("scenegraph") ;
let commands = require("commands") ;
const h = require("./h") ;
const fs = require("uxp").storage.localFileSystem ;

let dialog ;
let pluginDataFolder ;
let settingsFile ; 
let settings;
let startTimeValue, endTimeValue, colorValue, fontSizeValue, fontFamilyValue;


// async function getSettingsFile(pluginDataFolder) {
//     settingsFile = await pluginDataFolder.getEntry("timer-settings.txt");
// }


// async function readSettings() {
//     settings = await settingsFile.read();
// }

async function doSettings(){
    
    pluginDataFolder = await fs.getDataFolder() ;
    settingsFile = await pluginDataFolder.getEntry("timer-settings.txt");
    settings = await settingsFile.read();      
    console.log("plugindatafolder=" + pluginDataFolder);

    // getSettingsFile(pluginDataFolder);
    // readSettings();
    console.log("settingsFile=" + settingsFile);
    console.log("settings=" + settings);
    
    if(settings === undefined) {
        console.log("using default settings");
        [startTimeValue, endTimeValue, colorValue, fontSizeValue, fontFamilyValue] = 
            ["23:17", "07:44", "#ff0000", "30", "Arial"] ;    
    } else {
        console.log("using previous settings");
        var settingsObj = JSON.parse(settings) ;
        [startTimeValue, endTimeValue, colorValue, fontSizeValue, fontFamilyValue] = [settingsObj.startTime, settingsObj.endTime, settingsObj.color, settingsObj.fontSize, settingsObj.fontFamily] ;
    }
}

async function getDialog(selection) {

    console.log("hello dialog");

    if (dialog == null) {

        console.log("hello dialog 2");

        async function onsubmit() {
            console.log("onsubmit plugindatafolder=" + pluginDataFolder);

            let values = {
                startTime: startTime.value,
                endTime: endTime.value,
                color: color.value,
                fontSize: fontSize.value,
                fontFamily: fontFamily.value
                //fontFamily: fontFamily.options[Math.max(0, fontFamily.selectedIndex)].value
            }
            
            const JSONValues = JSON.stringify(values) ;

            console.log("onsubmit: " + JSONValues);
            
            let newFile = await pluginDataFolder.createEntry("timer-settings.txt", {overwrite: true}) ;
            await newFile.write(JSONValues) ;

            await createMaskedTextStrips( selection,
                                    startTime.value,
                                    endTime.value ) ;
    
            //  dialog is automatically closed after submit unless you call e.preventDefault()
            dialog.close();    
        }
                        
        let startTime, endTime, color, fontSize, fontFamily ;

        console.log("startTimeValue" + startTimeValue);

        dialog =
            h("dialog",
                h("form", { method:"dialog", style: { width: 320 }, onsubmit },
                    h("div", { class: "row" },
                        h("label",
                            h("span", "Start Time (mm:ss)"),
                            startTime = h("input", { value: startTimeValue })
                        ),
                        h("label",
                            h("span", "End Time (mm:ss)"),
                            endTime = h("input", { value: endTimeValue })
                        )
                    ),
                    h("div", { class: "row" },
                        h("label",
                            h("span", "Font Color hex #"),
                            color = h("input", { value: colorValue })
                        )
                    ),
                    h("div", { class: "row" },
                        h("label",
                            h("span", "Font size (px)"),
                            fontSize = h("input", { value: fontSizeValue })
                        )
                    ),
                    h("div", { class: "row" },
                        h("label",
                            h("span", "Font family"),
                            fontFamily = h("input", { value: fontFamilyValue })
                        )
                    ),
                    h("footer",
                        h("button", { uxpVariant: "primary", onclick(e) { dialog.close("Cancelled") } }, "Cancel"),
                        h("button", { uxpVariant: "cta", type:"submit", onclick(e) { onsubmit(); e.preventDefault() } }, "Create Timer Elements")
                )
            )
        );

        return dialog;        
    }
}

async function createMaskedTextStrips(selection, startTime, endTime) {

    const x = 20 ;
    const y = 50 ;

    // const start = selection.items[0].text ;
    // const end   = selection.items[1].text ;
    const start = startTime ;
    const end   = endTime ;

    const startMinuteTens   = start[0] ;
    const startMinuteUnits  = start[1] ;
    const startSecondTens   = start[3] ;
    const startSecondUnits  = start[4] ;

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
    startMinuteTensStrip.text   += startMinuteTens;
    endMinuteTensStrip.text     = startMinuteTensStrip.text;  

    // Minutes units
    startMinuteUnitsStrip.text = new String("");
    var j = endMinute; 
    while( j < startMinute ){
        startMinuteUnitsStrip.text += new String(j%10);
        startMinuteUnitsStrip.text += "\n";
        j += 1;
    }
    startMinuteUnitsStrip.text  += startMinuteUnits;
    endMinuteUnitsStrip.text    = startMinuteUnitsStrip.text;  

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

    // Seconds units 
    startSecondUnitsStrip.text   = new String("") ;
    var fastCycles = 10-Number(endSecondUnits)+Number(startSecondUnits)+(cycles-1)*10 ; 
    console.log("fastCycles=" + fastCycles) ;
    for( var j=0; j< fastCycles; j++){
        startSecondUnitsStrip.text += new String( (Number(endSecondUnits)+j) % 10 ) ;
        startSecondUnitsStrip.text += "\n";
    }
    startSecondUnitsStrip.text += startSecondUnits;
    endSecondUnitsStrip.text = startSecondUnitsStrip.text;  


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

    startSecondUnitsStrip.fill = new Color("#FF0000");     
    startSecondUnitsStrip.fontSize = 30 ;
    startSecondUnitsStrip.lineSpacing = startSecondUnitsStrip.fontSize + 4;

    endSecondUnitsStrip.fill = new Color("#FF0000");     
    endSecondUnitsStrip.fontSize = 30 ;
    endSecondUnitsStrip.lineSpacing = endSecondUnitsStrip.fontSize + 4;


    // add to artboards
    await selection.items[0].addChild(startMinuteTensStrip); 
    await selection.items[0].addChild(startMinuteUnitsStrip);   
    await selection.items[0].addChild(columnStart);
    await selection.items[0].addChild(startSecondTensStrip);   
    await selection.items[0].addChild(startSecondUnitsStrip);
    await selection.items[1].addChild(endMinuteTensStrip); 
    await selection.items[1].addChild(endMinuteUnitsStrip);
    await selection.items[1].addChild(columnEnd);
    await selection.items[1].addChild(endSecondTensStrip);
    await selection.items[1].addChild(endSecondUnitsStrip);   

    // selection.items[0].parent.addChild(startMinuteTensStrip); 
    // selection.items[0].parent.addChild(startMinuteUnitsStrip);   
    // selection.items[0].parent.addChild(columnStart);
    // selection.items[0].parent.addChild(startSecondTensStrip);   
    // selection.items[0].parent.addChild(startSecondUnitsStrip);
    // selection.items[1].parent.addChild(endMinuteTensStrip); 
    // selection.items[1].parent.addChild(endMinuteUnitsStrip);
    // selection.items[1].parent.addChild(columnEnd);
    // selection.items[1].parent.addChild(endSecondTensStrip);
    // selection.items[1].parent.addChild(endSecondUnitsStrip);   


    // reposition
    startMinuteTensStrip.height = minuteTensSpan * startMinuteTensStrip.lineSpacing - 1 ; 
    await startMinuteTensStrip.moveInParentCoordinates(x, 34-startMinuteTensStrip.height);   
    startMinuteUnitsStrip.height = minuteSpan * startMinuteUnitsStrip.lineSpacing - 1 ; 
    await startMinuteUnitsStrip.moveInParentCoordinates(x+20, 34-startMinuteUnitsStrip.height); 
    await columnStart.moveInParentCoordinates(x+40,34);
    startSecondTensStrip.height = cycles * startSecondTensStrip.lineSpacing - 1 ; 
    await startSecondTensStrip.moveInParentCoordinates(x+50, 34-startSecondTensStrip.height); 
    startSecondUnitsStrip.height = fastCycles * startSecondUnitsStrip.lineSpacing - 1 ; 
    await startSecondUnitsStrip.moveInParentCoordinates(x+70, 34-startSecondUnitsStrip.height); 
 
    await endMinuteTensStrip.moveInParentCoordinates(x, 34);   
    await endMinuteUnitsStrip.moveInParentCoordinates(x+20, 34);
    await columnEnd.moveInParentCoordinates(x+40, 34);
    await endSecondTensStrip.moveInParentCoordinates(x+50, 34);
    await endSecondUnitsStrip.moveInParentCoordinates(x+70, 34);

    // add masks 
    const rectStart = new Rectangle();
    rectStart.width = 180;
    rectStart.height = 34;
    rectStart.name = "Mask" ; 
    await selection.items[0].addChild(rectStart); 
    // selection.items[0].parent.addChild(rectStart); 
    await rectStart.moveInParentCoordinates(0,8);

    const rectEnd = new Rectangle();
    rectEnd.width = 180;
    rectEnd.height = 34;
    rectEnd.name = "Mask" ; 
    await selection.items[1].addChild(rectEnd); 
    // selection.items[1].parent.addChild(rectEnd); 
    await rectEnd.moveInParentCoordinates(0,8);

    selection.items = [startMinuteTensStrip, startMinuteUnitsStrip, columnStart, startSecondTensStrip, startSecondUnitsStrip, rectStart];
    await commands.createMaskGroup();
    let startMaskedGroup = selection.items[0];
    startMaskedGroup.name = "CounterMask" ;

    selection.items = [endMinuteTensStrip, endMinuteUnitsStrip, columnEnd, endSecondTensStrip, endSecondUnitsStrip, rectEnd];
    await commands.createMaskGroup();
    let endMaskedGroup = selection.items[0];
    endMaskedGroup.name = "CounterMask" ;   

}

module.exports = {
    commands: {
        makeCountdownTimer : async function (selection, documentRoot) {
            (async () => {
                await doSettings();
                dialog = await getDialog(selection);
                document.body.appendChild(dialog).showModal();
            })();
        }
    }
};
