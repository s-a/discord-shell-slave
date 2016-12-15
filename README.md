# discord-shell-slave
![alt tag](ericlemerdy-Callout-chat-300px.png)

**Why?**  
*I' d like to allow a shell process to send Discord chat  messages.*

**How?**  
*You just need to pipe text input into ```discord-shell-slave```.*


**discord-shell-slave... Isn' t it a little bit long?**  
*Yes it is. There exists an alias called ```dss```.*

**I' d like to know more.**  
*In fact any shell script can send a Discord chat message now. So you do not need any coder skills to use it. If you have coding skills [QWMI](https://github.com/s-a/qwmi) is a good example which supports the enhanced JSON structure.*

**JSON structure?**  
```dss``` will parse piped string data into a  JSON object if it is a valid JSON string. If not it will take the string and send a simple text message. If it is JSON ```dss``` expects the following structure.
```javascript
{
  color : "0x3498db",
  title : "test",
  author : {name : "discord-shell-slave"},
  fields : [{name:"Message", value: "Hello"}]
}
```

**How to install it on my machine?**
```bash
npm i -g discord-shell-slave
```

**No configuration?**  
*For shure you need one. You need to create a file called ```.discord-shell-slave-rc``` in the current working directory of your shell or in one of its parent directories.*
```javascript
{
    "my-connection-name" : {
        "channel" : "General",
        "token" : "M*U4N*MwO****4NDg0M*I0.CzMGvA****iGcZW******"
    }
}
```

**How to use it?**
```bash
echo hello world | discord-shell-slave --connect my-connection-name
```
*If you want to pass the the configuration file as parameter you can use ```--config``` with an absolute or relative path to the current working directory.*
```bash
echo hello world | discord-shell-slave --connect my-connection-name --config /path/to/my/.discord-shell-slave-rc
```

[for more details see  COMMANDLINE-ARGUMENTS.md](/COMMANDLINE-ARGUMENTS.md)
