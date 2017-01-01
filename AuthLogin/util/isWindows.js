this.isOSX = process.platform == 'darwin';
this.isWindows = /\\/.test(__dirname) || this.isOSX;
this.isLinux = !(this.isWindows || this.isOSX);
