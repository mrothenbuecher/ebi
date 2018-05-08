var local_config = require('../config.json');
var fs = require('fs');

class Config {
  constructor(){
    this.defaultConfig = {
      port: 8000,
      public: false,
      currency: "€",
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
    this.currentConfig = Object.assign(this.currentConfig, this.defaultConfig, local_config);

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
