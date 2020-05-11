
import express = require('express');
import { connect } from 'mqtt';
import * as request from 'request-promise-native';


const app: express.Application = express();

const port = process.env.PORT || 3000;
const brokerAddr = process.env.BROKERADDR || 'mqtt://localhost';
const backendUrl = process.env.BACKENDADDR || 'http://localhost:3008';
var client = connect(brokerAddr);


client.subscribe('#');

client.on('message', function (topic, message){
  var consumptionArray = String(message).split('_');
  var dateTime = consumptionArray[0].split('T');
  consumptionArray[0] = dateTime[0] + ' ' + dateTime[1];

  getApartment(backendUrl + '/apartments/' + topic)
  .then( function(data) {
    saveData(consumptionArray, data);
  })
})

async function getApartment(url: string): Promise<String> {
  var options = {
    uri: url,
  };
  return JSON.parse(await request.get(options)).id;
}

async function saveData(consumptionArray: string[], idApartment: String){
  var JSONData = {
    'datetime': consumptionArray[0],
    'value': consumptionArray[1],
    'apartment': idApartment
  }
  await request.post({
    url: backendUrl + '/consumptions/',
    body: JSONData,
    json: true
  }, function(err, response, body){
    console.log(body);
  })
}

app.listen(port, function () {
  console.log('MQTT storage service started on port ' + port + '!');
});