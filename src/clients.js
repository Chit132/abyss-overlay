const fs = require('fs');
const config = require('electron-json-config');


class Clients {
    constructor(homedir, chosen) {
        const clients = {
            'darwin': {
                'badlion': config.get('badlionlog', `${homedir}/Library/Application Support/minecraft/logs/blclient/minecraft/latest.log`),
                'vanilla': config.get('vanillalog', `${homedir}/Library/Application Support/minecraft/logs/latest.log`),
                'pvplounge': config.get('pvploungelog', `${homedir}/Library/Application Support/.pvplounge/logs/latest.log`),
                'labymod': config.get('labymodlog', `${homedir}/Library/Application Support/minecraft/logs/fml-client-latest.log`),
                'feather': config.get('featherlog', `${homedir}/Library/Application Support/minecraft/logs/latest.log`)
            },
            'win32': {
                'badlion': config.get('badlionlog', `${homedir}/AppData/Roaming/.minecraft/logs/blclient/minecraft/latest.log`),
                'vanilla': config.get('vanillalog', `${homedir}/AppData/Roaming/.minecraft/logs/latest.log`),
                'pvplounge': config.get('pvploungelog', `${homedir}/AppData/Roaming/.pvplounge/logs/latest.log`),
                'labymod': config.get('labymodlog', `${homedir}/AppData/Roaming/.minecraft/logs/fml-client-latest.log`),
                'feather': config.get('featherlog', `${homedir}/AppData/Roaming/.minecraft/logs/latest.log`)
            }
        }
        
        this._chosen = chosen;
        this.paths = clients[process.platform === 'darwin' ? 'darwin' : 'win32']
        this.paths.lunar = this.#detectLunar(homedir);
    }

    static logos = {
        'lunar': 'https://img.icons8.com/nolan/2x/lunar-client.png',
        'badlion': 'https://www.badlion.net/static/assets/images/logos/badlion-logo.png',
        'vanilla': 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png/revision/latest?cb=20190525093706',
        'pvplounge': 'https://www.saashub.com/images/app/service_logos/158/4d406mrxxaj7/large.png?1601167229',
        'labymod': 'https://www.labymod.net/page/tpl/assets/images/logo_web.png',
        'feather': 'https://i.imgur.com/9ZfHrCw.png'
    }

    static displayNames = {
        'lunar': 'Lunar',
        'badlion': 'Badlion',
        'vanilla': 'Vanilla/Other',
        'pvplounge': 'PvP Lounge',
        'labymod': 'Labymod',
        'feather': 'Feather'
    }

    #detectLunar(homedir) {
        let logpath = config.get('lunarlog', -1);
        if (logpath === -1) {
            let log_18 = { path: `${homedir}/.lunarclient/offline/1.8/logs/latest.log`, modified: 0 };
            let log_189 = { path: `${homedir}/.lunarclient/offline/1.8.9/logs/latest.log`, modified: 0 };
            let log_multiver = { path: `${homedir}/.lunarclient/offline/multiver/logs/latest.log`, modified: 0 };
            if (fs.existsSync(log_18.path)) log_18.modified = fs.statSync(log_18.path).mtime;
            if (fs.existsSync(log_189.path)) log_189.modified = fs.statSync(log_189.path).mtime;
            if (fs.existsSync(log_multiver.path)) log_multiver.modified = fs.statSync(log_multiver.path).mtime;
            const modifiedLogs = [ log_18, log_189, log_multiver ];
            modifiedLogs.sort((a, b) => { return b.modified - a.modified });
            logpath = modifiedLogs[0].path;
        }
        return logpath;
    }

    autoDetect() {
        let max = {
            client: this._chosen,
            time: 0
        }

        for (const client in this.paths) {
            if (fs.existsSync(this.paths[client])) {
                const mtime = fs.statSync(this.paths[client]).mtime;
                if (mtime > max.time) {
                    max = {
                        client: client,
                        time: mtime
                    }
                }
            }
        }
        
        return [max.client, this.paths[max.client]];
    }

    get chosen() {
        return [this._chosen, this.paths[this._chosen]];
    }
}


module.exports = { Clients }