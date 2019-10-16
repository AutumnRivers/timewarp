var shell = require('shelljs');

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

function restoreDevice(adbId, isQuick) {
    if(isQuick) {
        var files = shell.ls('backups/' + adbId + '/');
        var latestFile = files.split('\n')[0];
        console.log(latestFile);
    }
}

function bootRecovery(id, args) {
    shell.exec('adb devices', (c, o) => {
        var isInRecovery = shell.echo(o).grep('id').grep('recovery');
        if(isInRecovery) {
            shell.exec('adb -s ' + id + ' reboot recovery', () => {
                if(args.method == 'recovery') {
                    backupDevice(id, args.quick);
                } else if(args.method == 'restore') {
                    restoreDevice(id, args.quick);
                }
            })
        } else {
            if(args.method == 'recovery') {
                backupDevice(id, args.quick);
            } else if(args.method == 'restore') {
                restoreDevice(id, args.quick);
            }
        }
    });
}