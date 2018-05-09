var http = require('http');
var path = require('path');
var fs = require('fs');

// get Config
const config = require('./lib/config.js').getConfig();

// pdf stuff
var pdf = require('html-pdf');
// express
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session')
var favicon = require('serve-favicon')


if (!fs.existsSync(__dirname + '/db')){
    fs.mkdirSync(__dirname + '/db');
}

// data storage
var db = require('diskdb');
db.connect(__dirname + '/db', ['customers', 'dossiers', 'settings']);

// for server side pdf rendering
var mustache = require('mustache')

// var invoice_template = fs.readFileSync(__dirname+"/public/mst/invoice.mst", "utf8");

function formatCurrency(number) {
  return parseFloat(Math.round(number * 100) / 100).toFixed(2);
}

function addLineBreaks(str) {
  return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

startServer();

var app;

function startServer() {
  if (!app) {
    // Create a web server to serve files and listen to WebSocket connections
    app = express();

    //ejs
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public'));

    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

    // bodyParser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    //may edit session secret
    // Session config
    app.use(session({
      secret: "top_secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 36000000
      }
    }))

    // Main
    app.get('/', function(req, res) {
      var data = {};
      data.customers = db.customers.find();
      data.dossiers = db.dossiers.find();
      data.settings = db.settings.find();
      data.config = config;
      res.render('main', data);
    });

    // customer
    app.post('/customer', function(req, res) {
      var response;
      if (req.body._id) {
        response = db.customers.update({
          _id: req.body._id
        }, req.body, {
          upsert: true
        });
      } else {
        response = db.customers.save(req.body);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(response));
    });

    app.get('/customer/(:id)', function(req, res) {
      if (!req.params.id) {
        return res.status(400).send('not id was given');
      }
      var response = db.customers.findOne({
        _id: req.params.id
      });
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(response));
    });

    app.get('/customers', function(req, res) {
      var response = db.customers.find();
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(response));
    });

    app.delete('/customer/(:id)', function(req, res) {
      if (!req.params.id) {
        return res.status(400).send('not id was given');
      }
      var response = db.customers.remove({
        _id: req.params.id
      });
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(response));
    });

    // dossier
    app.post('/dossier', function(req, res) {
      var response;
      if (req.body._id) {
        response = db.dossiers.update({
          _id: req.body._id
        }, req.body, {
          upsert: true
        });
      } else {
        response = db.dossiers.save(req.body);
      }
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(response));
    });

    app.get('/dossier/(:id)', function(req, res) {
      if (!req.params.id) {
        return res.status(400).send('not id was given');
      }
      var response = db.dossiers.findOne({
        _id: req.params.id
      });
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(response));
    });

    app.delete('/dossier/(:id)', function(req, res) {
      if (!req.params.id) {
        return res.status(400).send('not id was given');
      }
      var response = db.dossiers.remove({
        _id: req.params.id
      });
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(response));
    });

    app.get('/dossier/print/(:id)', function(req, res) {
      if (!req.params.id) {
        return res.status(400).send('not id was given');
      }
      var response = db.dossiers.findOne({
        _id: req.params.id
      });

      var customer = db.customers.findOne({
        _id: response.customer_id
      });

      response.customer = customer;

      var sum = 0;
      for (var i = 0; i < response.positions.length; i++) {
        sum += (response.positions[i].amount * response.positions[i].price);
        response.positions[i].sum = formatCurrency(response.positions[i].amount * response.positions[i].price);
        response.positions[i].desc_html = addLineBreaks(response.positions[i].desc);
      }

      response.starttext_html = addLineBreaks(response.starttext);
      response.endtext_html = addLineBreaks(response.endtext);

      response.sum = formatCurrency(sum);
      response.tax = formatCurrency(config.tax(sum));
      response.final = formatCurrency(sum + config.tax(sum));

      response.currency = config.currency;
      response.custom_data = config.custom_data;

      var invoice_template = fs.readFileSync(__dirname + "/public/mst/dossier.mst", "utf8");

      var html = mustache.render(invoice_template, response);

      pdf.create(html, config.print).toStream((err, stream) => {
        if (err) return res.end(err.stack)
        res.setHeader('Content-type', 'application/pdf')
        stream.pipe(res)
      })
    });


    //app.use(express.static('static'));
    var server = http.createServer(app);

    // Connect any incoming WebSocket connection to ShareDB
    if (config.public) {
      server.listen(config.port);
      console.log('Listening on http://<public>:' + config.port);
    } else {
      server.listen(config.port, 'localhost');
      console.log('Listening on http://localhost:' + config.port);
    }

  }
}
