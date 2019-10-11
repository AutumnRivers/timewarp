var shell = require('shelljs');
var twVer = require('electron').remote.app.getVersion();
var exec = require('child_process').exec;

function timewarp() {
		
	document.getElementById('tw-ver').innerHTML = twVer;
	getVersion();

	const adbExists = shell.which('adb');
	shell.config.execPath = shell.which('node');
	if(!adbExists) return;
	var devices = shell.exec('adb devices', {async: true}, listDevices(code, output));

}

function getVersion() {
	if(!shell.which('adb')) {
		document.getElementById('tech-details').innerHTML = 'ADB not installed. Timewarp will fail.';
	} else {
		shell.exec('adb version', {async: true}, function(c, o) { document.getElementById('tech-details').innerHTML = o.split('\n')[0] });
	}
}

function listDevices(c, d) {
	var deviceList = d.split('\n');
	if(!deviceList[2]) return; // Start at [2] because the first two newlines have nothing to do with what devices exist.

	var devices = 0; //TODO: Finish this
}