const {app, BrowserWindow, globalShortcut} = require('electron');
/*const path = require('path');
const url = require('url');*/

//const is_mac = process.platform === 'darwin';
let win, splash;
function createWindow(){
    splash = new BrowserWindow({width: 400, height: 400, transparent: true, frame: false, alwaysOnTop: true, skipTaskbar: true, show: false});
    splash.loadFile('src/splash.html');
    win = new BrowserWindow({width: 800, height: 600, show: false, frame: false, transparent: true, resizable: true, useContentSize: true, maximizable: false, minWidth: 400, icon: __dirname+'/assets/logo.ico', alwaysOnTop: true, title: 'Abyss Overlay', focusable: false, skipTaskbar: false, hasShadow: true, webPreferences: {nodeIntegration: true, enableRemoteModule: true, contextIsolation: false}});
    win.loadFile('src/index.html');
    //win.webContents.openDevTools();
    win.on('closed', () => {win = null});
    splash.once('ready-to-show', () => {
        splash.show();
        setTimeout(() => {splash.destroy(); win.show(); setTimeout(() => {win.setSkipTaskbar(false);}, 1000);}, 4500);
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
    globalShortcut.register('CommandOrControl+Shift+F9', () => {
        win.webContents.openDevTools({mode: 'detach'});
    });
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