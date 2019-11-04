//for reading an excel file
const ExcelJS = require("exceljs");
//workbook object for ExcelJS
const workbook = new ExcelJS.Workbook();


module.exports = {

    //this is used to access the sheet
    getCurrentSheetFromExcelFile: function(fileName, sheetName, cb) {
        workbook.xlsx.readFile(fileName)
            .then(function() {
                //console.log(sheetArray);
                let currentSheet = workbook.getWorksheet(sheetName);
                //call back?
                cb(currentSheet);
            });
    },

    //returns an array where it finds the index
    //in the form [Row, Column]
    findStringInExcelSheet: function(string, excelSheet, cb) {
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
    },

    buildStringForGetMaterial: function(currentSheet, itemLocation, cb) {
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
                " Drop Chance: " + Number((currentSheet.getCell((startingRow + i), (startingColumn + 9)).text).toString()).toFixed(1) + "%."
            );
        }

        for(let i = 0; i < buildArray.length; i++) {
            returnString += buildArray[i] + "\n";
        }

        cb(returnString);
    },
};