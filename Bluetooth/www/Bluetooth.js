var exec = require('cordova/exec');

var BTPrinter = {
  list: function(fnSuccess, fnError){
    exec(fnSuccess, fnError, "Bluetooth", "list", []);
  },
  connect: function(fnSuccess, fnError, name){
    exec(fnSuccess, fnError, "Bluetooth", "connect", [name]);
  },
  disconnect: function(fnSuccess, fnError){
    exec(fnSuccess, fnError, "Bluetooth", "disconnect", []);
  },
  print: function(fnSuccess, fnError, str){
    exec(fnSuccess, fnError, "Bluetooth", "print", [str]);
  },
  printText: function(fnSuccess, fnError, str){
    exec(fnSuccess, fnError, "Bluetooth", "printText", [str]);
  },
  printImage: function(fnSuccess, fnError, str){
    exec(fnSuccess, fnError, "Bluetooth", "printImage", [str]);
  },
  printImage2: function(fnSuccess, fnError, str){
      exec(fnSuccess, fnError, "Bluetooth", "printImage2", [str]);
  },
  printLogoImage: function(fnSuccess, fnError, str){
    exec(fnSuccess, fnError, "Bluetooth", "printLogoImage", [str]);
  },
  printLogoImage2: function(fnSuccess, fnError, str){
exec(fnSuccess, fnError, "Bluetooth", "printLogoImage2", [str]);
  },
  printPOSCommand: function(fnSuccess, fnError, str){
    exec(fnSuccess, fnError, "Bluetooth", "printPOSCommand", [str]);
  },
  drawCanvas: function(fnSuccess, fnError, str){
    exec(fnSuccess, fnError, "Bluetooth", "drawCanvas", [str]);
  }
};

module.exports = BTPrinter;
