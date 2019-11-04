// Import the discord.js module
const Discord = require("discord.js");
// Create an instance of a Discord client
const client = new Discord.Client();
//login token
client.login("NTc5OTI5NzE1NDk0NzQ4MTgw.Xb89xQ.KjeSk837XUCRZVnBA_yHryMYYBI");

//END INITIAL DISCORD STUFF

//moved all the command calls to this
const commandModule = require("../discord_bot/commands");

//moved all other general functions to here
const generalFunctions = require("../discord_bot/general_functions.js");

const CurrentFileName = "../working_files/Grand Order Drop Rates.xlsx";
const CurrentSheetName = "Best 5 APDrop (JP)";


//console.log(commandList);
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
                message.channel.send(commandModule.getMaterial());
                return;
            }
            if (currentMessage[1] === "getMat".toUpperCase()) {
                commandModule.getMaterial(currentMessage, CurrentFileName, CurrentSheetName, function(returnVal) {
                    message.channel.send(returnVal);
                });
            }
        }

        //fun stuff
        if (currentNormalizedMessage === "<ping".toUpperCase()) {
            message.channel.send("Pong");
        }

        //prints out all commands
        if (currentNormalizedMessage === "<help".toUpperCase()) {
            message.channel.send(generalFunctions.buildCommandListString());
        }
    }

});

