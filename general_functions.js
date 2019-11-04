const commandList = [];
//commandList[0] is fgo commands
commandList[0] = (["fgo"]);
commandList[0].push("<fgo getMat \"Material Name\"");
commandList[0].push("<fgo MaterialList");
//commandList[1] is general commands
commandList[1] = (["general"]);
commandList[1].push("<GetProfilePicture");
commandList[1].push("<ping");

module.exports = {

    //makes a string return for everything in the commandList
    buildCommandListString: function () {
        let buildString = "";
        for (let i = 0; i < commandList.length; i++) {
            buildString += commandList[i][0] + "\n";
            for (let j = 1; j < commandList[i].length; j++) {
                buildString += "\t- " + commandList[i][j] + "\n";
            }
        }
        buildString = buildString.trimEnd();

        return buildString;
    },

};