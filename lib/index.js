#!/usr/bin/env node

"use strict";

var Cli = new require("n-cli");
var argv = require('minimist')(process.argv.slice(2));
var Discordie = require("discordie");
var Events = Discordie.Events;

var runcomFilename = argv.config || ".discord-shell-slave-rc";
var cli = new Cli({
	silent: false,
	handleUncaughtException : true,
	runcom : runcomFilename
});

process.on("uncaughtException", function(){
	process.exit(1);
});

process.on("unhandledRejection", function(e){
	cli.stderr(cli.color.bgRed("error\n"));
	cli.log(e);
	process.exit(1);
});

function IsJsonString(str) {
	var r;
    try {
        r = JSON.parse(str);
		r.test = true;
    } catch (e) {
        return false;
    }
    return true;
}


var run = function(stdin){
	

	if (argv._[0] !== "help" && (!stdin || stdin.trim() === "")){
		console.log(argv)
		throw new cli.Error("input-not-found", "no piped input detected.")
	}

	var input = {}
	if (IsJsonString(stdin)){ 
		input = JSON.parse(stdin);
		input.color = parseInt(input.color, 16)
	} else {
		input.color = 0x3498db; 
		input.author = {name : "discord-shell-slave"}; 
		input.fields = [{name:"Message", value: stdin}];
	}
	input.footer= {text: "system time"};
	input.timestamp = new Date().toISOString();
 
	if (argv._[0] !== "help"){ 
		cli.runcom(function(rc){ 
			if (!rc){
				throw new cli.Error("config-file-not-found", "file `" + runcomFilename + "` could not be found in parent folders");
			}
			
			var connectionName = this.argv.notNull("connect");
			var config = rc.settings[connectionName];
			if (!config){
				throw new cli.Error("connection-config-not-found", "Configuration `" + connectionName +"` in file `" + runcomFilename + "` not found")
			}
			
				

			var client = new Discordie({
				autoReconnect : false
			});
			

			client.Dispatcher.on(Events.GATEWAY_READY, e => { 
				cli.stdout(cli.color.green("Connected as: " + client.User.username + "\n"));
				client.User.setStatus({game : config.game});

				var guild = client.Guilds.find(g => g.name == connectionName);

				if (!guild){
					throw new cli.Error("guild-not-found", "A guild named `" + connectionName + "` could not be found.")
				}
				
				var channel = client.Channels.find(g => g.name == config.channel);
				if (!channel){
					throw new cli.Error("channel-not-found", "A channel named `" + config.channel + "` could not be found.")
				}

				cli.stdout(cli.color.yellow("sending message...\n"));
				channel.sendMessage("Something important has occured. Please check what its going on. Here are the Details...", false, input).then(function(){
					client.disconnect();
					cli.stdout(cli.color.green("done.\n"));
				}).catch(function(err){
					cli.stderr(err.response.error + "\n");
					client.disconnect();
					cli.stdout(cli.color.red("error.\n"));
					process.exit(1);
				});

			});

			client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
				if (e.message.content.toLowerCase().indexOf("marco") !== -1){
					e.message.channel.sendMessage("polo");
				}
			});

			client.connect({
				token: config.token
			});
		}); 
	}

} ;


var input = "";
if (process.stdin.isTTY) { 
	run(input); 
} else {
	process.stdin.setEncoding('utf8'); 
	process.stdin.on('readable', () => {
		let chunk;

		while ((chunk = process.stdin.read())) {
			input += chunk;
		}
	});

	process.stdin.on('end', () => { 
		run(input); 
	});
}