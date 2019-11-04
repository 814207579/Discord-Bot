let excelJSFunctions = require("../discord_bot/exceljs_functions");
//location of excel workbook, and the sheet name in use.
const CurrentFileName = "../working_files/Grand Order Drop Rates.xlsx";
const CurrentSheetName = "Best 5 APDrop (JP)";

module.exports = {

    getMaterial: function(currentMessage, cb) {
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
        excelJSFunctions.getCurrentSheetFromExcelFile(CurrentFileName, CurrentSheetName, function(currentSheet) {
            excelJSFunctions.findStringInExcelSheet(currentSearchString, currentSheet, function(returnVar) {
                excelJSFunctions.buildStringForGetMaterial(currentSheet, returnVar, function(returnString) {
                    cb(returnString);
                });
            });
        });
    },

    getMaterialList: function () {
        return("https://gamepress.gg/grandorder/materials")
    }
};