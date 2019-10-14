const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
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

    win.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    var menu = Menu.buildFromTemplate([
        {
            "label": "Timewarp",
            "submenu": [
                {"label": "Settings",
                click() {
                    win.webContents.send('show-settings-modal');
                }},
                {"label": "About",
                click() {
                    win.webContents.send('show-about-modal');
                }},
                {"label": "Quit"},
                process.env.NODE_ENV == 'dev' ? {"label": "Inspect", click() { win.webContents.openDevTools(); }} : {"type":"separator"},
                {"label": "Connect to Remote ADB",
                click() {
                    win.webContents.send('open-adb-vex-input');
                }}
            ]
        },
        {
            "label": "TWRP",
            "submenu": [
                {"label": "Backup TWRP"},
                {"label": "Update TWRP"}
            ]
        },
        {
            "label": "Advanced",
            "submenu": [
                {"label": "ADB Shell"},
                {"label": "Restart ADB Service",
                click() {
                    unix.exec('adb kill-server', { async: true });
                }},
                {"label": "Quick Toggle Logcat"}
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);

    win.loadFile('./pages/startup.html');
}

app.on('ready', startApp);
