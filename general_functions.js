const commandList = [];
//commandList[0] is fgo commands
commandList[0] = (["fgo"]);
commandList[0].push("<fgo getMat \"Material Name\"");
commandList[0].push("<fgo MaterialList");
//commandList[1] is general commands
commandList[1] = (["general"]);
commandList[1].push("<GetProfilePicture");
commandList[1].push("<ping");
commandList[1].push("<getStatus");

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

    startPull: function (client, message, pullString, runTime) {
        message.edit(pullString);
        message.react('👍').then(() => message.react('👎'));

        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        message.awaitReactions(filter, { max: 2, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '👍') {
                    message.reply('you reacted with a thumbs up.');
                } else {
                    message.reply('you reacted with a thumbs down.');
                }
            })
            .catch(collected => {
                message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
            });
    }

};