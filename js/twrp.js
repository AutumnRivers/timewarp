var shell = require('shelljs');

var Store = require('electron-store');
var storage = new Store();

function backupDevice(adbId, isQuick) {
    if(!adbId) return;
    if(isQuick) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        
        if(dd<10) {
            dd = '0'+dd
        } 
        
        if(mm<10) {
            mm = '0'+mm
        } 
        
        today = mm + dd + yyyy;

        shell.mkdir('backups/' + adbId + '/');
        // For quick backups, we backup the /system, /data, and /boot partitions.
        // Typically, this is what you'd backup if you just do a casual backup like every month
        // Quick backups should NOT be performed before big events, such as installing a custom ROM
        shell.exec('adb backup -s ' + adbId + ' -f backups/' + adbId + '/' + today + '.ab --twrp system data boot', (c, o) => {
            if(o.startsWith('adb: unable to connect')) {
                //TODO: 
            } else {

            }
        });
    } else {

    }
}

function restoreDevice(adbId, isQuick, path) {
    if(isQuick) {
        var files = shell.ls('backups/' + adbId + '/');
        if(!files['stdout']) 
        var latestFile = files[0];
    } else {
        if(!path) throw "No path specified.";
        var files = shell.ls(path);
        if(!files['stdout']) throw "Empty directory, or directory does not exist"
        var latestFile = files[0];
    }
}

function twrp(id, args) {
    shell.exec('adb devices', (c, o) => {
        var isInRecovery = shell.echo(o).grep(id).grep('recovery');
        if(!isInRecovery) {
            // Restart the device in recovery mode
            shell.exec('adb -s ' + id + ' reboot recovery', () => {
                var attempts;
                /* After rebooting the device, there will be a moment where it will not show up on ADB.
                We have to prepare for this.
                Check `adb devices` every second - or whatever the user set as a retry interval - and see if the device is on there.
                By default, only 10 attempts is allowed before it gives up. However, the user can change how many attempts go into it. */
                var findDeviceInterval = setInterval(() => {
                    if(attempts > (storage.get('settings.attempts') || 10)) clearInterval(findDeviceInterval);
                    shell.exec('adb devices', (code, out) => {
                        attempts++
                        var expectedDevice = shell.echo(out).grep(id);
                        if(expectedDevice) {
                            clearInterval(findDeviceInterval);
                            determineMethod();
                        }
                    })
                }, (storage.get('settings.retryInterval') || 1000));
            })
        } else {
            determineMethod();
        }
    });

    function determineMethod() {
        if(args.method == 'backup') {
            backupDevice(id, args.quick);
        } else if(args.method == 'restore') {
            restoreDevice(id, args.quick);
        }
    }
}

function handleAdvancedBackup() {
    //TODO: This
}

function handleAdvancedRestore() {
    //TODO: This
}

function handleAdvancedFlash() {
    //TODO: This
}

function handleWipe() {
    // EXPERIMENTAL: Can only be enabled by starting the app with the '--enable-wipe' flag.
    // This function is VERY DANGEROUS and should be used only with EXTREME caution!
    if(!storage.get('settings.enableWipe') || remote.getGlobal('experimentalFeaturesWipe') !== 'enabled') {
        console.error('handleWipe() was called, but the wipe feature was not enabled! Please read the README for more info.');
        return;
    }
}