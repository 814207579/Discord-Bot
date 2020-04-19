"use strict";
// Import the discord.js module
const Discord = require("discord.js");
// Create an instance of a Discord client
const client = new Discord.Client();

try {
    //grabs the login token from a file
    const fs = require("fs");
    const botTokenLocation = "../working_files/discord_bot_token.txt";
    const botToken = fs.readFileSync(botTokenLocation).toString();
    //login token
    client.login(botToken);
} catch (e) {
    console.log(e);
}
//needed discord login stuff above

//moved all the command calls to this
const commandModule = require("../discord_bot/commands");
//moved all other general functions to here
const generalFunctions = require("../discord_bot/general_functions.js");



//console.log(commandList);
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on("ready", () => {
    console.log("I am ready!");
});

//this is in global so I can use it to check on each time the bot gets a message
let currentMessage;
//this is global for the last edited message
let lastEditedMessage;

// Create an event listener for messages
client.on("message", message => {
    //this is so the bot won't loop, it's reset later
    let normalizedMessageAuthor = message.author.toString().toUpperCase();
    //make sure the bot doesn't talk to itself
    //or make sure it doesn't send the same message twice
    if (normalizedMessageAuthor !== "Application".toUpperCase()) {
        currentMessage = message.toString();
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
                commandModule.getMaterial(currentMessage, function(returnVal) {
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

        if (currentNormalizedMessage === "<getStatus".toUpperCase()) {
            message.channel.send(message);
        }

        if (currentNormalizedMessage.startsWith("<checkEdit".toUpperCase())) {
            message.channel.send(lastEditedMessage);
        }

        //these two ifs handle making pulls
        if (currentNormalizedMessage.startsWith("<startPull".toUpperCase())) {
            let splitMessage = message.toString().split(" ");
            let pullString = splitMessage[1];
            let totalTime = splitMessage[2];
            message.channel.send("Starting-Pull: " + pullString + " " + totalTime);

        }
        if (currentNormalizedMessage.startsWith("Starting-Pull".toUpperCase())) {
            let splitMessage = message.toString().split(" ");
            let pullString = splitMessage[1];
            let totalTime = splitMessage[2];
            generalFunctions.startPull(client, message, pullString, totalTime);
        }
    }


    /*
    message.react('👍').then(() => message.react('👎'));

    const filter = (reaction, user) => {
        return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    message.awaitReactions(filter, { max: 1, time: 2000, errors: ['time'] })
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
     */



});

client.on("messageUpdate", messageUpdate => {
    let messageAuthor = (messageUpdate.author.username.toString());
    lastEditedMessage = (messageAuthor + "'s message before edit was: " + messageUpdate.toString());
});

client.on("messageReaction", messageReaction => {
    messageReaction.message.channel.send("test");
});




