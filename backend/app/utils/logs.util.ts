import { Request } from 'express'

export class LogsUtil {
    public static async logRequest(req: Request){
        console.log(`Received ${ req.method } request at ${ req.url } from ${ req.ip }`);
        if(req.body != null){
            console.log("Request BODY:");
            console.log(req.body);
        }
    }
}