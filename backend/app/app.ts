import 'reflect-metadata';
import { useContainer as typeormUseContainer, createConnection } from 'typeorm';
import { Container } from 'typedi';
import { connect } from "mqtt";
import { createExpressServer, useContainer as routingUseContainer } from 'routing-controllers';
import { ApartmentController } from './controllers/apartment.controller';
import { ConsumptionController } from './controllers/consumption.controller';
import { ApartmentService } from "./services/apartment.service";
import { ConsumptionRepository } from './repositories/consumption.repository';


typeormUseContainer(Container)
routingUseContainer(Container)

const port = process.env.PORT || 3008;
const mqttAddr = process.env.MQTTADDR || "mqtt://90.147.42.37"

var apartmentService: ApartmentService;

var client = connect(mqttAddr);

client.subscribe('#');

client.on('message', function (topic, message){
    console.log(topic);
    console.log(String(message));
  })

const app = createExpressServer({
    controllers: [
        ApartmentController,
        ConsumptionController,
    ],
    classTransformer: true,
    validation: true
});

app.listen(port, () => {
    console.log("Service listening on port " + port);
})

createConnection()
.then(async connection => {
    console.log("Database connection started successfully");
})
.catch(error => console.log(error))