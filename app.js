const { app, BrowserWindow, ipcMain, Menu } = require('electron');
var path = require('path');
var fs = require('fs');
var unix = require('shelljs');

function startApp() {

    let win = new BrowserWindow({
        width: 858,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: false
        },
		frame: true,
		icon: './logo-icon.png'
    });

    /*var menu = Menu.buildFromTemplate(require('./menu.json'));
    Menu.setApplicationMenu(menu);*/

    win.loadFile('./pages/startup.html');
}

app.on('ready', startApp);
