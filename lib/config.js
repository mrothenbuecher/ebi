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
      custom_data: {},
      lang:{
        customers: "Kunden",
        dossiers: "Vorgänge",
        customer: "Kunde",
        dossier: "Vorgang",
        create_customer : "Kunde anlegen",
        create_dossier : "Vorgang anlegen",
        edit_customer : "Kunden ändern",
        edit_dossier : "Vorgang ändern",
        info_customer : 'Es gibt noch keine Kunden, du solltest einen Kunden <a href="#" class="alert-link add_customer">anlegen.</a>',
        info_dossier :'Es gibt noch keine Vorgänge, du solltest einen Vorgang <a href="#" class="alert-link add_dossier">anlegen.</a>',
        company: "Firma",
        name: "Name",
        street: "Straße",
        zipcode: "PLZ",
        town:"Ort",
        search_customer:"Name, Firma, PLZ oder Ort",
        dossier_type:"Vorgangsart",
        number: "Nummer",
        date: "Datum",
        starttext:"Anfangstext",
        endtext:"Endtext",
        texts :"Texte",
        positions: "Positionen",
        pos_number:"Pos.",
        pos_desc:"Beschreibung",
        pos_amount: "Menge",
        pos_unit:"Einheit",
        pos_price:"Preis",
        pos_value:"Wert",
        sum:"Nettobetrag",
        tax:"MwSt. (19%)",
        total:"Endbetrag",
        saved: "gespeichert",
        saveing_failed :"speichern fehlgeschlagen",
        copied: "kopiert",
        copied_failed :"kopieren fehlgeschlagen",
        deleted: "gelöscht"
      }
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
