const fs = require('fs');

module.exports = {
    name: 'notechannel',
    description: 'Takes 3 arguments. The source, the target, and the label. When you run it, it allows the addnote command to be run in the source to transfer notes to the target',
    execute(message, args) {
        //ensure there are enough arguments
        if (args.length < 3) {
            message.reply('Sorry, this command requires 3 arguments. The source ID, Target ID, and description')
            return;
        }
        //Use the first argument as source, remove it. Second as target, remove it. Concatenate the rest as description.
        let newLink = [args.shift(), args.shift(), args.join(' ')];

        //Read in the current array
        let rawData = fs.readFileSync('./channels.json');
        let channelArray = JSON.parse(rawData).channels;

        //This ensures there is no overlap between the different notes/discussion channel links
        for (const existingNote of channelArray) {
            for (i = 0; i < 2; i++) {
                if (existingNote[i] == newLink[i]) {
                    message.reply('Sorry, that channel is already used in a link');
                    return;

                }
            }
            if (existingNote[2] == newLink[2]) {
                message.reply('Sorry, that description is already used for a link');
                return;
            }
        }

        //Add the new item to the array
        channelArray.push(newLink);

        //Place it in an onject for formatting
        let jsonObject = {
            channels: channelArray
        }

        // Convert object to JSON and write it to the file
        let jsonString = JSON.stringify(jsonObject, null, '\t');
        console.log(jsonString);
        fs.writeFileSync('./channels.json', jsonString);

        message.reply('Link created');

    },
};