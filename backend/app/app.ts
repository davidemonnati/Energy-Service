import 'reflect-metadata';
import { useContainer as typeormUseContainer, createConnection } from 'typeorm';
import { Container } from 'typedi';
import { createExpressServer, useContainer as routingUseContainer } from 'routing-controllers';
import { ApartmentController } from './controllers/apartment.controller';
import { ConsumptionController } from './controllers/consumption.controller';

typeormUseContainer(Container)
routingUseContainer(Container)

const port = process.env.PORT || 3008;

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