// Import the discord.js module
const Discord = require("discord.js");
// Create an instance of a Discord client
const client = new Discord.Client();
//login token
client.login("NTc5OTI5NzE1NDk0NzQ4MTgw.Xb89xQ.KjeSk837XUCRZVnBA_yHryMYYBI");

//END INITIAL DISCORD STUFF

//for reading an excel file
const ExcelJS = require("exceljs");
//workbook object for ExcelJS
const workbook = new ExcelJS.Workbook();

//END INITIAL EXCELJS STUFF

const CurrentFileName = "../working_files/Grand Order Drop Rates.xlsx";
const CurrentSheetName = "Best 5 APDrop (JP)";

//END INITIAL EXCELJS STUFF

//this is used to access the sheet
getCurrentSheetFromExcelFile = function(fileName, sheetName, cb) {
    workbook.xlsx.readFile(fileName)
        .then(function() {
            let sheetArray = workbook.worksheets;
            //console.log(sheetArray);
            let currentSheet = workbook.getWorksheet(sheetName);
            //call back?
            cb(currentSheet);
        });
};

//returns an array where it finds the index
//in the form [Row, Column]
findStringInExcelSheet = function(string, excelSheet, cb) {
    let returnArray = [];
    for(let i = 5; i < 220; i++) {
        //making it so it works without uppercaseing
        if (excelSheet.getCell(i, 3).text === string || excelSheet.getCell(i, 3).text.toUpperCase() === string.toUpperCase()) {
            returnArray = [3, i];
            cb(returnArray);
            return;
        }
    }
    for(let i = 5; i < 220; i++) {
        if (excelSheet.getCell(i, 19).text === string || excelSheet.getCell(i, 19).text.toUpperCase() === string.toUpperCase()) {
            returnArray = [19, i];
            cb(returnArray);
            return;
        }
    }
    //you get no error, you screw up you get nothing.
    return;
};

buildStringForGetMaterial = function(currentSheet, itemLocation, cb) {
    let buildArray = [];
    //these two are just to make reading the code a bit easier, they don't really do anything.
    let startingRow = itemLocation[1];
    let startingColumn = itemLocation[0];
    let returnString = "";

    //make sure to fill each of the 5 spaces in the array with ""
    //also fills the array with the info
    for (let i = 0; i < 5; i++) {
        buildArray.push(
            //Grabs the area
            currentSheet.getCell((startingRow + i), (startingColumn + 3)).text +
            //Grabs the quest
            " - " + currentSheet.getCell((startingRow + i), (startingColumn + 4)).text +
            //Grabs the AP cost
            " Node Cost: " + currentSheet.getCell((startingRow + i), (startingColumn + 5)).text +
            //grabs the drop chance
            " Drop Chance: " + currentSheet.getCell((startingRow + i), (startingColumn + 9)).text + "%."
        );
    }

    for(let i = 0; i < buildArray.length; i++) {
        returnString += buildArray[i] + "\n";
    }

    cb(returnString);
};

/*
//Something that is no longer used
buildStringForMaterialListOne = function(excelSheet, cb) {
    let returnString = "";
    //helping for spacing
    let secondaryCounter = 0;
    //counter to reset every 35
    let anotherCounter = 35;
    for (let i = 5; i < 220; i += 5) {
        //making it so it works without uppercase
        if ((i - secondaryCounter) % 15 === 0) {
            returnString += excelSheet.getCell(i, 3).text;
            returnString.trimEnd();
            returnString += "\n";
        }
        else {
            returnString += excelSheet.getCell(i, 3).text.padEnd(40);
        }
        //dealing with weird spacing on the sheet
        if (i === anotherCounter) {
            i += 2;
            //needs to be incremented by 37 to keep up with i
            anotherCounter += 37;
            //this one also needs to go up by 2
            secondaryCounter += 2;
        }
    }

    cb(returnString);
};
//had to split up the function
buildStringForMaterialListTwo = function(excelSheet, cb) {
    let returnString = "";
    //helping for spacing
    let secondaryCounter = 0;
    //counter to reset every 35
    let anotherCounter = 35;
    for (let i = 5; i < 220; i += 5) {
        //making it so it works without uppercase
        if ((i - secondaryCounter) % 15 === 0) {
            returnString += excelSheet.getCell(i, 19).text;
            returnString.trimEnd();
            returnString += "\n";
        }
        else {
            returnString += excelSheet.getCell(i, 19).text.padEnd(40);
        }
        //dealing with weird spacing on the sheet
        if (i === anotherCounter) {
            i += 2;
            //needs to be incremented by 37 to keep up with i
            anotherCounter += 37;
            //this one also needs to go up by 2
            secondaryCounter += 2;
        }
    }

    cb(returnString);
};
*/

//makes a string return for everything in the commandList
buildCommandListString = function(list) {
    let buildString = "";
    for(let i = 0; i < commandList.length; i++) {
        buildString += commandList[i][0] + "\n";
        for(let j = 1; j < commandList[i].length; j++) {
            buildString += "\t- " + commandList[i][j] + "\n";
        }
    }
    buildString = buildString.trimEnd();

    return buildString;
};

const commandList = [];
//commandList[0] is fgo commands
commandList[0] = (["fgo"]);
    commandList[0].push("<fgo getMat \"Material Name\"");
    commandList[0].push("<fgo MaterialList");
//commandList[1] is general commands
commandList[1] = (["general"]);
    commandList[1].push("<GetProfilePicture");
    commandList[1].push("<ping");

console.log(commandList);
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on("ready", () => {
    console.log("I am ready!");
});


// Create an event listener for messages
client.on("message", message => {
    //make sure the bot doesn't talk to itself
    if (message.author.toString().toUpperCase() !== "Application".toUpperCase()) {
        let currentNormalizedMessage = message.content.toUpperCase();
        //returns a link to the pfp
        if (currentNormalizedMessage === "<getProfilePicture".toUpperCase()) {
            message.channel.send(message.author.displayAvatarURL);
        }
        //for the fgo stuff
        if (currentNormalizedMessage.startsWith("<fgo".toUpperCase())) {
            //splits their input
            let currentMessage = currentNormalizedMessage.split(" ");
            if (currentMessage[1] === "materialList".toUpperCase()) {
                message.channel.send("https://gamepress.gg/grandorder/materials");
                return;
                //a relic from the past
                /*
                getCurrentSheetFromExcelFile(CurrentFileName, CurrentSheetName, function(currentSheet) {
                    buildStringForMaterialListOne(currentSheet, function(returnVar) {
                        message.channel.send(returnVar);
                    });
                    buildStringForMaterialListTwo(currentSheet, function(returnVar) {
                        message.channel.send(returnVar);
                    });
                });
                */
            }
            if (currentMessage[1] === "getMat".toUpperCase()) {
                //makes an empty string for building the input for the function
                let currentSearchString = "";
                //this can't start at 0 because it needs to skip the <fgo
                //then can't start at 1 because it needs to skip the
                for (let i = 2; i < currentMessage.length; i++) {
                    currentSearchString += currentMessage[i] + " ";
                }
                //gets rid of the ending space
                currentSearchString = currentSearchString.trimEnd();


                //calls the function, then sends the message it returns
                getCurrentSheetFromExcelFile(CurrentFileName, CurrentSheetName, function(currentSheet) {
                    findStringInExcelSheet(currentSearchString, currentSheet, function(returnVar) {
                        buildStringForGetMaterial(currentSheet, returnVar, function(returnString) {
                            message.channel.send(returnString);
                        });
                    });
                });
                //END getMat call
            }
            //END <fgo call
        }

        //fun stuff
        if (currentNormalizedMessage === "<ping".toUpperCase()) {
            message.channel.send("Pong");
        }

        //prints out all commands
        if (currentNormalizedMessage === "<help".toUpperCase()) {
            message.channel.send(buildCommandListString());
        }
    }

});

