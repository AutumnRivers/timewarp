var shell = require('shelljs');
var vex = require('vex-js');
var fetch = require('node-fetch');
var fs = require('fs');
var path = require('path');
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-default';
var os = require('os');

function firstTime() {

    if(!shell.which('abd')) {
        console.error('ADB not detected on system. Prompting ADB install.');
        vex.dialog.buttons.YES.text = "Let's go!";
        vex.dialog.buttons.NO.text = "I'll pass!";

        vex.dialog.confirm({
            message: 'ADB was not found in your system PATH. If you want, Timewarp can install it for you and automatically add it to your PATH. You may need a restart afterwards, though.',
            callback: (confirmed) => {
                if(confirmed) {
                    vex.dialog.alert('Awesome! Please wait while we setup ADB for you.');

                    // Download ADB
                    downloadADB();
                } else {
                    vex.dialog.buttons.YES.text = "OK";
                    vex.dialog.alert('Timewarp will continue without ADB. Please note that almost all features will fail without ADB installed.');
                }
            }
        })
    } else {
        console.debug('ADB detected: ' + shell.which('adb'));
    }

}

function downloadADB() {
    var adbFile = fs.createWriteStream('adb-tools.zip');
    const unzip = require('unzipper');
    var adbURL;

    // Figure out which version of ADB we should be downloading
    // We don't need Fastboot.
    if(os.platform == 'win32') adbURL = 'http://dl.google.com/android/repository/platform-tools-latest-windows.zip';
    if(os.platform == 'darwin') adbURL = 'http://dl.google.com/android/repository/platform-tools-latest-darwin.zip';
    if(os.platform == 'linux') adbURL = 'http://dl.google.com/android/repository/platform-tools-latest-linux.zip';

    fetch(adbURL).then(res => {
        var adbStream = res.body.pipe(adbFile);
        adbFile.on('finish', () => {
            console.log('ADB ZIP downloaded.')
            var exPipe = fs.createReadStream('./adb-tools.zip').pipe(unzip.Extract( { path: './adb/' } ));
            exPipe.on('finish', () => {
                // Add ADB to the system PATH. This, theoritically, should be the same regardless of OS.
                process.env.PATH = process.env.PATH + (path.join(__dirname, './adb/platform-tools')) + ';';
                console.log('ADB successfully installed.');
                vex.dialog.alert('ADB was successfully installed and added to your system PATH. If you still get errors saying ADB does not exist, restart Timewarp.');
            })
        });
    });
}