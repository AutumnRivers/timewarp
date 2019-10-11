var shell = require('shelljs');
var twVer = require('electron').remote.app.getVersion();
shell.config.silent = true;

function timewarp() {
		
	document.getElementById('tw-ver').innerHTML = twVer;
	getVersion();

	const adbExists = shell.which('adb');
	shell.config.execPath = shell.which('node');
	if(!adbExists) return;
	var devices = shell.exec('adb devices', {async: true}, (code, output) => {
		document.getElementById('device-scan').innerHTML = '<div class=progress id="loading"><div class="indeterminate"></div></div><p>Scanning for devices...</p>';
		listDevices(code, output);
	});

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
	if(!deviceList[1]) {
		document.getElementById('device-list').innerHTML = '<h4>No Devices Found</h4><p>Plug in your Android device to your PC with a USB-C to USB-A converter.</p>';
		var refresh = setInterval(() => {
			refreshList();
			clearInterval(refresh);
		}, 60000);
		addRefreshButton(refresh);
	}
	// Start at [1] because the first newline has nothing to do with what devices exist.
	deviceList.shift();
	deviceList.pop();
	deviceList.pop();

	var listHTML = [];
	var devicesAdded = 0;
	var devices = deviceList.forEach((device, i) => {
		//<div class=android-device><h3>ANDROID ID</h3><p>Android Version<p>0 Backup(s)</p><a class="blue btn waves-effect waves-light">Select Device</a></div>
		shell.exec('adb shell settings get secure android_id', {async: true}, (c, id) => {
			shell.exec('adb shell getprop ro.build.version.release', {async: true}, (code, ver) => {
				devicesAdded++;
				listHTML.push('<div class="android-device"><h3>' + id + '</h3><p>Android ' + ver + '<p>0 Backup(s)</p><a class="blue btn waves-effect waves-light select-btn">Select Device</a></div>');
				if(devicesAdded == deviceList.length) {
					finishUp();
				}
			});
		});
	});

	function finishUp() {
		const finalHTML = listHTML.join('<br/>');
		document.getElementById('device-list').innerHTML = finalHTML;
		var refresh = setInterval(() => {
			refreshList();
			clearInterval(refresh);
		}, 120000);
		addRefreshButton(refresh);
	}
}

function refreshList() {
	const adbExists = shell.which('adb');
	shell.config.execPath = shell.which('node');
	if(!adbExists) return;
	var devices = shell.exec('adb devices', {async: true}, (code, output) => {
		document.getElementById('device-scan').innerHTML = '<div class=progress id="loading"><div class="indeterminate"></div></div><p>Scanning for devices...</p>';
		listDevices(code, output);
	});
}

function addRefreshButton(r) {
	document.getElementById('device-scan').innerHTML = '<a class="blue btn waves-effect waves-light" onclick="refreshList(); clearInterval(' + r + ');">Refresh List</a>';
}