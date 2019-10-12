<h1 align="center"><img src="./logo.png"/></h1>

<div align="center">
<img src="https://david-dm.org/SmartieCodes/timewarp.svg">
<img src="https://img.shields.io/github/license/SmartieCodes/timewarp">
</div>

---
**Table Of Contents**

* [Heads Up](#warnings)
* [Requirements](#requirements)
* [About](#about)
    * [Features](#features)
* [Local Development](#developing-locally)
* [LICENSE](#license)
* [Donate](#donate)
* [Support](#support)
    * [Contact](#contact-me)
---

# Warnings
1. Timewarp is meant for use with the TWRP custom recovery for Android. There is no guarantee that other recoveries will work.
2. I am not responsible for any loss of data that may come from this application. That's on you.
3. I am not responsible for any breakage that may come from this application. I've tested it myself.
4. I am not responsible for any voiding of warranties on Android devices that may come from this application.

Now that we got that out of the way, on to the good stuff!

---

# Requirements
## Minimal
* ADB 1.0 or later (Timewarp will install this if you don't have it)
* Android Device 5.0+
* TWRP Custom Recovery 2.8+
* HDD with at least 20GB of storage

## Recommended
* ADB 1.0.3 or later (Again, Timewarp will install this if needed.)
* Rooted Android Device 7.1+
* TWRP Custom Recovery 3.1.1+
* SSD with at least 50GB of storage

Please note that Timewarp will check your device for these requirements, and will refuse to run anything on your device if it does not meet the minimal requirements.

Backups and Restores do not work on TWRP 2.9 and earlier. However, sideloading ROMs and updating TWRP does.

---

# About
Timewarp is an unofficial desktop client for the TWRP custom recovery. It relies on the Android Debug Bridge (ADB) and TWRP's connection to it.

Timewarp allows you to make full backups of your Android device, directly to your PC. You can even choose what gets backed up. And of course, it's really easy to restore backups from Timewarp.

It is recommended you have space for at *least* two backups, which usually equates to about... 50GB in total. The app itself is fairly small.

## Features
* Easy backup / restore integration with TWRP
* Update / Backup your TWRP recovery
* Sideload custom ROMs
* Schedule backup reminders

---

# Developing Locally
Local development with Timewarp is also very simple.

1. Clone the repo

`git clone https://www.github.com/SmartieCodes/timewarp.git`

2. Go to the directory

`cd timewarp`

3. Install required packages

`npm install`

4. Profit!

`npm start` / `npm run disable-gpu`

Yep, that's pretty much it. Timewarp takes care of everything else.

---

# License

Timewarp is licensed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

---

# Donate

If you like Timewarp, consider donating to help support my development!

---

# Support

Need some help? Timewarp not working for you? Backups freezing? Broken marriage? I can't help you with that last one, but I can do my best to help you with Timewarp!

## Contact Me

Discord: `Autumn#5434`

Twitter: `@NatiRivers`

E-Mail: `smarti3plays@gmail.com`

Matrix: `@autumnrivers:matrix.org`