const Discord = require("discord.js");
const client = new Discord.Client();

client.on("message", message => {
    if (!message.content.startsWith("!") || message.author.bot)
        return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "help") {
        printHelpMessage(message);
    } else if (command === "roll") {
        if (args.length < 2) {
            printHelpMessage(message);
            return;
        }
    
        // Parses and sets the parameters of the command to variables.
        var type = args[0];
        var xy = parseInt(args[1]);
        var z = args.length == 3 ? parseInt(args[2]) : 6;
    
        if (xy < 1 && type !== "init") {
            printMessage(message, "Are you trying to be funny? You can't roll fewer than 1 die...")
        } else if (xy > 100 && type !== "init") {
            printMessage(message, "Really? As if you'd need to roll that many. Let's be realisitc and try with fewer.");
        } else {
            roll(message, type, xy, z);
        }
    }
});

// Prints the help message on how to use the bot.
// TODO improvement, e.g. using embed.
function printHelpMessage(message) {
    var helpmsg = "";
    helpmsg += "World of Darkness Dice Bot v1.0.1\n\n";
    helpmsg += "Usage: !roll _RollType_ [_Option1_] [_Option2_]\n\n";
    helpmsg += "RollTypes" + 
        "\n\t\t`init` - An initiative roll." + 
        "\n\t\t`norm` - A normal roll." + 
        "\n\t\t`spec` - A specialisation roll.\n\n";
    helpmsg += "Option1" + 
        "\n\t\t`Initiative Modifier` - The modifier that is added on top of the roll" + 
        "\n\t\t`Dice Count` - Only applicable with RollTypes `norm` and `spec`. Specifies the amount of d10 to be rolled.\n\n";
    helpmsg += "Option2" +
        "\n\t\tOnly applicable with RollTypes `norm` and `spec`. Specifies the skill difficulty." + 
        "\n\t\tOptional. Only has to specified if difficulty differs from the default value of 6.\n\n";
    helpmsg += "Source Code available at <https://github.com/blgraf/WoD-Dice-Bot>";
    printMessage(message, helpmsg);
}

// The bones of the bot.
// Rolls accordig to the parameters and then sends a message with the corresponding result.
function roll(message, type, xy, z) {
    switch(type) {
        // The "normal" roll type.
        case "norm":
            var succ = 0;
            var fails = 0;
            var rolls = [];
            for (var i = 0; i < xy; i++) {
                var r = singleRoll();
                rolls.push(r);
                if (r >= z) 
                    succ++;
                else if (r == 1)
                    fails++;
            }
            // To handle the result and send the message with the conclusion.
            result(message, succ, fails, rolls);
            break;

        // The "specialisation" roll type.
        // Basically the same as "normal", except for each "10", you get another roll.
        case "spec":
            var succ = 0;
            var fails = 0;
            var rolls = [];
            for (var i = 0; i < xy; i++) {
                var r = singleRoll();
                rolls.push(r);
                if (r >= z) {
                    succ++;
                    if (r == 10) 
                        xy++;
                } else if (r == 1) {
                    fails++;
                } 
            }
            // To handle the result and send the message with the conclusion.
            result(message, succ, fails, rolls);
            break;

        // The "initiative" roll type.
        // Very basic - only the initiavie modifier parameter gets added to the roll and sent as a message.
        case "init":
            var r = singleRoll();
            var res = r + xy;
            printMessage(message, "<@" + message.author + "> rolled a: " + r + "\nResult: " + res);
            break;

        // Any other case (i.e. bad parameter) opens the help method.
        default:
            printMessage(message, "The given RollType is unknown to me.\nValid RollTypes are: `init`, `norm` and `spec`.");
            break;
    }
}

// Interprets the result using the amount of successes and fails according to the rules provided to the author.
// Then sends a message with a mention to the User that called the bot and the rolls made in a very simplistic manner.
// TODO Nicer display.
function result(message, succ, fails, rolls) {
    var res = "<@" + message.author + "> rolled : " + rolls;

    if ((succ == 0 && fails == 0) || (succ > 0 && succ < fails) || succ == fails)
        res += "\nFailed roll!\nRolled " + succ + "x success.\nRolled " + fails + "x failure.";
    else if (succ == 0 && fails >= 0)
        res += "\nBotched roll!\nRolled " + succ + "x success.\nRolled " + fails + "x failure.";
    else if (succ > 0 && succ > fails)
        res += "\nSuccessful roll!\nRolled " + succ + "x success.\nRolled " + fails + "x failure.";

    printMessage(message, res);
}

// Simply prints a given message while trying to avoid errors like exceeding the 2'000 char limit
function printMessage(originalMessage, messageToPrint) {
    try {
        originalMessage.channel.send(messageToPrint);
    } catch (err) {
        console.error("While trying to print the message:\n\n" + messageToPrint);
        console.error("The following error appeared:\n" + err);
    }
}

// Returns a random value between 1 and 10.
// Put into a singular method for more readability.
function singleRoll() {
    return Math.ceil(Math.random() * 10);
}

// Login. Empty due to security.
client.login("ADD TOKEN HERE");
