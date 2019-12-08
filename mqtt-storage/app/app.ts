
import express = require('express');
import { connect } from "mqtt";
import * as request from "request-promise-native";


const app: express.Application = express();

const port = process.env.PORT || 3000;
const brokerAddr = process.env.BROKERADDR || "mqtt://localhost";
const backendUrl = process.env.BACKENDADDR || "http://localhost:3008";
var client = connect(brokerAddr);


client.subscribe('#');

client.on('message', function (topic, message){
  var topicArray = topic.split('/');
  var consumptionArray = String(message).trim().split(/\s+/);

  getApartment(backendUrl + '/apartments/' + topicArray[0] + '/' + topicArray[1])
  .then( function(data) {
    saveData(consumptionArray, data, topicArray);
  })
})

async function getApartment(url: string): Promise<String> {
  var options = {
    uri: url,
  };
  return JSON.parse(await request.get(options)).uuid;
}

async function saveData(consumptionArray: string[], uuidApartment: String, topic: string[]){
  var JSONData = {
    'date': consumptionArray[0],
    'time': consumptionArray[1],
    'value': consumptionArray[2],
    'apartment': uuidApartment
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
