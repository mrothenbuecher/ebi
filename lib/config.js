var local_config = require('../config.js').config;
var fs = require('fs');

class Config {

  extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
  }

  constructor(){
    this.defaultConfig = {
      port: 8000,
      public: false,
      currency: "€",
      tax: function(val){
        return (val*1.19)-val;
      },
      print : {
        format: 'A4',
        border: {
          top: "0mm",
          right: "10mm",
          bottom: "0mm",
          left: "20mm"
        }
      },
      custom_data: {}
    };

    this.currentConfig = {};
    this.currentConfig = this.extend(this.currentConfig, this.defaultConfig, local_config);

    //runs on HEROKU
    if(process.env.HEROKU){
      console.log("Running on heroku");
      this.currentConfig.public = true;
      this.currentConfig.port = process.env.PORT;
    }

  }

  getConfig(){
    return this.currentConfig;
  }

}

module.exports = new Config();
