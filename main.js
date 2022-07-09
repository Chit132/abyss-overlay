const { app, BrowserWindow, globalShortcut, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const shell = require('electron').shell;
const electron_log = require('electron-log'); electron_log.catchErrors({ showDialog: true }); Object.assign(console, electron_log.functions);
const isDev = require('electron-is-dev');
const path = require('path');
const { exec } = require('child_process');

if (process.platform === 'win32') app.setAppUserModelId('AbyssOverlay');

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
}

app.whenReady().then(() => {
    createWindow();
    globalShortcut.register('CommandOrControl+Shift+A', () => {
        if (win.isVisible()) win.hide();
        else{win.showInactive(); win.moveTop();}
    });
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