const { app, BrowserWindow, ipcMain, shell } = require('electron');
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
        frame: true
    });

    win.loadFile('./pages/startup.html');
}

app.on('ready', startApp);