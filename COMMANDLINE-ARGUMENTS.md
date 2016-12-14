# Commandlinearguments
```help``` - Shows this help.
```--connect <my-connection-name>``` Uses the connection configuration in ```.discord-shell-slave-rc```.
```--config </path/to/my/.discord-shell-slave-rc>``` Optional. If you do not pass a ```--config``` parameter, discord-shell-slave will search in parent folders for ```.discord-shell-slave-rc```.

## .discord-shell-slave-rc example

Create a token at https://discordapp.com/developers/applications/me

```javascript
{
    "my-connection-name" : {
        "channel" : "General",
        "token" : "M*U4N*MwO****4NDg0M*I0.CzMGvA****iGcZW******" 
    }
}
```

## Example
```echo hello world | discord-shell-slave --connect my-connection-name --config /path/to/my/.discord-shell-slave-rc```