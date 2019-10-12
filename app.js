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

    var menu = Menu.buildFromTemplate([
        {
            "label": "Timewarp",
            "submenu": [
                {"label": "Settings"},
                {"label": "About"},
                {"label": "Quit"},
                {"label": "Connect to Remote ADB",
                click() {
                    win.webContents.send('open-adb-vex-input');
                }}
            ]
        },
        {
            "label": "TWRP",
            "submenu": [
                {"label": "Quick Backup"},
                {"label": "Quick Restore"},
                {"label": "Quick Sideload"},
                {"label": "Backup TWRP"},
                {"label": "Update TWRP"}
            ]
        },
        {
            "label": "Advanced",
            "submenu": [
                {"label": "Custom Backup"},
                {"label": "Custom Restore"},
                {"label": "Advanced Sideload"},
                {"label": "ADB Shell"},
                {"label": "Restart ADB Service"},
                {"label": "Quick Toggle Logcat"}
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);

    win.loadFile('./pages/startup.html');
}

app.on('ready', startApp);
