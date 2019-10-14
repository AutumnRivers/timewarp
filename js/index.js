var shell = require('shelljs');
var twVer = require('electron').remote.app.getVersion();
var M = require('materialize-css');
var ipc = require('electron').ipcRenderer;
shell.config.silent = true;

var vex = require('vex-js');
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-default';

var Store = require('electron-store');
var storage = new Store();

function timewarp() {
	M.AutoInit();
	ipc.on('open-adb-vex-input', () => {
		vex.dialog.prompt({
			message: 'Type in the remote ADB URI.',
			placeholder: '192.168.0.10:5555',
			callback: (adbIp) => {
				if(!adbIp) return;
				shell.exec('adb connect ' + adbIp, (c, o) => {
					shell.config.silent = false;
					if(o.startsWith('unable to connect')) {
						shell.echo('Connection to Remote ADB server failed:\n\n' + o);
						shell.config.silent = true;
					} else {
						shell.echo('Connection to remote ADB server established.');
						shell.config.silent = true;
					}
				})
			}
		})
	});

	ipc.on('show-about-modal', () => {
		M.Modal.getInstance(document.querySelector('#about-modal')).open();
	});

	ipc.on('show-settings-modal', () => {
		M.Modal.getInstance(document.querySelector('#settings-modal')).open();
	});
		
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
		document.getElementById('device-list').innerHTML = '<h4>No Devices Found</h4><p>Plug in your Android device to your PC with a USB-C to USB-A converter.</p><p>Alternatively, if you\'re able to connect to it over WiFi, you can do so by going to the menu: Timewarp &rarr; Connect to Remote ADB</p>';
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
		if(!device.indexOf('.')) var device = device.slice(0, -1);
		//<div class=android-device><h3>ANDROID ID</h3><p>Android Version<p>0 Backup(s)</p><a class="blue btn waves-effect waves-light">Select Device</a></div>
		shell.exec('adb shell settings get secure android_id', {async: true}, (c, id) => {
			shell.exec('adb shell getprop ro.build.version.release', {async: true}, (code, ver) => {
				devicesAdded++;
				if(!id) return console.error(device + ' is unauthorized or corrupted. Troubleshooting tips:\n1. Unlock your phone and allow your computer through USB Debugging.\n2. Boot into TWRP.');

				storage.get('settings.displayDevice') == 'id' ? id = id : id = device.split('	')[0];

				listHTML.push('<div class="android-device"><h3>' + id + '</h3><p>Android ' + ver + '<p>0 Backup(s)</p><a class="blue btn waves-effect waves-light select-btn modal-trigger"  onclick="openDeviceModal(\'' + device + '\')" href="#device-modal">Select Device</a></div>');
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

function openDeviceModal(device) {
	var deviceNum = device.split('	')[0];
	shell.exec('adb shell getprop ro.product.manufacturer', (code, output) => {
		shell.exec('adb shell getprop ro.product.model', (c, o) => {
			document.getElementById('device-details').innerHTML = output + ' ' + o;
			document.getElementById('adb-id').value = deviceNum;
		})
	});
}