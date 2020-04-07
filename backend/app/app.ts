import 'reflect-metadata';
import { useContainer as typeormUseContainer, createConnection } from 'typeorm';
import { Container } from 'typedi';
import { createExpressServer, useContainer as routingUseContainer, Action } from 'routing-controllers';
import { ApartmentController } from './controllers/apartment.controller';
import { ConsumptionController } from './controllers/consumption.controller';
import { isUndefined } from 'util';
import { initializeApp, credential, auth } from 'firebase-admin';

typeormUseContainer(Container)
routingUseContainer(Container)

const port = process.env.PORT || 3008;

const app = createExpressServer({
    cors: true,
    controllers: [
        ApartmentController,
        ConsumptionController,
    ],
    authorizationChecker: async(action: Action) => {
        try{
            var idToken = action.request.headers['authorization'].split(' ')[1];
            const decodedToken = await auth().verifyIdToken(idToken)
                .then(function(decodedToken){
                    return decodedToken.uid;
                })
                .catch(function(err){
                    console.log(err);
                })

                if(isUndefined(decodedToken))
                    return false;
                
                return true;
        }
        catch{
            return false;
        }
    },
    classTransformer: true,
    validation: true
});

app.listen(port, () => {
    var serviceAccount = require('../ServiceAccountKey.json');
    initializeApp({
        credential: credential.cert(serviceAccount),
        databaseURL: 'https://energyservice-679ff.firebaseio.com'
    });
    
    console.log("Service listening on port " + port);
})

createConnection()
.then(async connection => {
    console.log("Database connection started successfully");
})
.catch(error => console.log(error))