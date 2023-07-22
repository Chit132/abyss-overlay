const { app, BrowserWindow, globalShortcut, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const shell = require('electron').shell;
const electron_log = require('electron-log'); electron_log.catchErrors({ showDialog: true }); Object.assign(console, electron_log.functions);
const isDev = require('electron-is-dev');
const path = require('path');
const { exec } = require('child_process');
const { version } = require('./package.json');
require('dotenv').config({ path: path.join(__dirname, '.env') });
isDev && require('electron-reloader')(module)?.catch(() => {});

if (process.platform === 'win32') app.setAppUserModelId('AbyssOverlay');

try{require('electron-json-config');}
catch{
    if (process.platform !== 'darwin'){
        fs.writeFileSync(`${homedir}/AppData/Roaming/Abyss Overlay/config.json`, JSON.stringify({}));
    }
    else{
        fs.writeFileSync(`${homedir}/Library/Application Support/Abyss Overlay/config.json`, JSON.stringify({}));
    }
}
const config = require('electron-json-config');

let win, splash;
function createWindow(){
    splash = new BrowserWindow({width: 400, height: 400, transparent: true, frame: false, alwaysOnTop: true, skipTaskbar: true, show: false, webPreferences: {nodeIntegration: true, contextIsolation: false}});
    splash.loadFile('src/splash.html');
    win = new BrowserWindow({width: 800, height: 600, show: false, frame: false, transparent: true, resizable: true, useContentSize: true, maximizable: false, minWidth: 400, icon: __dirname+'/assets/logo.ico', alwaysOnTop: true, title: 'Abyss Overlay', focusable: false, skipTaskbar: false, hasShadow: true, webPreferences: {nodeIntegration: true, enableRemoteModule: true, contextIsolation: false}});
    win.loadFile('src/index.html');
    //win.webContents.openDevTools();
    win.on('closed', () => {win = null});
    splash.once('ready-to-show', () => {
        splash.show();
        setTimeout(() => {splash.destroy(); win.show(); checkForUpdate(); setTimeout(() => {win.setSkipTaskbar(false);}, 1000);}, 4500);
    });
    /*win.once('ready-to-show', () => {
        splash.destroy(); win.show();
    });*/
    win.setAlwaysOnTop(true);
    win.setVisibleOnAllWorkspaces(true);
    win.setMenu(null);
    win.webContents.setUserAgent(`${process.env.AGENT_NAME}/${version}`);
}

let keybinds = {}
let through = false;

function setKeybind(bind, keybind) {
    //unbind key
    if(!keybind){
        if(keybinds[bind]){ globalShortcut.unregister(keybinds[bind]); }
        keybinds[bind] = keybind;
        return;
    }

    //bind key
    switch (bind) {
      case 'peak':
            try {
                globalShortcut.register(keybind, () => {
                    if (win.isVisible()) win.hide();
                    else if (!win.isVisible()) { win.showInactive(); win.moveTop(); }
                }); 
            } catch (error) {
                console.log(`Error whilst setting "${bind}" to "${keybind}"` , error)
                break;
            }
         case 'clear':
            try {
                globalShortcut.register(keybind, () => {
                    win.webContents.send('clear')
                });
            } catch(error) {
                console.log(`Error whilst setting "${bind}" to "${keybind}"` , error)
                break;
            }
        case 'through':
            try {
                globalShortcut.register(keybind, () => {
                    through = !through;
                    if(through) win.setIgnoreMouseEvents(true);
                    else if(!through) win.setIgnoreMouseEvents(false);
                }); 
            } catch (error) {
                console.log(`Error whilst setting "${bind}" to "${keybind}"` , error)      
                break;
            }
      default:
        if(keybinds[bind]){ globalShortcut.unregister(keybinds[bind]); }
        keybinds[bind] = keybind;
        break;
    }
}

app.whenReady().then(() => {
    createWindow();
    setKeybind('peak', config.get('settings.keybinds.peak', null) ?? 'CommandOrControl+Shift+A')
    setKeybind('clear', config.get('settings.keybinds.clear', null) ?? 'CommandOrControl+Shift+Z')
    setKeybind('through', config.get('settings.keybinds.through', null) ?? 'CommandOrControl+Shift+T')
    if (isDev) {
        globalShortcut.register('CommandOrControl+Shift+F9', () => {
            win.webContents.openDevTools({mode: 'detach'});
        });
        globalShortcut.register('Ctrl+Alt+A', () => {
            win.webContents.send('test', 'hi testing');
        });
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

function checkForUpdate() {
    if (isDev) return;
    if (process.platform === 'win32') autoUpdater.checkForUpdates();
}

autoUpdater.on('update-downloaded', info => {
    const options = {
        type: 'info',
        title: `Abyss Overlay Update v${info.version} downloaded`,
        message: 'A new update has been downloaded. Updating is strongly recommended! Automatically restart overlay now and install?',
        detail: 'Overlay will automatically restart after update is installed',
        buttons: ['Yes', 'No'],
        icon: path.join(__dirname, 'assets', 'logo.ico'),
        defaultId: 0,
        checkboxLabel: 'Show update notes in browser'
    }
    dialog.showMessageBox(win, options).then(returned => {
        if (returned.checkboxChecked === true) shell.openExternal('https://github.com/Chit132/abyss-overlay/releases/latest');
        if (returned.response === 0) autoUpdater.quitAndInstall(true, true);
    });
    //console.log(info);
});

autoUpdater.on('error', (err) => {
    console.log(err);
    dialog.showMessageBox(win, {
        type: 'error',
        title: 'Auto-update error',
        message: 'There was an error auto-updating the overlay! Please install the new update manually ASAP',
        detail: 'Click "Take me there" to take you to the download page for the new version',
        buttons: ['Take me there', 'Later'],
        defaultId: 0
    }).then(returned => {
        if (returned.response === 0) shell.openExternal('https://github.com/Chit132/abyss-overlay/releases/latest');
    });
});

const execPath = app.isPackaged ? path.join(process.resourcesPath, 'app.asar.unpacked', 'exec') : path.join(__dirname, 'exec');
var forceJAR = true;
function runJAR(event) {
    exec('javaw -jar key-sender.jar slash.w50 w h o enter', { cwd: execPath }, function(error, stdout, stderr) {
        console.log('jar ran');
        if (error != null) {
            console.log('JAR AUTOWHO ERROR:\n' + stderr);
            console.log(error);
            event.reply('autowho-err');
        }
        else forceJAR = true;
    });
}
ipcMain.on('autowho', (event) => {
    console.log('autowho');
    if (!forceJAR && process.platform === 'win32') {
        exec('wscript autowho.vbs', { cwd: execPath }, function(error, stdout, stderr) {
            if (error != null) {
                console.log('VBS AUTOWHO ERROR:\n' + stderr);
                console.log(error);
                runJAR(event);
            }
        });
    }
    else runJAR(event);
});

ipcMain.on('focus', (event, focusable) => {
    win.setFocusable(focusable);
    if (focusable) win.focus();
    else {
        win.blur();
        setTimeout(() => win.setSkipTaskbar(false), 100);
    }
});

ipcMain.on('setKeybind', (event, bind, keybind) => {
    setKeybind(bind, keybind)
});
